// Product photography, served from public/images. Photos from Unsplash; credits in the README.

export type ProductImage = { src: string; alt: string };

// Each product has as many photos as it has alt texts. The first four use these file names
// (front.webp, side.webp…); any more are photo-5.webp, photo-6.webp and so on.
const VIEWS = ["front", "side", "detail", "in-use"];
const VIEW_LABELS = ["front", "side", "detail", "in use"];

const fileName = (index: number) => VIEWS[index] ?? `photo-${index + 1}`;
export const viewLabel = (index: number) => VIEW_LABELS[index] ?? `photo ${index + 1}`;

const PRODUCTS: Record<string, { number: string; alts: string[] }> = {
  "wooden-spoon-set": {
    number: "023",
    alts: [
      "Carved wooden spoons and a wooden cup",
      "Two wooden spoons on a grey surface",
      "Wooden spoons and spatulas laid out on a table",
      "Wooden spoons standing in a utensil jar",
    ],
  },
  "wooden-mortar-and-pestle": {
    number: "029",
    alts: [
      "Wooden mortar and pestle on a grey background",
      "Polished wooden mortar with a dark pestle",
      "Wooden pestle resting in a bowl of salt",
      "Pounding pepper and herbs in a mortar",
    ],
  },
  "calabash-bowl": {
    number: "015",
    alts: [
      "Stacked round gourd bowls",
      "Polished calabash cups",
      "Close-up of a carved gourd surface",
      "Decorated gourds in a bowl",
    ],
  },
  "glass-tumblers-set-of-4": {
    number: "019",
    alts: [
      "Glass tumblers of water on a sunlit table",
      "Ribbed drinking glasses casting shadows",
      "Clear tumblers stacked in a pyramid",
      "Glass tumblers beside a water carafe",
    ],
  },
  "cotton-bath-towel": {
    number: "005",
    alts: [
      "Folded cotton bath towels on a wooden stool",
      "Towels hanging on hooks in a bathroom",
      "Rolled grey cotton towel",
      "Stack of soft white towels",
    ],
  },
  "black-soap-bar": {
    number: "003",
    alts: [
      "Bar of dark handmade soap held in a hand",
      "Stack of black and white handmade soap bars",
      "Handmade soap bars on linen",
      "Hands holding a bar of handmade soap",
    ],
  },
  "natural-hand-broom": {
    number: "042",
    alts: [
      "Natural fibre broom hanging by a wooden screen",
      "Short hand broom on a dark wooden floor",
      "Close-up of natural broom fibres",
      "Fibre brooms bound with coloured cord",
    ],
  },
  "bristle-dish-brush": {
    number: "044",
    alts: [
      "Wooden dish brushes with natural bristles",
      "Dish brush beside a brass kitchen tap",
      "Close-up of natural bristle brushes",
      "Wooden brushes in a jar by a window",
    ],
  },
  "kraft-envelopes-pack": {
    number: "055",
    alts: [
      "Kraft paper envelopes on a wooden board",
      "Kraft envelope with a blank card",
      "Brown envelopes with old photographs",
      "Envelope and card with a pencil",
    ],
  },
  "wooden-desk-tray": {
    number: "057",
    alts: [
      "Walnut desk tray holding earbuds and a watch",
      "Wooden tray with a wallet, phone and pens",
      "Two empty wooden desk trays",
      "Wooden tray with glasses on a desk",
    ],
  },
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
  return product.alts.map((alt, i) => ({ src: `/images/products/${slug}/${fileName(i)}.webp`, alt }));
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

export const roomImages: Record<string, ProductImage> = {
  kitchen: { src: "/images/rooms/kitchen.webp", alt: "Glass jars on a wooden kitchen shelf" },
  table: { src: "/images/rooms/table.webp", alt: "Wooden table set with white plates and flowers" },
  "bath-linen": { src: "/images/rooms/bath-linen.webp", alt: "White linen on a wooden chair" },
  tools: { src: "/images/rooms/tools.webp", alt: "Hand tools hanging on a pale wall" },
  "paper-desk": { src: "/images/rooms/paper-desk.webp", alt: "Pens resting on a brown envelope" },
};

export const makingImages: (ProductImage & { label: string })[] = [
  { label: "Clay", src: "/images/making/clay.webp", alt: "Hands shaping a round clay pot" },
  { label: "Fibre", src: "/images/making/weaving.webp", alt: "Hands weaving a wicker basket in the sun" },
  { label: "Wood", src: "/images/making/wood.webp", alt: "Chisel carving into a piece of wood" },
];

export const storeImage: ProductImage = {
  src: "/images/store.webp",
  alt: "Ceramic bowls and vases on a wooden display table in a sunlit shop",
};
