import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoesWellWith } from "@/components/product/goes-well-with";
import { ProductView } from "@/components/product/product-view";
import { SiteFooter } from "@/components/site-footer";
import { getRoom } from "@/lib/catalogue";
import { getProduct } from "@/lib/products";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const room = getRoom(product.room)!;

  return (
    <>
      <main className="flex-1">
        <div className="container-page pt-4 sm:pt-5">
          <nav aria-label="Breadcrumb" className="mb-4 hidden font-mono text-[0.625rem] sm:block">
            <ol className="flex gap-2">
              <li>
                <Link href="/#catalogue" className="hover:underline">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/?room=${room.slug}#catalogue`} className="hover:underline">
                  {room.name}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-muted">
                No. {product.number}
              </li>
            </ol>
          </nav>
          <ProductView product={product} roomName={room.name} />
        </div>
        <GoesWellWith product={product} />
      </main>
      <SiteFooter />
      {/* Room for the fixed add-to-bag bar on mobile */}
      <div aria-hidden className="h-20 md:hidden" />
    </>
  );
}
