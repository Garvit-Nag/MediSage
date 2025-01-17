import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { updateSubscription, deleteSubscription } from '@/lib/db';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log("Webhook received");
  const body = await req.text();
  const headersList = headers();
  const signature = (await headersList).get('Stripe-Signature');

  if (!signature) {
    console.log("No stripe signature found");
    return new NextResponse('No signature found', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    console.log("Webhook event constructed successfully:", event.type);
    console.log("Event data:", JSON.stringify(event.data.object, null, 2));
  } catch (err: unknown) {
    console.error("Webhook construction error:", err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const userId = session.metadata?.userId;
        if (!userId) {
          throw new Error('No userId found in session metadata');
        }

        await updateSubscription(userId, {
          subscriptionId: subscription.id,
          customerId: session.customer,
          planName: session.metadata?.planName || 'basic',
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        // Find the userId from metadata or customer
        const userId = subscription.metadata?.userId;
        if (!userId) {
          throw new Error('No userId found in subscription metadata');
        }

        await updateSubscription(userId, {
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          planName: subscription.cancel_at_period_end ? 'basic' : subscription.metadata?.planName
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) {
          throw new Error('No userId found in subscription metadata');
        }

        await deleteSubscription(userId);
        break;
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook processing error:', errorMessage);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }
}