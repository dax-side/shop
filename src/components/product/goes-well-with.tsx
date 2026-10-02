import Link from "next/link";
import { getRoom, type Product } from "@/lib/catalogue";
import { formatNaira } from "@/lib/format";
import { productThumb } from "@/lib/product-images";
import { getProducts } from "@/lib/products";
import { ProductPhoto } from "../product-photo";

export async function GoesWellWith({ product }: { product: Product }) {
  const others = (await getProducts()).filter((p) => p.slug !== product.slug);
  const picks = [...others.filter((p) => p.room === product.room), ...others.filter((p) => p.room !== product.room)].slice(
    0,
    4,
  );
  const room = getRoom(product.room);

  return (
    <section className="container-page py-14 sm:py-16">
      <div className="flex items-end justify-between">
        <h2 className="display text-4xl sm:text-5xl">Goes well with</h2>
        {room && (
          <Link href={`/?room=${room.slug}#catalogue`} className="hidden text-xs underline underline-offset-2 sm:block">
            See the {room.name.toLowerCase()}
          </Link>
        )}
      </div>

      <ul className="-mx-4 mt-5 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-0 sm:overflow-visible sm:border-t sm:border-l sm:border-ink sm:px-0">
        {picks.map((pick) => (
          <li key={pick.slug} className="w-[45%] shrink-0 snap-start sm:w-auto sm:border-r sm:border-b sm:border-ink sm:p-3">
            <Link href={`/products/${pick.slug}`} className="group block">
              <ProductPhoto
                tone={pick.tone}
                caption={pick.name}
                image={productThumb(pick.slug)}
                className="aspect-square"
                sizes="(min-width: 640px) 25vw, 45vw"
              />
              <div className="mt-3 flex flex-col justify-between gap-1 sm:flex-row">
                <span className="text-sm font-medium group-hover:underline">{pick.name}</span>
                <span className="font-mono text-xs">{formatNaira(pick.price)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
