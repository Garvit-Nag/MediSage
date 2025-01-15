import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = (await headersList).get('Stripe-Signature');

  if (!signature) {
    return new NextResponse('No signature found', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Calculate expiry date
  const expiryDate = new Date(subscription.current_period_end * 1000).toISOString();

  // Store the expiryDate in a database or send it to the frontend via a response
  console.log(`Subscription expires on: ${expiryDate}`);

  // If integrating with a database, you can save the expiryDate here
  // Example:
  // await database.saveSubscription({ userId, expiryDate });

  break; // Ensure you exit the case block properly
}

    }

    return new NextResponse(null, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }
}
