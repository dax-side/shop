import Link from "next/link";
import { site } from "@/lib/site";
import { BagButton } from "./bag/bag-button";
import { SearchIcon, UserIcon } from "./icons";
import { Logo } from "./logo";

const nav = [
  { href: "/#catalogue", label: "Shop all" },
  { href: "/#rooms", label: "Rooms" },
  { href: "/#how-it-works", label: "Visit the store" },
  { href: "/#about", label: "About" },
];

export function SiteHeader() {
  return (
    <header>
      <div className="bg-ink text-paper">
        <div className="container-page flex h-8 items-center justify-center font-mono text-[0.6875rem] sm:justify-between">
          <span>Delivery across Lagos in 1–2 days</span>
          <span className="hidden sm:inline">Pickup at {site.storeAddress}</span>
          <span className="hidden sm:inline">Returns within {site.returnWindowDays} days</span>
        </div>
      </div>

      <div className="border-b border-ink">
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-8 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/#catalogue" aria-label="Search the catalogue" className="hidden md:block">
              <SearchIcon />
            </Link>
            <Link href="/account" aria-label="Your account">
              <UserIcon />
            </Link>
            <BagButton />
          </div>
        </div>
      </div>
    </header>
  );
}
