import Image from "next/image";
import type { ProductImage } from "@/lib/product-images";

type ProductPhotoProps = {
  tone: string;
  caption: string;
  image?: ProductImage;
  isNew?: boolean;
  className?: string;
  counter?: string;
  sizes?: string;
  preload?: boolean;
};

// Product photo in a fixed-ratio frame. Falls back to a tone block when a product has no photography yet.
export function ProductPhoto({
  tone,
  caption,
  image,
  isNew,
  className = "",
  counter,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  preload,
}: ProductPhotoProps) {
  if (!image) {
    return (
      <div
        className={`relative flex flex-col justify-between p-2.5 ${className}`}
        style={{ background: tone }}
        role="img"
        aria-label={caption}
      >
        <div>{isNew && <NewBadge />}</div>
        <div className="flex justify-between gap-2 font-mono text-[0.625rem] text-ink/60">
          <span>PHOTO — {caption}</span>
          {counter && <span>{counter}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: tone }}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        quality={85}
        preload={preload}
        className="object-cover"
      />
      {isNew && (
        <span className="absolute top-2.5 left-2.5">
          <NewBadge />
        </span>
      )}
      {counter && (
        <span className="absolute right-2.5 bottom-2.5 bg-paper/85 px-1.5 py-0.5 font-mono text-[0.625rem] text-ink">
          {counter}
        </span>
      )}
    </div>
  );
}

export function NewBadge() {
  return <span className="inline-block bg-accent px-1.5 py-0.5 font-mono text-[0.5625rem] text-paper">NEW</span>;
}

// Small square thumbnail for bag, checkout and order lines.
export function ProductThumb({ image, tone, className = "" }: { image?: ProductImage; tone: string; className?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden ${className}`} style={{ background: tone }}>
      {image && <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />}
    </span>
  );
}
