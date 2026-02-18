// MediSage\src\app\api\verify-subscription\route.ts
import { stripe } from '@/lib/stripe';
import { NextResponse, NextRequest } from 'next/server';
import { getSubscription, updateSubscription } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If session_id is provided (from success page), check Stripe directly
    // This bypasses the webhook race condition
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Force-update MongoDB immediately (don't wait for webhook)
          await updateSubscription(userId, {
            subscriptionId: subscription.id,
            customerId: session.customer,
            planName: session.metadata?.planName || 'basic',
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          });

          console.log('Direct Stripe check: subscription verified and DB updated for user:', userId);

          return NextResponse.json({
            planName: session.metadata?.planName || 'basic',
            status: subscription.status,
            expiryDate: new Date(subscription.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          });
        }
      } catch (sessionError) {
        console.error('Error checking session directly:', sessionError);
        // Fall through to normal DB check below
      }
    }

    // Normal flow: check our database
    const dbSubscription = await getSubscription(userId);
    
    console.log('DB Subscription:', dbSubscription);

    // If no subscription found in DB, return basic plan
    if (!dbSubscription) {
      return NextResponse.json({
        planName: 'basic',
        status: 'inactive',
        expiryDate: null
      });
    }

    // Verify with Stripe if we have a subscription ID
    if (dbSubscription.subscriptionId) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          dbSubscription.subscriptionId
        );

        // Update response based on current Stripe status
        const isActive = stripeSubscription.status === 'active';
        const isCanceled = stripeSubscription.cancel_at_period_end;
        const currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);

        // If subscription is canceled or expired, return basic plan
        if (!isActive || (currentPeriodEnd < new Date())) {
          return NextResponse.json({
            planName: 'basic',
            status: 'inactive',
            expiryDate: null
          });
        }

        // Return active subscription details
        return NextResponse.json({
          planName: dbSubscription.planName, // Keep the original planName from DB
          status: stripeSubscription.status,
          expiryDate: currentPeriodEnd.toISOString(),
          cancelAtPeriodEnd: isCanceled
        });
      } catch (stripeError) {
        console.error('Error verifying with Stripe:', stripeError);
      }
    }

    // Fallback to database information
    return NextResponse.json({
      planName: dbSubscription.planName,
      status: dbSubscription.status,
      expiryDate: dbSubscription.currentPeriodEnd,
      cancelAtPeriodEnd: dbSubscription.cancelAtPeriodEnd
    });

  } catch (error) {
    console.error('Error verifying subscription:', error);
    return NextResponse.json(
      { error: 'Error verifying subscription' },
      { status: 500 }
    );
  }
}
