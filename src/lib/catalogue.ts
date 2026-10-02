export type RoomSlug = "kitchen" | "table" | "bath-linen" | "tools" | "paper-desk";

export type Room = {
  slug: RoomSlug;
  name: string;
  description: string;
};

export type Finish = {
  name: string;
  swatch: string;
};

export type Product = {
  slug: string;
  number: string;
  name: string;
  room: RoomSlug;
  material: string;
  tagline: string;
  description: string;
  price: number;
  isNew: boolean;
  tone: string;
  finishes: Finish[];
  details: {
    material: string;
    size: string;
    care: string;
  };
};

export const rooms: Room[] = [
  { slug: "kitchen", name: "Kitchen", description: "Pots, boards, storage and the things you cook with" },
  { slug: "table", name: "Table", description: "Cups, bowls, baskets and serving pieces" },
  { slug: "bath-linen", name: "Bath & Linen", description: "Towels, cloths and soft goods" },
  { slug: "tools", name: "Tools", description: "Hooks, brushes and small hardware" },
  { slug: "paper-desk", name: "Paper & Desk", description: "Notebooks, pens and paper goods" },
];

export function getRoom(slug: string) {
  return rooms.find((room) => room.slug === slug);
}

export function toBagItem(product: Product, finish = product.finishes[0]?.name) {
  return {
    slug: product.slug,
    name: product.name,
    number: product.number,
    price: product.price,
    tone: product.tone,
    finish,
  };
}
