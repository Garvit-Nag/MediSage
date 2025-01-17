// MediSage\src\app\api\verify-subscription\route.ts
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { getSubscription } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First check our database
    const dbSubscription = await getSubscription(userId);
    
    console.log('DB Subscription:', dbSubscription); // Add this log

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