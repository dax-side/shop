// The bag shown on the website. Two modes:
// - guest: kept in localStorage on this browser;
// - account: mirrors the signed-in user's bag from /api/cart, shared with the mobile app.
//   Changes update the screen straight away, then the server's answer replaces them.
// Prices here are for display only; the server recomputes every total at checkout.

export type BagItem = {
  slug: string;
  name: string;
  number: string;
  price: number;
  tone: string;
  finish?: string;
  quantity: number;
  addedFrom?: "web" | "app";
  addedAt?: string;
};

export type AccountCart = { version: number; items: BagItem[] };

const STORAGE_KEY = "oja-bag";
export const MAX_QUANTITY = 20;
const EMPTY: BagItem[] = [];

let mode: "guest" | "account" = "guest";
let accountVersion = -1;
let signedOut = false;
let items: BagItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

export function itemKey(item: Pick<BagItem, "slug" | "finish">) {
  return `${item.slug}:${item.finish ?? ""}`;
}

function isBagItem(value: unknown): value is BagItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.number === "string" &&
    typeof item.price === "number" &&
    typeof item.tone === "string" &&
    (item.finish === undefined || typeof item.finish === "string") &&
    Number.isInteger(item.quantity) &&
    (item.quantity as number) > 0
  );
}

function readGuestBag(): BagItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isBagItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function load() {
  if (loaded) return;
  loaded = true;
  if (mode === "guest") items = readGuestBag();
}

function notify() {
  listeners.forEach((listener) => listener());
}

function save(next: BagItem[]) {
  items = next;
  if (mode === "guest") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage can be full or blocked; the bag still works for this page view.
    }
  }
  notify();
}

const clamp = (quantity: number) => Math.min(Math.max(Math.floor(quantity), 1), MAX_QUANTITY);

// Sends a change to the account cart and applies the server's answer; on failure, reloads the cart.
async function sync(request: Promise<Response>) {
  try {
    const response = await request;
    if (response.ok) {
      bagStore.applyAccountCart(await response.json());
      return;
    }
  } catch {
    // Network error: fall through and reload what the server has.
  }
  const fresh = await fetch("/api/cart", { cache: "no-store" }).catch(() => null);
  if (fresh?.ok) bagStore.applyAccountCart(await fresh.json());
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const bagStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || mode !== "guest") return;
      items = readGuestBag();
      notify();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  getSnapshot() {
    load();
    return items;
  },

  getServerSnapshot() {
    return EMPTY;
  },

  get mode() {
    return mode;
  },

  add(item: Omit<BagItem, "quantity">, quantity = 1) {
    load();
    const key = itemKey(item);
    const existing = items.find((i) => itemKey(i) === key);
    save(
      existing
        ? items.map((i) => (itemKey(i) === key ? { ...i, quantity: clamp(i.quantity + quantity) } : i))
        : [...items, { ...item, quantity: clamp(quantity), addedFrom: "web", addedAt: new Date().toISOString() }],
    );
    if (mode === "account") {
      void sync(fetch("/api/cart/items", jsonInit("POST", { slug: item.slug, finish: item.finish, quantity })));
    }
  },

  setQuantity(key: string, quantity: number) {
    load();
    const item = items.find((i) => itemKey(i) === key);
    save(items.map((i) => (itemKey(i) === key ? { ...i, quantity: clamp(quantity) } : i)));
    if (mode === "account" && item) {
      void sync(
        fetch("/api/cart/items", jsonInit("PATCH", { slug: item.slug, finish: item.finish, quantity: clamp(quantity) })),
      );
    }
  },

  remove(key: string) {
    load();
    const item = items.find((i) => itemKey(i) === key);
    save(items.filter((i) => itemKey(i) !== key));
    if (mode === "account" && item) {
      const params = new URLSearchParams({ slug: item.slug, ...(item.finish ? { finish: item.finish } : {}) });
      void sync(fetch(`/api/cart/items?${params}`, { method: "DELETE" }));
    }
  },

  // Empties the bag on this screen only (after an order, or when signing out). The account bag
  // on the server is left alone; checkout clears it on the server itself.
  clear() {
    save(EMPTY);
  },

  // Called on sign-out: ignore any account cart still arriving and fall back to a guest bag.
  signOut() {
    signedOut = true;
    mode = "guest";
    accountVersion = -1;
    save(EMPTY);
  },

  // Switch to (or update) the account bag. Older versions are ignored so a slow response
  // can't overwrite a newer one.
  applyAccountCart(cart: AccountCart) {
    if (signedOut || cart.version < accountVersion) return;
    mode = "account";
    loaded = true;
    accountVersion = cart.version;
    items = cart.items.map((item) => ({ ...item, finish: item.finish || undefined }));
    notify();
  },

  // The guest bag saved on this browser, removed so it is only merged into the account once.
  takeGuestBag() {
    const guest = readGuestBag();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to remove.
    }
    return guest;
  },

  switchToGuest() {
    if (mode === "guest") return;
    mode = "guest";
    accountVersion = -1;
    items = readGuestBag();
    notify();
  },
};
