import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink">
      <div className="container-page flex flex-col gap-1 py-6 font-mono text-[0.6875rem] sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>
          {site.storeAddress} · {site.phone}
        </span>
      </div>
    </footer>
  );
}
