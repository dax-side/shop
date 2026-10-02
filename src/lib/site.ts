// Store details shown across the site and in emails, set in the environment.
// Address, hours, phone and email are optional: anything that uses them is hidden until they're set.
export const site = {
  name: "Oja Supply Co.",
  city: "Lagos, Nigeria",
  storeAddress: process.env.STORE_ADDRESS || undefined,
  openingHours: process.env.STORE_OPENING_HOURS || undefined,
  phone: process.env.STORE_PHONE || undefined,
  email: process.env.STORE_EMAIL || undefined,
  deliveryDays: process.env.DELIVERY_DAYS || "3–5",
  returnWindowDays: process.env.RETURN_WINDOW_DAYS || "14",
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

// "at 12 Allen Avenue. Open Mon–Sat, 9am–6pm." with whichever parts are set.
export function pickupDetails() {
  return [site.storeAddress && ` at ${site.storeAddress}`, ".", site.openingHours && ` Open ${site.openingHours}.`]
    .filter(Boolean)
    .join("");
}
