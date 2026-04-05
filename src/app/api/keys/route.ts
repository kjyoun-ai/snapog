import { NextRequest, NextResponse } from "next/server";
import { createApiKey, getKeyByEmail } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const existing = await getKeyByEmail(email);
  if (existing) {
    return NextResponse.json({
      key: existing.key,
      plan: existing.plan,
      monthlyLimit: existing.monthly_limit,
      message: "Existing key returned",
    });
  }

  const { key } = await createApiKey(email);
  return NextResponse.json({
    key,
    plan: "free",
    monthlyLimit: 100,
    message: "API key created. Include it as ?key= parameter or x-api-key header.",
  }, { status: 201 });
}
