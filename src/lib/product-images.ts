// Product photography, served from public/images. Photos from Unsplash; credits in the README.

export type ProductImage = { src: string; alt: string };

const VIEWS = ["front", "side", "detail", "in-use"] as const;

const PRODUCTS: Record<string, { number: string; alts: [string, string, string, string] }> = {
  "stoneware-mug": {
    number: "014",
    alts: [
      "Grey stoneware mug on a wooden table",
      "Speckled stoneware cups on a white surface",
      "Dark stoneware cup on a saucer",
      "Glazed stoneware mugs on a kitchen shelf",
    ],
  },
  "iroko-serving-board": {
    number: "022",
    alts: [
      "Dark wooden serving board on a woven rug",
      "Two wooden serving boards with grapes and nuts",
      "Close-up of wooden boards showing the grain",
      "Wooden board standing outdoors among leaves",
    ],
  },
  "enamel-pot-3-litre": {
    number: "031",
    alts: [
      "White enamel pot in a kitchen",
      "Floral enamel pot on a gas stove",
      "Red enamel pot filled with potatoes",
      "White enamel pots outdoors on the grass",
    ],
  },
  "linen-tea-towels-pair": {
    number: "008",
    alts: [
      "Stack of folded linen tea towels",
      "Linen towel hanging from a kitchen cupboard",
      "Linen cloth with wheat and a cake server",
      "Three apples on a linen tea towel",
    ],
  },
  "brass-wall-hooks-pair": {
    number: "040",
    alts: [
      "Brass hooks fixed under a white shelf",
      "Brass hooks holding a coat",
      "Decorative brass wall hook",
      "Brass hook holding a bag by a door",
    ],
  },
  "clay-water-pot": {
    number: "017",
    alts: [
      "Terracotta water jug on a warm background",
      "Clay amphora on a wooden stand",
      "Close-up of a hand-thrown clay jug",
      "Potter shaping clay on a wheel",
    ],
  },
  "grid-notebook-a5": {
    number: "052",
    alts: [
      "Grid notebook with a pen on a dark desk",
      "Open grid notebook on a wooden table",
      "Spiral notebook with a fountain pen",
      "White spiral notebook with a pen",
    ],
  },
  "woven-bread-basket": {
    number: "026",
    alts: [
      "Woven baskets seen from above",
      "Hands holding a woven basket of bread",
      "Close-up of a woven basket handle",
      "Fresh loaves in a woven basket",
    ],
  },
};

export function productImages(slug: string): ProductImage[] {
  const product = PRODUCTS[slug];
  if (!product) return [];
  return VIEWS.map((view, i) => ({ src: `/images/products/${slug}/${view}.webp`, alt: product.alts[i] }));
}

export function productThumb(slug: string): ProductImage | undefined {
  return productImages(slug)[0];
}

// Order lines store the product number rather than the slug.
export function productThumbByNumber(number: string): ProductImage | undefined {
  const slug = Object.keys(PRODUCTS).find((key) => PRODUCTS[key].number === number);
  return slug ? productThumb(slug) : undefined;
}

export const shopShelves: ProductImage = {
  src: "/images/shop-shelves.webp",
  alt: "Wooden shelves lined with ceramic vases and pots",
};
