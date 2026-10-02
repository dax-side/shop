"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/lib/newsletter";

const initialState: SubscribeState = { status: "idle" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, initialState);

  return (
    <form action={action} className="mt-5" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby="newsletter-status"
          className="h-11 w-full rounded-full sm:flex-1 border border-ink bg-paper px-4 text-sm placeholder:text-muted/70 focus:outline-2 focus:outline-offset-2 focus:outline-ink"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-full bg-ink px-5 text-sm text-paper hover:bg-ink/85 disabled:opacity-60"
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p
        id="newsletter-status"
        aria-live="polite"
        className={`mt-2 min-h-5 text-xs ${state.status === "error" ? "text-accent" : "text-muted"}`}
      >
        {state.message}
      </p>
    </form>
  );
}
