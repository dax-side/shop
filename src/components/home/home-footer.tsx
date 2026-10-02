import Link from "next/link";
import { rooms } from "@/lib/catalogue";
import { site } from "@/lib/site";
import { NewsletterForm } from "./newsletter-form";

export function HomeFooter() {
  const help = [
    { href: "/#how-it-works", label: "Delivery" },
    { href: "/#how-it-works", label: "Returns" },
    { href: "/#how-it-works", label: "Visit the store" },
    { href: "/terms", label: "Terms of sale" },
    { href: "/privacy", label: "Privacy" },
    { href: `mailto:${site.email}`, label: site.email },
    { href: `tel:${site.phone}`, label: site.phone },
  ];

  return (
    <footer className="overflow-hidden">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-12">
        <div className="col-span-2 md:col-span-6 lg:col-span-5">
          <p className="font-serif text-3xl leading-tight">Get a short note when new stock lands.</p>
          <NewsletterForm />
        </div>

        <FooterColumn title="Shop" className="md:col-span-3 lg:col-start-7">
          {rooms.map((room) => (
            <li key={room.slug}>
              <Link href={`/?room=${room.slug}#catalogue`} className="hover:underline">
                {room.name}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Help" className="md:col-span-3 lg:col-start-10">
          {help.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </FooterColumn>
      </div>

      <div className="border-t border-ink">
        <div className="container-page flex justify-between pt-3 font-mono text-[0.625rem]">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>{site.city}</span>
        </div>
        <p
          aria-hidden
          className="display container-page -mb-[0.2em] mt-2 text-center text-[21vw] leading-[0.8] whitespace-nowrap"
        >
          Oja Supply
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <h2 className="label text-[0.625rem] text-muted">{title}</h2>
      <ul className="mt-2 space-y-1 text-sm">{children}</ul>
    </div>
  );
}
