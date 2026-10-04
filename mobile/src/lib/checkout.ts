import * as WebBrowser from "expo-web-browser";
import { api } from "./api";

// Checkout runs on the website (Paystack, delivery details). The app asks for a one-time link that
// opens the website already signed in to the same account, so the same bag is there.
export async function openOnWebsite(path: string) {
  const { url } = await api<{ url: string }>("/api/mobile/web-session", { method: "POST", body: { next: path } });
  await WebBrowser.openBrowserAsync(url);
}
