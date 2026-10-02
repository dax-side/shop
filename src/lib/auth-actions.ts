"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeCallbackUrl, signIn, signOut } from "@/auth";

export async function signInWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

// Ends the session in the database, then removes every cookie this site set.
export async function signOutOfAccount() {
  await signOut({ redirect: false });
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) cookieStore.delete(cookie.name);
  redirect("/");
}
