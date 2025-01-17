// MediSage\src\app\api\verify-subscription\route.ts
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { getSubscription } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {  // Removed unused request parameter
  try {
    // Get userId from Clerk auth
    const { userId } = await auth();  // Added await here
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First check our database
    const dbSubscription = await getSubscription(userId);

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
          planName: dbSubscription.planName,
          status: stripeSubscription.status,
          expiryDate: currentPeriodEnd.toISOString(),
          cancelAtPeriodEnd: isCanceled
        });
      } catch (stripeError) {
        console.error('Error verifying with Stripe:', stripeError);
        // If Stripe verification fails, fall back to DB data
      }
    }

    // Fallback to database information if Stripe verification fails or isn't available
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