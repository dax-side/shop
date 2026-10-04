import "server-only";

export function json<T>(data: T, init?: ResponseInit) {
  return Response.json(data, init);
}

export function apiError(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

export const unauthorized = () => apiError(401, "Sign in to continue.");

// Mutating endpoints only accept JSON, which also forces a CORS preflight for cross-site requests.
export async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json")) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Absolute base URL of this deployment, for links and image URLs in API responses.
export function originOf(request: Request) {
  return new URL(request.url).origin;
}
