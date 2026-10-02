import Link from "next/link";
import { getProduct, type Product } from "@/lib/catalogue";
import { formatNaira } from "@/lib/format";
import { ArrowRightIcon } from "../icons";
import { ProductPhoto } from "../product-photo";

export function Hero() {
  const main = getProduct("clay-water-pot")!;
  const side = getProduct("stoneware-mug")!;

  return (
    <section id="about" className="container-page pt-6 pb-16 sm:pt-8 sm:pb-20">
      <div className="label flex justify-between border-b border-ink pb-2 text-[0.625rem]">
        <span>Catalogue {new Date().getFullYear()}</span>
        <span className="hidden sm:inline">Household goods</span>
        <span>
          Lagos<span className="hidden sm:inline">, Nigeria</span>
        </span>
      </div>

      <h1 className="display mt-5 text-[clamp(3.5rem,19vw,6.5rem)] sm:mt-6 sm:text-[clamp(4rem,13.4vw,12rem)]">
        Everyday goods,
        <br />
        <em className="font-serif font-normal normal-case italic tracking-normal">made</em> to last.
      </h1>

      <div className="mt-6 grid gap-8 sm:mt-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <p className="max-w-xs leading-snug">
            Kitchen, table and house things from small workshops in Lagos and beyond. Picked to be used every day,
            not kept for best.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href="#catalogue"
              className="flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 text-sm text-paper hover:bg-ink/85"
            >
              Shop the catalogue <ArrowRightIcon width={12} height={12} />
            </Link>
            <Link
              href="#how-it-works"
              className="flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-ink px-5 text-sm hover:bg-ink hover:text-paper"
            >
              Visit the store
            </Link>
          </div>
        </div>

        <FeaturedPhoto product={main} className="md:col-span-4" photoClassName="aspect-[4/5]" />
        <FeaturedPhoto product={side} className="hidden md:col-span-4 md:block md:self-end" photoClassName="aspect-square" />
      </div>
    </section>
  );
}

function FeaturedPhoto({
  product,
  className,
  photoClassName,
}: {
  product: Product;
  className: string;
  photoClassName: string;
}) {
  return (
    <Link href={`/products/${product.slug}`} className={`group ${className}`}>
      <ProductPhoto
        tone={product.tone}
        caption={`${product.name}, ${product.material.toLowerCase()}`}
        className={photoClassName}
      />
      <div className="mt-2 flex justify-between font-mono text-[0.6875rem]">
        <span className="group-hover:underline">
          No. {product.number} {product.name}
        </span>
        <span>{formatNaira(product.price)}</span>
      </div>
    </Link>
  );
}
