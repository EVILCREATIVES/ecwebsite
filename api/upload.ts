import { issueSignedToken } from "@vercel/blob";
import {
  handleUpload,
  handleUploadPresigned,
  type HandleUploadBody,
  type HandleUploadPresignedBody,
} from "@vercel/blob/client";
import { blobConfigured, blobToken, isAuthorized, json, NO_BLOB_TOKEN } from "./_auth.js";

// Lets the admin page upload images and videos straight from the browser to
// Vercel Blob (no function body-size limit on large videos).
//
// Two flows are supported:
// - "blob.generate-presigned-url" (used by the admin page): works with stores
//   connected over OIDC (BLOB_STORE_ID), Vercel's current default.
// - "blob.generate-client-token": the older flow, which needs BLOB_READ_WRITE_TOKEN.

const ALLOWED_TYPES = ["image/*", "video/*"];
const MAX_BYTES = 200 * 1024 * 1024;

function passwordFrom(clientPayload: string | null): string | undefined {
  try {
    return JSON.parse(clientPayload ?? "{}").password;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: { type?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  if (!blobConfigured()) return json({ error: NO_BLOB_TOKEN }, 503);

  try {
    if (body.type === "blob.generate-presigned-url" || body.type === "blob.upload-completed") {
      const result = await handleUploadPresigned({
        body: body as HandleUploadPresignedBody,
        request,
        getSignedToken: async (pathname, clientPayload) => {
          if (!isAuthorized(passwordFrom(clientPayload))) throw new Error("Unauthorized");
          const token = await issueSignedToken({
            pathname,
            operations: ["put"],
            allowedContentTypes: ALLOWED_TYPES,
            maximumSizeInBytes: MAX_BYTES,
            token: blobToken(),
          });
          return {
            token,
            urlOptions: { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true },
          };
        },
      });
      return json(result);
    }

    const token = blobToken();
    if (!token) {
      return json({ error: "This upload method needs BLOB_READ_WRITE_TOKEN; reload the admin page and try again." }, 400);
    }
    const result = await handleUpload({
      token,
      body: body as HandleUploadBody,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!isAuthorized(passwordFrom(clientPayload))) throw new Error("Unauthorized");
        return { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
    });
    return json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error(err);
    return json({ error: message }, message === "Unauthorized" ? 401 : 400);
  }
}
