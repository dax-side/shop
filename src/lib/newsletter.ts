"use server";

import { getDb, schema } from "@/db";

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { status: "error", message: "Enter a valid email address." };
  }

  try {
    await getDb().insert(schema.subscribers).values({ email }).onConflictDoNothing();
  } catch (error) {
    console.error("subscribe failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success", message: "You're on the list. See you Friday." };
}
