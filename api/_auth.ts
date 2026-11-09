import { createHash, timingSafeEqual } from "node:crypto";

// The admin password lives in the ADMIN_PASSWORD environment variable on
// Vercel — never in this (public) repository.
export function isAuthorized(password: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSWORD;
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
