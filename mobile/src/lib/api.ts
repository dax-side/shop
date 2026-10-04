import { API_URL } from "./config";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

let token: string | null = null;
let onUnauthorized: (() => void) | null = null;

// The session sets these once it knows who is signed in.
export function setApiToken(value: string | null) {
  token = value;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

type Options = { method?: string; body?: unknown; signal?: AbortSignal; auth?: boolean };

// Calls the website's API with the app's Bearer token and returns the parsed JSON.
export async function api<T>(path: string, { method = "GET", body, signal, auth = true }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(0, "Can't reach the shop. Check your connection.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && auth && token) onUnauthorized?.();
    throw new ApiError(response.status, (data as { error?: string } | null)?.error ?? "Something went wrong.");
  }
  return data as T;
}
