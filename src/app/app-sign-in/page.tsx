import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/auth";
import { Logo } from "@/components/logo";
import { isAllowedAppRedirect, isCodeChallenge } from "@/lib/handoff";

export const metadata: Metadata = { title: "Sign in to the app", robots: { index: false, follow: false } };

// Opened by the mobile app in the phone's browser. Signs in with the website account, then asks
// before handing that account to the app.
export default async function AppSignInPage({ searchParams }: PageProps<"/app-sign-in">) {
  const params = await searchParams;
  const redirectUri = params.redirect_uri;
  const codeChallenge = params.code_challenge;
  const state = typeof params.state === "string" ? params.state.slice(0, 200) : "";
  const valid = isAllowedAppRedirect(redirectUri) && isCodeChallenge(codeChallenge);

  if (valid && !(await currentUser())) {
    const here = `/app-sign-in?${new URLSearchParams({ redirect_uri: redirectUri, code_challenge: codeChallenge, state })}`;
    redirect(`/sign-in?${new URLSearchParams({ callbackUrl: here })}`);
  }
  const user = valid ? await currentUser() : null;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Logo />
      {valid && user ? (
        <>
          <h1 className="display mt-10 text-5xl">Open the app</h1>
          <p className="mt-3 font-serif text-2xl italic">
            Continue as {user.name ?? user.email}?
          </p>
          <p className="mt-2 text-sm text-muted">
            The Oja app will use this account ({user.email}), so your bag and orders follow you.
          </p>
          <form method="post" action="/api/mobile/auth/approve" className="mt-8">
            <input type="hidden" name="redirect_uri" value={redirectUri} />
            <input type="hidden" name="code_challenge" value={codeChallenge} />
            <input type="hidden" name="state" value={state} />
            <button type="submit" className="h-14 w-full rounded-full bg-ink text-base text-paper hover:bg-ink/85">
              Continue to the app
            </button>
          </form>
          <p className="mt-6 text-xs text-muted">
            Not you?{" "}
            <Link href="/account" className="text-ink underline underline-offset-2">
              Sign out on the website
            </Link>
            , then try again from the app.
          </p>
        </>
      ) : (
        <>
          <h1 className="display mt-10 text-5xl">Link expired</h1>
          <p className="mt-3 text-muted">This sign-in link isn&apos;t valid. Go back to the app and tap sign in again.</p>
        </>
      )}
    </main>
  );
}
