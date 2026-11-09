import { createHash, timingSafeEqual } from "node:crypto";

// The admin password lives in the ADMIN_PASSWORD environment variable on
// Vercel — never in this (public) repository.
export function isConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export function isAuthorized(password: string | null | undefined): boolean {
  // Trim both sides so a stray space pasted into the Vercel setting doesn't lock you out.
  const expected = process.env.ADMIN_PASSWORD?.trim();
  password = password?.trim();
  if (!expected || !password) return false;
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(password).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

// Vercel names the Blob key BLOB_READ_WRITE_TOKEN, or <PREFIX>_BLOB_READ_WRITE_TOKEN
// when a prefix was chosen while connecting the store. Accept either.
export function blobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const key = Object.keys(process.env).find((k) => k.endsWith("BLOB_READ_WRITE_TOKEN") && process.env[k]);
  return key ? process.env[key] : undefined;
}

// A store connected over OIDC (Vercel's current default) provides BLOB_STORE_ID
// instead of a read-write token; the SDK then authenticates automatically.
export function blobConfigured(): boolean {
  return Boolean(blobToken() || process.env.BLOB_STORE_ID);
}

export const NO_BLOB_TOKEN =
  "Blob storage isn't connected to this deployment (no BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN). Connect the Blob store to the project for Production and redeploy.";
