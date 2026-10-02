"use client";

import Image from "next/image";
import { useState } from "react";
import { toBagItem, type Product } from "@/lib/catalogue";
import { formatNaira } from "@/lib/format";
import { productImages } from "@/lib/product-images";
import { AddToBagButton } from "../bag/add-to-bag-button";
import { NewBadge, ProductPhoto } from "../product-photo";
import { QuantityStepper } from "../quantity-stepper";

const VIEWS = ["front", "side", "detail", "in use"];

export function ProductView({ product, roomName }: { product: Product; roomName: string }) {
  const [finish, setFinish] = useState(product.finishes[0]?.name);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const images = productImages(product.slug);

  const caption = [product.name, finish?.toLowerCase(), VIEWS[view]].filter(Boolean).join(", ");
  const addLabel = `Add to bag · ${formatNaira(product.price * quantity)}`;
  const bagItem = toBagItem(product, finish);

  const details = [
    { label: "Material", value: product.details.material },
    { label: "Size", value: product.details.size },
    { label: "Care", value: product.details.care },
    { label: "Delivery", value: "Lagos in 1–2 days, carefully packed. Pickup free." },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-12 md:gap-8">
      <div className="-mx-4 -mt-4 flex gap-3 sm:mx-0 sm:mt-0 md:col-span-6">
        <ul className="hidden w-14 shrink-0 flex-col gap-2 lg:flex">
          {VIEWS.map((name, index) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => setView(index)}
                aria-label={`Show ${name} view`}
                aria-pressed={view === index}
                className={`relative block aspect-square w-full overflow-hidden border ${
                  view === index ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                style={{ background: product.tone }}
              >
                {images[index] && (
                  <Image src={images[index].src} alt="" fill sizes="56px" className="object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="relative flex-1">
          {product.isNew && (
            <span className="absolute top-3 left-3 z-10 md:hidden">
              <NewBadge />
            </span>
          )}
          <ProductPhoto
            tone={product.tone}
            caption={caption}
            image={images[view]}
            counter={`${view + 1} / ${VIEWS.length}`}
            className="aspect-square md:aspect-[4/5]"
            sizes="(min-width: 768px) 50vw, 100vw"
            preload={view === 0}
          />
          <div className="absolute bottom-3 left-3 flex gap-1.5 lg:hidden">
            {VIEWS.map((name, index) => (
              <button
                key={name}
                type="button"
                onClick={() => setView(index)}
                aria-label={`Show ${name} view`}
                aria-pressed={view === index}
                className={`h-1 w-4 ${view === index ? "bg-paper" : "bg-paper/50"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
        <p className="label flex items-center gap-2 text-[0.625rem]">
          No. {product.number} · {roomName}
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

          {product.finishes.length > 0 && (
            <fieldset className="mt-6">
              <legend className="label text-[0.625rem]">Finish — {finish}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.finishes.map((option) => (
                  <label
                    key={option.name}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border py-1 pr-4 pl-1 text-xs has-focus-visible:outline-2 ${
                      finish === option.name ? "border-ink" : "border-ink/30 hover:border-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="finish"
                      value={option.name}
                      checked={finish === option.name}
                      onChange={() => setFinish(option.name)}
                      className="sr-only"
                    />
                    <span className="size-6 rounded-full" style={{ background: option.swatch }} />
                    {option.name}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

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
