// Shapes returned by the website's /api routes.

export type Room = { slug: string; name: string; description: string };

export type Finish = { name: string; swatch: string };

export type Product = {
  slug: string;
  number: string;
  name: string;
  room: string;
  roomName: string;
  material: string;
  tagline: string;
  description: string;
  price: number;
  isNew: boolean;
  tone: string;
  finishes: Finish[];
  details: { material: string; size: string; care: string };
  images: { alt: string; thumb: string; url: string }[];
};

export type CartItem = {
  slug: string;
  number: string;
  name: string;
  material: string;
  price: number;
  tone: string;
  finish?: string;
  quantity: number;
  addedFrom: "web" | "app";
  addedAt: string;
  lineTotal: number;
  image: string | null;
};

export type Cart = { version: number; items: CartItem[]; count: number; subtotal: number };

export type User = { id: string; name: string | null; email: string | null; image: string | null };

export type SignedInSession = {
  id: string;
  client: "web" | "app";
  device: string;
  lastSeenAt: string;
  current: boolean;
};

export type Me = {
  user: User;
  provider: string | null;
  client: "web" | "app";
  sessions: SignedInSession[];
  counts: { orders: number; saved: number };
};

export type Order = {
  id: string;
  reference: string;
  status: string;
  statusLabel: string;
  total: number;
  method: "delivery" | "pickup";
  createdAt: string;
  path: string;
  items: { name: string; finish: string | null; quantity: number; lineTotal: number }[];
};

export type Address = {
  firstName: string;
  lastName: string;
  phone: string;
  street: string | null;
  landmark: string | null;
  area: string | null;
  state: string | null;
  usedAt: string;
};
