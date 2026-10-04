import "server-only";
import { getRoom, type Product } from "@/lib/catalogue";
import { productImages } from "@/lib/product-images";

// Next's image optimiser serves resized WebP/AVIF; widths must be in the default device sizes.
function optimised(origin: string, src: string, width: number, quality: number) {
  return `${origin}/_next/image?${new URLSearchParams({ url: src, w: String(width), q: String(quality) })}`;
}

export function productJson(product: Product, origin: string) {
  return {
    slug: product.slug,
    number: product.number,
    name: product.name,
    room: product.room,
    roomName: getRoom(product.room)?.name ?? product.room,
    material: product.material,
    tagline: product.tagline,
    description: product.description,
    price: product.price,
    isNew: product.isNew,
    tone: product.tone,
    finishes: product.finishes,
    details: product.details,
    images: productImages(product.slug).map((image) => ({
      alt: image.alt,
      thumb: optimised(origin, image.src, 640, 75),
      url: optimised(origin, image.src, 1080, 85),
    })),
  };
}

export type ProductJson = ReturnType<typeof productJson>;
