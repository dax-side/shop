import type { NextRequest } from "next/server";
import { json, originOf, unauthorized } from "@/lib/api/http";
import { getRequestUser } from "@/lib/api/request-user";
import { getCart, getCartVersion } from "@/lib/cart";

// Long-poll: holds the request until the cart's version moves past `?version=` (or ~25s pass),
// then answers. Clients call it again straight away, so a change on one device shows up on the
// other within a second without websockets.
export const maxDuration = 60;

const WAIT_MS = 25_000;
const CHECK_EVERY_MS = 700;

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => (clearTimeout(timer), resolve()), { once: true });
  });

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) return unauthorized();

  const known = Number(request.nextUrl.searchParams.get("version") ?? "-1");
  const deadline = Date.now() + WAIT_MS;

  while (!request.signal.aborted) {
    const version = await getCartVersion(user.id);
    if (version !== known) {
      return json({ changed: true, cart: await getCart(user.id, originOf(request)) });
    }
    if (Date.now() >= deadline) break;
    await sleep(CHECK_EVERY_MS, request.signal);
  }

  return json({ changed: false, version: known });
}
