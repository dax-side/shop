import "server-only";
import { z } from "zod";
import { CartError, getCart } from "@/lib/cart";
import { apiError, json, originOf, unauthorized } from "./http";
import { getRequestUser, type RequestUser } from "./request-user";

export const lineSchema = z.object({
  slug: z.string().min(1).max(100),
  finish: z.string().min(1).max(50).optional(),
  quantity: z.number().int().min(1).max(100).default(1),
});

// Runs a cart handler for the signed-in user and answers with the updated cart.
export async function withCart(request: Request, handler: (user: RequestUser) => Promise<Response | void>) {
  const user = await getRequestUser(request);
  if (!user) return unauthorized();
  try {
    const response = await handler(user);
    return response ?? json(await getCart(user.id, originOf(request)));
  } catch (error) {
    if (error instanceof CartError) return apiError(422, error.message);
    throw error;
  }
}
