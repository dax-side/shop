import { json, unauthorized } from "@/lib/api/http";
import { getRequestUser } from "@/lib/api/request-user";
import { getSavedAddresses } from "@/lib/account";

// GET /api/me/addresses: delivery addresses used on past orders, newest first.
export async function GET(request: Request) {
  const user = await getRequestUser(request);
  if (!user) return unauthorized();
  return json({ addresses: await getSavedAddresses(user.id) });
}
