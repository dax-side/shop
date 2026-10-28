"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toBagItem, type Product } from "@/lib/catalogue";
import { formatNaira } from "@/lib/format";
import { productImages, viewLabel } from "@/lib/product-images";
import { AddToBagButton } from "../bag/add-to-bag-button";
import { ArrowLeftIcon, ArrowRightIcon } from "../icons";
import { NewBadge, ProductPhoto } from "../product-photo";
import { QuantityStepper } from "../quantity-stepper";


export function ProductView({
  product,
  roomName,
  lagosDeliveryDays,
}: {
  product: Product;
  roomName: string;
  lagosDeliveryDays: string;
}) {
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const track = useRef<HTMLDivElement>(null);
  const images = productImages(product.slug);

  const caption = (index: number) =>
    [product.name, images.length ? viewLabel(index) : undefined].filter(Boolean).join(", ");

  // The photos sit side by side in a scroll-snap track: swipe on touch screens, thumbnails, arrows or the
  // arrow keys elsewhere. The current view follows the scroll position.
  function show(index: number) {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(images.length - 1, index));
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }

  function syncView() {
    const el = track.current;
    if (el?.clientWidth) setView(Math.round(el.scrollLeft / el.clientWidth));
  }
  const addLabel = `Add to bag · ${formatNaira(product.price * quantity)}`;
  const bagItem = toBagItem(product);

  const details = [
    { label: "Material", value: product.details.material },
    { label: "Size", value: product.details.size },
    { label: "Care", value: product.details.care },
    { label: "Delivery", value: `Lagos in ${lagosDeliveryDays} days, carefully packed. Pickup free.` },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-12 md:gap-8">
      <div className="-mx-4 -mt-4 flex gap-3 sm:mx-0 sm:mt-0 md:col-span-6">
        <ul className="hidden w-14 shrink-0 flex-col gap-2 md:flex">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => show(index)}
                aria-label={`Show ${viewLabel(index)} view`}
                aria-pressed={view === index}
                className={`relative block aspect-square w-full overflow-hidden border ${
                  view === index ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                style={{ background: product.tone }}
              >
                <Image src={image.src} alt="" fill sizes="56px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
        <div className="relative min-w-0 flex-1">
          {product.isNew && (
            <span className="absolute top-3 left-3 z-10 md:hidden">
              <NewBadge />
            </span>
          )}
          {images.length ? (
            <div
              ref={track}
              onScroll={syncView}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  show(view + (event.key === "ArrowRight" ? 1 : -1));
                }
              }}
              tabIndex={0}
              aria-label={`${product.name} photos`}
              className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] focus-visible:outline-2 [&::-webkit-scrollbar]:hidden"
            >
              {images.map((image, index) => (
                <ProductPhoto
                  key={image.src}
                  tone={product.tone}
                  caption={caption(index)}
                  image={image}
                  counter={`${index + 1} / ${images.length}`}
                  className="aspect-square w-full shrink-0 snap-center snap-always md:aspect-[4/5]"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  preload={index === 0}
                />
              ))}
            </div>
          ) : (
            <ProductPhoto tone={product.tone} caption={caption(0)} className="aspect-square md:aspect-[4/5]" />
          )}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => show(view - 1)}
                disabled={view === 0}
                aria-label="Previous photo"
                className="absolute top-1/2 left-3 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-ink hover:bg-paper disabled:invisible md:grid"
              >
                <ArrowLeftIcon width={14} height={14} />
              </button>
              <button
                type="button"
                onClick={() => show(view + 1)}
                disabled={view === images.length - 1}
                aria-label="Next photo"
                className="absolute top-1/2 right-3 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-ink hover:bg-paper disabled:invisible md:grid"
              >
                <ArrowRightIcon width={14} height={14} />
              </button>
              <div className="absolute bottom-0 left-1 flex md:hidden">
                {images.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => show(index)}
                    aria-label={`Show ${viewLabel(index)} view`}
                    aria-pressed={view === index}
                    className="flex h-11 w-7 items-center justify-center"
                  >
                    <span className={`h-1 w-4 ${view === index ? "bg-paper" : "bg-paper/50"}`} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
        <p className="label flex items-center gap-2 text-[0.625rem]">
          {roomName}
          {product.isNew && (
            <span className="hidden md:inline">
              <NewBadge />
            </span>
          )}
        </p>
        <h1 className="display mt-2 text-5xl sm:text-6xl">{product.name}</h1>
        <p className="mt-3 font-serif text-xl italic text-muted">{product.tagline}</p>
        <p className="mt-3 font-mono text-base">{formatNaira(product.price)}</p>

        <div className="mt-5 border-t border-ink pt-5">
          <p className="max-w-md text-[0.9375rem] leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-center justify-between gap-3 md:justify-start">
            <span className="label text-[0.625rem] md:hidden">Quantity</span>
            <QuantityStepper value={quantity} onChange={setQuantity} label="Quantity" size="lg" />
            <AddToBagButton
              item={bagItem}
              quantity={quantity}
              className="hidden h-12 flex-1 rounded-full bg-ink px-6 text-sm text-paper hover:bg-ink/85 md:block"
            >
              {addLabel}
            </AddToBagButton>
          </div>

          <dl className="mt-6 border-t border-b border-ink">
            {details.map((row) => (
              <div
                key={row.label}
                className="grid gap-1 border-b border-line py-3 last:border-b-0 md:grid-cols-[6rem_1fr] md:py-2.5"
              >
                <dt className="label text-[0.625rem]">{row.label}</dt>
                <dd className="text-sm">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink bg-paper p-4 md:hidden">
        <AddToBagButton
          item={bagItem}
          quantity={quantity}
          className="h-12 w-full rounded-full bg-ink text-sm text-paper hover:bg-ink/85"
        >
          {addLabel}
        </AddToBagButton>
      </div>
    </div>
  );
}
