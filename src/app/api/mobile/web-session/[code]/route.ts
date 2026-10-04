import { NextResponse, type NextRequest } from "next/server";
import { isSafeNextPath, redeemWebSessionCode } from "@/lib/handoff";
import { createSession, sessionCookieName, webDeviceLabel } from "@/lib/sessions";

// GET /api/mobile/web-session/<code>?next=/checkout, opened in the phone's browser. Swaps the
// one-time code for a website session cookie, then continues to `next`.
export async function GET(request: NextRequest, ctx: RouteContext<"/api/mobile/web-session/[code]">) {
  const nextParam = request.nextUrl.searchParams.get("next") ?? "/checkout";
  const next = isSafeNextPath(nextParam) ? nextParam : "/checkout";

  const userId = await redeemWebSessionCode((await ctx.params).code);
  if (!userId) {
    return NextResponse.redirect(new URL(`/sign-in?${new URLSearchParams({ callbackUrl: next })}`, request.url), 303);
  }

  const session = await createSession(userId, "web", webDeviceLabel(request.headers.get("user-agent")));
  const { name, secure } = sessionCookieName(request);
  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(name, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    expires: session.expires,
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
