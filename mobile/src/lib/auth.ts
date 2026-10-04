import * as Crypto from "expo-crypto";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { api } from "./api";
import { API_URL } from "./config";
import type { User } from "./types";

// Signing in goes through the website, so the app uses the same Google account:
// 1. open /app-sign-in in the phone's browser with a PKCE challenge;
// 2. the customer signs in on the website and confirms;
// 3. the website sends the browser back to the app with a one-time code;
// 4. the app swaps the code and its PKCE verifier for its own session token.

export type AppSession = { token: string; expiresAt: string; user: User };

const toBase64Url = (base64: string) => base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function randomString(bytes: number) {
  const values = Crypto.getRandomBytes(bytes);
  return toBase64Url(btoa(String.fromCharCode(...values)));
}

function deviceLabel() {
  if (Platform.OS === "ios") return Platform.isPad ? "iPad" : "iPhone";
  if (Platform.OS === "android") {
    const model = (Platform.constants as { Model?: string }).Model;
    return model ? model.slice(0, 60) : "Android phone";
  }
  return "Web app";
}

let pending: { state: string; verifier: string } | null = null;
let exchange: Promise<AppSession> | null = null;
const listeners = new Set<(session: AppSession) => void>();

export function onSignIn(listener: (session: AppSession) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Handles the redirect back from the website. It can arrive two ways (the auth session's result,
// or a deep link into the /auth route), so the first one wins and the other is ignored.
export function completeSignIn(url: string): Promise<AppSession> | null {
  const { queryParams } = Linking.parse(url);
  const code = typeof queryParams?.code === "string" ? queryParams.code : null;
  const state = typeof queryParams?.state === "string" ? queryParams.state : null;
  if (!code || !pending || state !== pending.state) return exchange;

  const { verifier } = pending;
  pending = null;
  exchange = api<AppSession>("/api/mobile/auth/token", {
    method: "POST",
    body: { code, codeVerifier: verifier, device: deviceLabel() },
    auth: false,
  });
  exchange.then((session) => listeners.forEach((listener) => listener(session))).catch(() => undefined);
  return exchange;
}

// Returns the new session, or null if the customer closed the browser.
export async function startSignIn(): Promise<AppSession | null> {
  const verifier = randomString(32);
  const challenge = toBase64Url(
    await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, {
      encoding: Crypto.CryptoEncoding.BASE64,
    }),
  );
  const state = randomString(16);
  const redirectUri = Linking.createURL("auth");
  pending = { state, verifier };
  exchange = null;

  const url = `${API_URL}/app-sign-in?${new URLSearchParams({ redirect_uri: redirectUri, code_challenge: challenge, state })}`;
  const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);
  if (result.type === "success") return (completeSignIn(result.url) ?? exchange) as Promise<AppSession> | null;
  // On Android the browser can report "dismiss" just before the deep link lands in /auth.
  return exchange;
}
