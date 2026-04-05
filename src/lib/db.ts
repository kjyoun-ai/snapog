import Database from "better-sqlite3";
import { randomBytes } from "crypto";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "snapog.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        plan TEXT NOT NULL DEFAULT 'free',
        stripe_customer_id TEXT,
        monthly_limit INTEGER NOT NULL DEFAULT 100,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        active INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS usage_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_key_id INTEGER NOT NULL REFERENCES api_keys(id),
        endpoint TEXT NOT NULL DEFAULT '/api/og',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_usage_key_month ON usage_log(api_key_id, created_at);
      CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
    `);
  }
  return db;
}

export function generateApiKey(): string {
  return `sog_${randomBytes(24).toString("hex")}`;
}

export function createApiKey(email: string, plan: string = "free", stripeCustomerId?: string): { key: string; id: number } {
  const d = getDb();
  const key = generateApiKey();
  const limits: Record<string, number> = { free: 100, starter: 5000, pro: 50000, enterprise: 500000 };
  const monthlyLimit = limits[plan] || 100;

  const result = d.prepare(
    "INSERT INTO api_keys (key, email, plan, stripe_customer_id, monthly_limit) VALUES (?, ?, ?, ?, ?)"
  ).run(key, email, plan, stripeCustomerId || null, monthlyLimit);

  return { key, id: result.lastInsertRowid as number };
}

export function validateApiKey(key: string): { valid: boolean; keyId?: number; plan?: string; remaining?: number } {
  const d = getDb();
  const row = d.prepare("SELECT id, plan, monthly_limit, active FROM api_keys WHERE key = ?").get(key) as {
    id: number; plan: string; monthly_limit: number; active: number;
  } | undefined;

  if (!row || !row.active) return { valid: false };

  const usage = d.prepare(
    "SELECT COUNT(*) as count FROM usage_log WHERE api_key_id = ? AND created_at >= datetime('now', 'start of month')"
  ).get(row.id) as { count: number };

  const remaining = row.monthly_limit - usage.count;
  if (remaining <= 0) return { valid: false, keyId: row.id, plan: row.plan, remaining: 0 };

  return { valid: true, keyId: row.id, plan: row.plan, remaining };
}

export function recordUsage(apiKeyId: number): void {
  const d = getDb();
  d.prepare("INSERT INTO usage_log (api_key_id) VALUES (?)").run(apiKeyId);
}

export function getKeyByEmail(email: string): { key: string; plan: string; monthly_limit: number } | undefined {
  const d = getDb();
  return d.prepare("SELECT key, plan, monthly_limit FROM api_keys WHERE email = ? AND active = 1").get(email) as {
    key: string; plan: string; monthly_limit: number;
  } | undefined;
}

export function upgradeKey(stripeCustomerId: string, plan: string): void {
  const d = getDb();
  const limits: Record<string, number> = { free: 100, starter: 5000, pro: 50000, enterprise: 500000 };
  d.prepare("UPDATE api_keys SET plan = ?, monthly_limit = ? WHERE stripe_customer_id = ?")
    .run(plan, limits[plan] || 100, stripeCustomerId);
}
