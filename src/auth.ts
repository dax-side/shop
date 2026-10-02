import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { connection } from "next/server";
import Google from "next-auth/providers/google";
import { getDb, schema } from "@/db";

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
  }),
  // Reads AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET from the environment.
  providers: [Google],
  session: { strategy: "database" },
  pages: { signIn: "/sign-in", error: "/sign-in" },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
}));

export function authConfigured() {
  return Boolean(process.env.AUTH_SECRET && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

// Returns the signed-in user, or null when signed out or auth isn't configured.
export async function currentUser() {
  await connection();
  if (!authConfigured()) return null;
  try {
    const session = await auth();
    return session?.user?.id ? session.user : null;
  } catch (error) {
    console.error("auth() failed", error);
    return null;
  }
}

// Only allow redirects back into this site.
export function safeCallbackUrl(value: unknown, fallback = "/account") {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")
    ? value
    : fallback;
}
