"use server";

import { z } from "zod";
import { MAX_QUANTITY } from "./bag-store";
import { getProduct } from "./catalogue";
import { NIGERIAN_STATES, normalisePhone } from "./nigeria";
import { orderTotals } from "./pricing";
import { pricing } from "./site";

const PAYMENT_METHODS = ["card", "bank-transfer", "ussd"] as const;

const bagSchema = z
  .array(
    z.object({
      slug: z.string().max(100),
      finish: z.string().max(50).optional(),
      quantity: z.number().int().min(1).max(MAX_QUANTITY),
    }),
  )
  .min(1, "Your bag is empty.")
  .max(50);

const text = (label: string, max = 120) =>
  z.string().trim().min(1, `Enter your ${label}.`).max(max, `Keep your ${label} under ${max} characters.`);

const contactSchema = z.object({
  email: z.email("Enter a valid email address.").max(254).toLowerCase(),
  phone: z
    .string()
    .transform((value, ctx) => {
      const phone = normalisePhone(value);
      if (!phone) ctx.addIssue({ code: "custom", message: "Enter a Nigerian phone number, e.g. 080 0000 0000." });
      return phone ?? "";
    }),
  payment: z.enum(PAYMENT_METHODS, "Choose how you'd like to pay."),
});

const addressSchema = z.object({
  firstName: text("first name", 60),
  lastName: text("last name", 60),
  street: text("street address", 200),
  landmark: z.string().trim().max(200).optional(),
  area: text("area or LGA", 100),
  state: z.enum(NIGERIAN_STATES, "Choose a state."),
});

const pickupSchema = z.object({
  firstName: text("first name", 60),
  lastName: text("last name", 60),
});

export type CheckoutField =
  | keyof z.infer<typeof contactSchema>
  | keyof z.infer<typeof addressSchema>
  | "bag"
  | "method";

export type PlacedOrder = {
  reference: string;
  email: string;
  firstName: string;
  method: "delivery" | "pickup";
  subtotal: number;
  delivery: number;
  total: number;
};

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<CheckoutField, string>> }
  | { status: "success"; order: PlacedOrder };

function fieldErrors(error: z.ZodError) {
  const errors: Partial<Record<CheckoutField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as CheckoutField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

function failure(errors: Partial<Record<CheckoutField, string>>): CheckoutState {
  return { status: "error", message: "Check the highlighted fields and try again.", fieldErrors: errors };
}

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const values = Object.fromEntries(
    [...formData.entries()].filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
  const method = values.method === "pickup" ? "pickup" : values.method === "delivery" ? "delivery" : null;
  if (!method) return failure({ method: "Choose delivery or pickup." });

  let rawBag: unknown;
  try {
    rawBag = JSON.parse(values.bag ?? "[]");
  } catch {
    rawBag = [];
  }
  const bag = bagSchema.safeParse(rawBag);
  const contact = contactSchema.safeParse(values);
  const address = (method === "delivery" ? addressSchema : pickupSchema).safeParse(values);

  const errors = {
    ...(bag.success ? {} : { bag: bag.error.issues[0]?.message ?? "Your bag is empty." }),
    ...(contact.success ? {} : fieldErrors(contact.error)),
    ...(address.success ? {} : fieldErrors(address.error)),
  };
  if (!bag.success || !contact.success || !address.success) return failure(errors);

  // Price every line from the catalogue; the client's prices are never used.
  const lines = [];
  for (const item of bag.data) {
    const product = getProduct(item.slug);
    const finishValid = product?.finishes.length
      ? product.finishes.some((f) => f.name === item.finish)
      : item.finish === undefined;
    if (!product || !finishValid) {
      return failure({ bag: "Something in your bag is no longer available. Remove it and try again." });
    }
    lines.push({ product, finish: item.finish, quantity: item.quantity, lineTotal: product.price * item.quantity });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const totals = orderTotals(subtotal, method, pricing);

  return {
    status: "success",
    order: {
      reference: `OJA-${Date.now().toString(36).toUpperCase()}`,
      email: contact.data.email,
      firstName: address.data.firstName,
      method,
      ...totals,
    },
  };
}
