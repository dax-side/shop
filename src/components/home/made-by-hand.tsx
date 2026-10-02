import Image from "next/image";
import { makingImages, storeImage } from "@/lib/product-images";

export function MadeByHand() {
  return (
    <section id="made-by-hand" className="border-t border-ink">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <p className="label text-[0.625rem]">Made by hand</p>
            <h2 className="display mt-1 text-4xl sm:text-5xl">From small workshops</h2>
            <p className="mt-4 max-w-sm font-serif text-xl italic text-muted">
              Clay, fibre and wood, shaped by people who make the same thing well, again and again.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              We buy from potters, weavers and carvers in Lagos and beyond, and stock only what we&apos;d use at home.
              Because each piece is made by hand, no two are quite the same.
            </p>
          </div>

          <ul className="grid grid-cols-3 gap-3 md:col-span-8 md:gap-6">
            {makingImages.map((image, index) => (
              <li key={image.label} className={index === 1 ? "md:mt-12" : undefined}>
                <div className="relative aspect-[3/4] overflow-hidden bg-sand-2">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 22vw, 33vw" className="object-cover" />
                </div>
                <p className="mt-2 font-mono text-[0.6875rem]">
                  {String(index + 1).padStart(2, "0")} · {image.label}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-12 aspect-[4/3] overflow-hidden bg-sand-2 sm:aspect-[21/9]">
          <Image src={storeImage.src} alt={storeImage.alt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 text-paper sm:p-6">
            <p className="label text-[0.625rem]">Visit the store</p>
            <p className="mt-1 font-serif text-2xl sm:text-3xl">Come and pick things up in person.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
