// Client-side bag kept in localStorage. Prices here are for display only;
// the server recomputes every total from the catalogue at checkout.

export type BagItem = {
  slug: string;
  name: string;
  number: string;
  price: number;
  tone: string;
  finish?: string;
  quantity: number;
};

const STORAGE_KEY = "oja-bag";
export const MAX_QUANTITY = 20;
const EMPTY: BagItem[] = [];

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

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    items = Array.isArray(parsed) ? parsed.filter(isBagItem) : EMPTY;
  } catch {
    items = EMPTY;
  }
}

function save(next: BagItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be full or blocked; the bag still works for this page view.
  }
  listeners.forEach((listener) => listener());
}

const clamp = (quantity: number) => Math.min(Math.max(Math.floor(quantity), 1), MAX_QUANTITY);

export const bagStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      loaded = false;
      load();
      listeners.forEach((l) => l());
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

  add(item: Omit<BagItem, "quantity">, quantity = 1) {
    load();
    const key = itemKey(item);
    const existing = items.find((i) => itemKey(i) === key);
    save(
      existing
        ? items.map((i) => (itemKey(i) === key ? { ...i, quantity: clamp(i.quantity + quantity) } : i))
        : [...items, { ...item, quantity: clamp(quantity) }],
    );
  },

  setQuantity(key: string, quantity: number) {
    load();
    save(items.map((i) => (itemKey(i) === key ? { ...i, quantity: clamp(quantity) } : i)));
  },

  remove(key: string) {
    load();
    save(items.filter((i) => itemKey(i) !== key));
  },

  clear() {
    save(EMPTY);
  },
};
