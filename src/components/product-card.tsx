import Link from "next/link";
import { getRoom, toBagItem, type Product } from "@/lib/catalogue";
import { formatNaira } from "@/lib/format";
import { AddToBagButton } from "./bag/add-to-bag-button";
import { ProductPhoto } from "./product-photo";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex h-full flex-col p-2.5 sm:p-3">
      <ProductPhoto tone={product.tone} caption={product.name} isNew={product.isNew} className="aspect-square" />
      <p className="mt-3 font-mono text-[0.625rem] text-muted">
        No. {product.number} · {getRoom(product.room)?.name}
      </p>
      <h3 className="mt-0.5 text-sm font-medium leading-tight">
        <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 group-hover:underline">
          {product.name}
        </Link>
      </h3>
      <p className="font-serif text-sm italic text-muted">{product.material}</p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <p className="font-mono text-xs">{formatNaira(product.price)}</p>
        <AddToBagButton
          item={toBagItem(product)}
          compactOnMobile
          className="relative z-10 grid size-8 place-items-center rounded-full border border-ink text-xs hover:bg-ink hover:text-paper sm:h-8 sm:w-auto sm:px-3"
        />
      </div>
    </article>
  );
}
