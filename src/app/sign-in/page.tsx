import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authConfigured, currentUser, safeCallbackUrl } from "@/auth";
import { GoogleButton } from "@/components/auth/google-button";
import { ArrowLeftIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ProductPhoto } from "@/components/product-photo";
import { shopShelves } from "@/lib/product-images";

export const metadata: Metadata = { title: "Sign in" };

const copy = {
  "sign-in": {
    title: "Welcome back",
    intro: "Sign in to see your orders and check out faster.",
    button: "Continue with Google",
  },
  create: {
    title: "Make an account",
    intro: "One account for orders, saved details and receipts.",
    button: "Sign up with Google",
  },
};

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const mode = params.mode === "create" ? "create" : "sign-in";
  const text = copy[mode];

  if (await currentUser()) redirect(callbackUrl);

  const tabHref = (tab: string) => `/sign-in?${new URLSearchParams({ mode: tab, callbackUrl })}`;

  return (
    <div className="grid min-h-full flex-1 lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-ink p-10 text-paper lg:flex">
        <Logo />
        <div>
          <ProductPhoto
            tone="#2a2825"
            caption="Shelves inside the shop"
            image={shopShelves}
            className="aspect-[5/4]"
            sizes="(min-width: 1024px) 45vw, 100vw"
            preload
          />
          <p className="mt-8 max-w-sm font-serif text-4xl leading-tight">
            Save your details, track orders and reorder the things you use up.
          </p>
        </div>
        <p className="font-mono text-[0.6875rem]">
          © {new Date().getFullYear()} Oja Supply Co. · Lagos
        </p>
      </aside>

      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ink px-4 lg:hidden">
          <Link href="/" aria-label="Back to the shop">
            <ArrowLeftIcon width={20} height={20} />
          </Link>
          <Logo />
          <span className="w-5" />
        </header>

        <main className="mx-auto w-full max-w-md flex-1 px-4 py-8 lg:flex lg:flex-col lg:justify-center lg:py-16">
          <nav aria-label="Account" className="grid grid-cols-2 rounded-full border border-ink p-1 text-sm">
            {(["sign-in", "create"] as const).map((tab) => (
              <Link
                key={tab}
                href={tabHref(tab)}
                aria-current={mode === tab ? "page" : undefined}
                className={`rounded-full py-2.5 text-center ${mode === tab ? "bg-ink text-paper" : "hover:bg-ink/5"}`}
              >
                {tab === "sign-in" ? "Sign in" : "Create account"}
              </Link>
            ))}
          </nav>

          <h1 className="display mt-6 text-5xl sm:text-6xl">{text.title}</h1>
          <p className="mt-2 text-muted">
            {callbackUrl.startsWith("/app-sign-in") ? "Sign in to continue to the Oja app." : text.intro}
          </p>

          {params.error && (
            <p role="alert" className="mt-6 border border-accent p-3 text-sm text-accent">
              Sign-in didn&apos;t work. Please try again.
            </p>
          )}

          <div className="mt-6">
            {authConfigured() ? (
              <GoogleButton callbackUrl={callbackUrl} label={text.button} size="lg" />
            ) : (
              <p className="border border-ink/30 p-3 text-sm text-muted">
                Google sign-in isn&apos;t set up yet. Add the auth variables from the README.
              </p>
            )}
          </div>

          <p className="mt-6 text-xs text-muted">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-ink underline underline-offset-2">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-ink underline underline-offset-2">
              privacy policy
            </Link>
            .
            {callbackUrl === "/checkout" && (
              <>
                {" "}
                Checking out as a guest?{" "}
                <Link href="/checkout" className="text-ink underline underline-offset-2">
                  Go back to checkout
                </Link>
                .
              </>
            )}
          </p>
        </main>
      </div>
    </div>
  );
}
