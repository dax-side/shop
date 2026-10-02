// Store details shown across the site and in emails.
// Set these in the environment; the bracketed fallbacks match the design placeholders.
export const site = {
  name: "Oja Supply Co.",
  city: "Lagos, Nigeria",
  storeAddress: process.env.STORE_ADDRESS || "[STORE ADDRESS]",
  openingHours: process.env.STORE_OPENING_HOURS || "[OPENING HOURS]",
  phone: process.env.STORE_PHONE || "[PHONE]",
  email: process.env.STORE_EMAIL || "[EMAIL]",
  deliveryDays: process.env.DELIVERY_DAYS || "[DELIVERY DAYS]",
  returnWindowDays: process.env.RETURN_WINDOW_DAYS || "[RETURN WINDOW]",
};

function amount(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && value !== "" ? parsed : fallback;
}

// Delivery pricing in naira. Override the defaults in the environment.
export const pricing = {
  deliveryFee: amount(process.env.DELIVERY_FEE, 3500),
  freeDeliveryThreshold: amount(process.env.FREE_DELIVERY_THRESHOLD, 50000),
};

// Absolute URL of the site, for payment callbacks and email links. On Vercel this falls back
// to the production domain (or the preview URL) when NEXT_PUBLIC_SITE_URL isn't set.
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const vercelHost =
    process.env.VERCEL_ENV === "production" ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;
  return vercelHost ? `https://${vercelHost}` : "http://localhost:3000";
}
