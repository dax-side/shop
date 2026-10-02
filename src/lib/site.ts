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
  freeDeliveryThreshold: process.env.FREE_DELIVERY_THRESHOLD || "[FREE DELIVERY THRESHOLD]",
  returnWindowDays: process.env.RETURN_WINDOW_DAYS || "[RETURN WINDOW]",
};
