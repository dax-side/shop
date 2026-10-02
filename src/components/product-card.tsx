import Link from "next/link";
import { getRoom, type Product } from "@/lib/catalogue";
import { formatNaira } from "@/lib/format";
import { ProductPhoto } from "./product-photo";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col p-2.5 sm:p-3">
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
      <p className="mt-4 font-mono text-xs">{formatNaira(product.price)}</p>
    </article>
  );
}
