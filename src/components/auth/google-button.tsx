"use client";

import { useTransition } from "react";
import { signInWithGoogle } from "@/lib/auth-actions";
import { GoogleIcon } from "../icons";

type GoogleButtonProps = {
  callbackUrl: string;
  label: string;
  size?: "md" | "lg";
};

// A plain button (not a form) so it can sit inside other forms, like checkout.
export function GoogleButton({ callbackUrl, label, size = "md" }: GoogleButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const formData = new FormData();
        formData.set("callbackUrl", callbackUrl);
        startTransition(() => signInWithGoogle(formData));
      }}
      className={`flex w-full items-center justify-center gap-3 rounded-full border border-ink bg-white hover:bg-ink/5 disabled:opacity-60 ${
        size === "lg" ? "h-14 text-base" : "h-11 text-sm"
      }`}
    >
      <GoogleIcon />
      {pending ? "Redirecting to Google…" : label}
    </button>
  );
}
