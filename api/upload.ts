import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { blobToken, isAuthorized, json, NO_BLOB_TOKEN } from "./_auth.js";

// Issues short-lived tokens so the admin page can upload images and videos
// straight to Vercel Blob (no function body-size limit on large videos).
export async function POST(request: Request): Promise<Response> {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const token = blobToken();
  if (!token) return json({ error: NO_BLOB_TOKEN }, 503);
  try {
    const result = await handleUpload({
      token,
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let password: string | undefined;
        try {
          password = JSON.parse(clientPayload ?? "{}").password;
        } catch {
          /* fall through to unauthorized */
        }
        if (!isAuthorized(password)) throw new Error("Unauthorized");
        return {
          allowedContentTypes: ["image/*", "video/*"],
          maximumSizeInBytes: 200 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return json({ error: message }, message === "Unauthorized" ? 401 : 400);
  }
}
