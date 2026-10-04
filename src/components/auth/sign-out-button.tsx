"use client";

import { bagStore } from "@/lib/bag-store";
import { signOutOfAccount } from "@/lib/auth-actions";

// Signing out wipes everything the site stored in this browser (bag and any other saved data);
// the server action removes the cookies.
function clearBrowserData() {
  bagStore.signOut();
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // Storage can be blocked; nothing to clear then.
  }
}

export function SignOutButton() {
  return (
    <form action={signOutOfAccount} onSubmit={clearBrowserData}>
      <button type="submit" className="h-10 rounded-full border border-ink px-5 text-sm hover:bg-ink hover:text-paper">
        Sign out
      </button>
    </form>
  );
}
