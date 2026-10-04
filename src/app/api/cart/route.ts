import { withCart } from "@/lib/api/cart-route";
import { clearCart } from "@/lib/cart";

// GET /api/cart: the signed-in user's bag.
export async function GET(request: Request) {
  return withCart(request, async () => {});
}

// DELETE /api/cart: empty the bag.
export async function DELETE(request: Request) {
  return withCart(request, async (user) => {
    await clearCart(user.id);
  });
}
