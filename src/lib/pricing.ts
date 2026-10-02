export type FulfilmentMethod = "delivery" | "pickup";

export type PricingConfig = {
  deliveryFee: number;
  freeDeliveryThreshold: number;
};

export function deliveryCharge(subtotal: number, method: FulfilmentMethod, config: PricingConfig) {
  if (method === "pickup" || subtotal >= config.freeDeliveryThreshold) return 0;
  return config.deliveryFee;
}

export function orderTotals(subtotal: number, method: FulfilmentMethod, config: PricingConfig) {
  const delivery = deliveryCharge(subtotal, method, config);
  return { subtotal, delivery, total: subtotal + delivery };
}
