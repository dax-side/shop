import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/http";
import { getRequestUser } from "@/lib/api/request-user";
import { createAppSignInCode, isAllowedAppRedirect, isCodeChallenge } from "@/lib/handoff";

// POST from the /app-sign-in confirmation form. Issues a one-time code and sends the browser back
// to the app. The session cookie is SameSite=Lax, so other sites can't submit this for a user.
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const redirectUri = form?.get("redirect_uri");
  const codeChallenge = form?.get("code_challenge");
  const state = String(form?.get("state") ?? "").slice(0, 200);
  if (!isAllowedAppRedirect(redirectUri) || !isCodeChallenge(codeChallenge)) {
    return apiError(400, "Invalid sign-in request.");
  }

  const user = await getRequestUser(request);
  if (!user || user.client !== "web") {
    const back = `/app-sign-in?${new URLSearchParams({ redirect_uri: redirectUri, code_challenge: codeChallenge, state })}`;
    return NextResponse.redirect(new URL(back, request.url), 303);
  }

  const code = await createAppSignInCode(user.id, codeChallenge, redirectUri);
  const target = new URL(redirectUri);
  target.searchParams.set("code", code);
  if (state) target.searchParams.set("state", state);
  return new Response(null, { status: 303, headers: { Location: target.toString() } });
}
