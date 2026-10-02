import type { Metadata } from "next";
import { BagView } from "@/components/bag/bag-view";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "Bag" };

export default function BagPage() {
  return (
    <>
      <main className="flex-1">
        <BagView />
      </main>
      <SiteFooter />
    </>
  );
}
