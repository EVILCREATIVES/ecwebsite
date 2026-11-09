import { del, list, put } from "@vercel/blob";
import { blobConfigured, blobToken, isAuthorized, isConfigured, json, NO_BLOB_TOKEN } from "./_auth.js";

// Site content edited from /admin is stored as a JSON file in Vercel Blob.
// Every save writes a new file (random suffix) so CDN caching can never serve
// a stale version; older versions are cleaned up after a successful save.
const PREFIX = "site/content";

async function latest() {
  const { blobs } = await list({ prefix: PREFIX, token: blobToken() });
  return blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
}

export async function GET(): Promise<Response> {
  try {
    const [newest] = await latest();
    if (!newest) return json(null, 200, { "cache-control": "no-store" });
    const res = await fetch(newest.url);
    if (!res.ok) throw new Error(`Blob fetch failed: ${res.status}`);
    return json(await res.json(), 200, {
      "cache-control": "public, s-maxage=10, stale-while-revalidate=60",
    });
  } catch (err) {
    console.error(err);
    // The site falls back to its built-in content when this returns null.
    return json(null, 200, { "cache-control": "no-store" });
  }
}

type Item = { src: string; label: string; video?: boolean };

function validItems(v: unknown): v is Item[] {
  return (
    Array.isArray(v) &&
    v.every(
      (i) =>
        i && typeof i === "object" && typeof i.src === "string" && i.src.length > 0 && typeof i.label === "string",
    )
  );
}

export async function PUT(request: Request): Promise<Response> {
  if (!isAuthorized(request.headers.get("x-admin-password"))) {
    return json({ error: "Unauthorized" }, 401);
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const b = body as { works?: { rowOne?: unknown; rowTwo?: unknown }; campaigns?: unknown };
  if (!b?.works || !validItems(b.works.rowOne) || !validItems(b.works.rowTwo) || !validItems(b.campaigns)) {
    return json({ error: "Content does not match the expected shape" }, 400);
  }
  if (!blobConfigured()) return json({ error: NO_BLOB_TOKEN }, 503);
  const content = {
    works: { rowOne: b.works.rowOne, rowTwo: b.works.rowTwo },
    campaigns: b.campaigns,
    updatedAt: new Date().toISOString(),
  };
  const previous = await latest();
  const saved = await put(`${PREFIX}.json`, JSON.stringify(content), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    token: blobToken(),
  });
  if (previous.length) await del(previous.map((p) => p.url), { token: blobToken() });
  return json({ ok: true, url: saved.url, updatedAt: content.updatedAt });
}

// Lets the admin page check a password without saving anything.
export async function POST(request: Request): Promise<Response> {
  if (!isConfigured()) {
    return json({ ok: false, error: "not-configured" }, 503);
  }
  const ok = isAuthorized(request.headers.get("x-admin-password"));
  return json({ ok }, ok ? 200 : 401);
}
