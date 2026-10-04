// The website this app talks to. Override with EXPO_PUBLIC_API_URL (e.g. your computer's LAN
// address while running the website locally).
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || "https://shop-six-red.vercel.app").replace(/\/$/, "");
