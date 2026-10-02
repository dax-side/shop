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
  paymentProvider: process.env.PAYMENT_PROVIDER || "[PAYMENT PROVIDER]",
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
