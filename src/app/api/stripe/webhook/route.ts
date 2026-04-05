import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createApiKey, upgradeKey } from "@/lib/db";

const PLAN_MAP: Record<string, string> = {
  price_starter: "starter",
  price_pro: "pro",
  price_enterprise: "enterprise",
};

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
      const priceId = session.metadata?.priceId || "price_starter";
      const plan = PLAN_MAP[priceId] || "starter";
      await createApiKey(email, plan, customerId);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;
    const plan = PLAN_MAP[priceId] || "starter";
    await upgradeKey(customerId, plan);
  }

  return NextResponse.json({ received: true });
}
