import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/auth";
import { SiteFooter } from "@/components/site-footer";
import { getOrdersForUser, STATUS_LABELS } from "@/lib/account";
import { signOutOfAccount } from "@/lib/auth-actions";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };

const dateFormat = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });

export default async function AccountPage() {
  const user = await currentUser();
  if (!user?.id) redirect("/sign-in?callbackUrl=/account");

  const orders = await getOrdersForUser(user.id);

  return (
    <>
      <main className="container-page flex-1 py-10 sm:py-14">
        <div className="flex flex-col gap-4 border-b border-ink pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label text-[0.625rem]">Your account</p>
            <h1 className="display mt-1 text-5xl sm:text-7xl">Hello{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
            <p className="mt-2 text-sm text-muted">{user.email}</p>
          </div>
          <form action={signOutOfAccount}>
            <button type="submit" className="h-10 rounded-full border border-ink px-5 text-sm hover:bg-ink hover:text-paper">
              Sign out
            </button>
          </form>
        </div>

        <h2 className="label mt-10 text-[0.625rem]">Your orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-muted">
            No orders yet.{" "}
            <Link href="/#catalogue" className="text-ink underline underline-offset-2">
              Shop the catalogue
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 border-t border-ink">
            {orders.map((order) => (
              <li key={order.id} className="border-b border-line">
                <Link
                  href={`/orders/${order.id}`}
                  className="grid grid-cols-2 gap-1 py-4 hover:bg-ink/[0.03] sm:grid-cols-4 sm:items-center"
                >
                  <span className="font-mono text-sm">{order.reference}</span>
                  <span className="text-right text-sm text-muted sm:text-left">{dateFormat.format(order.createdAt)}</span>
                  <span className="text-sm">{STATUS_LABELS[order.status]}</span>
                  <span className="text-right font-mono text-sm">{formatNaira(order.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
