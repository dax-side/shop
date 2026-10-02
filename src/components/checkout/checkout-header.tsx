import Link from "next/link";
import { ArrowLeftIcon, LockIcon } from "../icons";
import { Logo } from "../logo";

export function CheckoutHeader() {
  return (
    <header className="border-b border-ink">
      <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        <div>
          <Link href="/bag" aria-label="Back to bag" className="sm:hidden">
            <ArrowLeftIcon width={20} height={20} />
          </Link>
          <span className="hidden sm:block">
            <Logo />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="sm:hidden">
            <Logo tagline="Checkout" />
          </span>
          <span className="label hidden items-center gap-2 text-[0.625rem] sm:flex">
            <LockIcon width={12} height={12} /> Secure checkout
          </span>
        </div>
        <div className="flex justify-end">
          <Link href="/#catalogue" className="hidden text-xs underline underline-offset-2 sm:block">
            Keep shopping
          </Link>
          <LockIcon width={18} height={18} className="sm:hidden" aria-label="Secure checkout" />
        </div>
      </div>
    </header>
  );
}
