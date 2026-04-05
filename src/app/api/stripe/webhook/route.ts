import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createApiKey, upgradeKey } from "@/lib/db";

function planFromPriceId(priceId: string): string {
  const starterPriceId = process.env.STRIPE_STARTER_PRICE_ID;
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
  if (starterPriceId && priceId === starterPriceId) return "starter";
  if (proPriceId && priceId === proPriceId) return "pro";
  return "starter";
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.customer_details?.email;
    const customerId = session.customer as string;

    if (email) {
      const priceId = session.metadata?.priceId || "";
      const plan = planFromPriceId(priceId);
      await createApiKey(email, plan, customerId);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;
    const plan = planFromPriceId(priceId);
    await upgradeKey(customerId, plan);
  }

  return NextResponse.json({ received: true });
}
