import postgres from "postgres";
import { randomBytes } from "crypto";

const sql = postgres(process.env.DATABASE_URL || "postgres://localhost:5432/snapog", {
  ssl: process.env.DATABASE_URL?.includes("render.com") ? "require" : false,
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
});

let initialized = false;

async function ensureTables(): Promise<void> {
  if (initialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS snapog_api_keys (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'free',
      stripe_customer_id TEXT,
      monthly_limit INTEGER NOT NULL DEFAULT 100,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      active BOOLEAN NOT NULL DEFAULT true
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS snapog_usage_log (
      id SERIAL PRIMARY KEY,
      api_key_id INTEGER NOT NULL REFERENCES snapog_api_keys(id),
      endpoint TEXT NOT NULL DEFAULT '/api/og',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_snapog_usage_key_month ON snapog_usage_log(api_key_id, created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_snapog_api_keys_key ON snapog_api_keys(key)`;
  initialized = true;
}

export function generateApiKey(): string {
  return `sog_${randomBytes(24).toString("hex")}`;
}

export async function createApiKey(email: string, plan: string = "free", stripeCustomerId?: string): Promise<{ key: string; id: number }> {
  await ensureTables();
  const key = generateApiKey();
  const limits: Record<string, number> = { free: 100, starter: 5000, pro: 50000, enterprise: 500000 };
  const monthlyLimit = limits[plan] || 100;

  const [row] = await sql`
    INSERT INTO snapog_api_keys (key, email, plan, stripe_customer_id, monthly_limit)
    VALUES (${key}, ${email}, ${plan}, ${stripeCustomerId || null}, ${monthlyLimit})
    RETURNING id
  `;

  return { key, id: row.id };
}

export async function validateApiKey(key: string): Promise<{ valid: boolean; keyId?: number; plan?: string; remaining?: number }> {
  await ensureTables();
  const [row] = await sql`SELECT id, plan, monthly_limit, active FROM snapog_api_keys WHERE key = ${key}`;

  if (!row || !row.active) return { valid: false };

  const [usage] = await sql`
    SELECT COUNT(*)::int as count FROM snapog_usage_log
    WHERE api_key_id = ${row.id} AND created_at >= date_trunc('month', NOW())
  `;

  const remaining = row.monthly_limit - usage.count;
  if (remaining <= 0) return { valid: false, keyId: row.id, plan: row.plan, remaining: 0 };

  return { valid: true, keyId: row.id, plan: row.plan, remaining };
}

export async function recordUsage(apiKeyId: number): Promise<void> {
  await ensureTables();
  await sql`INSERT INTO snapog_usage_log (api_key_id) VALUES (${apiKeyId})`;
}

export async function getKeyByEmail(email: string): Promise<{ key: string; plan: string; monthly_limit: number } | undefined> {
  await ensureTables();
  const [row] = await sql`SELECT key, plan, monthly_limit FROM snapog_api_keys WHERE email = ${email} AND active = true`;
  return row as { key: string; plan: string; monthly_limit: number } | undefined;
}

export async function upgradeKey(stripeCustomerId: string, plan: string): Promise<void> {
  await ensureTables();
  const limits: Record<string, number> = { free: 100, starter: 5000, pro: 50000, enterprise: 500000 };
  await sql`
    UPDATE snapog_api_keys SET plan = ${plan}, monthly_limit = ${limits[plan] || 100}
    WHERE stripe_customer_id = ${stripeCustomerId}
  `;
}

export async function getKeyBySessionId(stripeSessionId: string): Promise<{ key: string; plan: string; email: string } | undefined> {
  await ensureTables();
  const [row] = await sql`
    SELECT key, plan, email FROM snapog_api_keys
    WHERE stripe_customer_id LIKE ${'%' + stripeSessionId + '%'}
    ORDER BY created_at DESC LIMIT 1
  `;
  return row as { key: string; plan: string; email: string } | undefined;
}
