"use server";

import { safeCallbackUrl, signIn, signOut } from "@/auth";

export async function signInWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function signOutOfAccount() {
  await signOut({ redirectTo: "/" });
}
