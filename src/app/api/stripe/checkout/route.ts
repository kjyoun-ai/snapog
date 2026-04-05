import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { priceId, email } = body;

  if (!priceId) {
    return NextResponse.json({ error: "priceId required" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { priceId },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/#pricing`,
  });

  return NextResponse.json({ url: session.url });
}
