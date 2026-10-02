import type { ReactNode } from "react";
import { SiteFooter } from "../site-footer";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <main className="container-page flex-1 py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="label text-[0.625rem] text-muted">Last updated {updated}</p>
          <h1 className="display mt-2 text-5xl sm:text-7xl">{title}</h1>
          <div className="mt-8 space-y-6 leading-relaxed [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-medium [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
