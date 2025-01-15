import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the session ID from URL parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Get the subscription details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = session.subscription as any;  // Using 'any' due to Stripe types complexity
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Calculate expiry date
    const expiryDate = new Date(subscription.current_period_end * 1000).toISOString();

    // Get plan name from session metadata
    const planName = session.metadata?.planName || 'default';

    return NextResponse.json({
      planName,
      expiryDate,
      status: subscription.status,
      customerId: session.customer,
    });

  } catch (error) {
    console.error('Error verifying subscription:', error);
    return NextResponse.json(
      { error: 'Error verifying subscription' },
      { status: 500 }
    );
  }
}