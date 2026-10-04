import { router } from "expo-router";
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { AppState } from "react-native";
import { api, ApiError } from "@/lib/api";
import type { Cart, CartItem } from "@/lib/types";
import { useSession } from "./session";
import { useSettings } from "./settings";
import { useToast } from "./toast";

// The bag is the account's cart on the server, shared with the website. The app keeps a request
// open to /api/cart/changes, which answers as soon as the cart changes anywhere (for example when
// an item is added on the website), so the bag here updates within about a second.

type CartValue = {
  cart: Cart | null;
  live: boolean;
  add: (slug: string, finish?: string, quantity?: number) => Promise<void>;
  setQuantity: (item: CartItem, quantity: number) => void;
  remove: (item: CartItem) => void;
};

const CartContext = createContext<CartValue | null>(null);
const MAX_QUANTITY = 20;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const latestAddedAt = (cart: Cart) => Math.max(0, ...cart.items.map((item) => Date.parse(item.addedAt)));

export function CartProvider({ children }: PropsWithChildren) {
  const { status } = useSession();
  const { alerts } = useSettings();
  const toast = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [live, setLive] = useState(false);
  const cartRef = useRef<Cart | null>(null);
  const lastSeen = useRef<number | null>(null);
  const alertsRef = useRef(alerts);

  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  // Applies a cart from the server, ignoring answers older than what is on screen. Items added on
  // the website since the last update get a banner.
  const apply = useCallback(
    (next: Cart) => {
      const current = cartRef.current;
      if (current && next.version < current.version) return;
      if (lastSeen.current !== null && alertsRef.current) {
        const since = lastSeen.current;
        const fromWebsite = next.items.filter((item) => item.addedFrom === "web" && Date.parse(item.addedAt) > since);
        if (fromWebsite.length) {
          const names = fromWebsite.map((item) => item.name);
          toast.show({
            message: `${names.length > 1 ? `${names.length} items` : names[0]} added on the website`,
            action: { label: "View bag", onPress: () => router.navigate("/bag") },
          });
        }
      }
      lastSeen.current = Math.max(lastSeen.current ?? 0, latestAddedAt(next));
      cartRef.current = next;
      setCart(next);
    },
    [toast],
  );

  const reload = useCallback(async () => {
    try {
      apply(await api<Cart>("/api/cart"));
    } catch {
      // The long-poll loop retries.
    }
  }, [apply]);

  useEffect(() => {
    if (status !== "signedIn") return;

    let stopped = false;
    let active = AppState.currentState !== "background";
    let controller: AbortController | null = null;
    let wake: (() => void) | null = null;

    const subscription = AppState.addEventListener("change", (state) => {
      const nowActive = state === "active";
      if (nowActive === active) return;
      active = nowActive;
      if (active) wake?.();
      else controller?.abort();
    });

    (async () => {
      let delay = 1000;
      while (!stopped) {
        if (!active) {
          setLive(false);
          await new Promise<void>((resolve) => (wake = resolve));
          continue;
        }
        controller = new AbortController();
        try {
          const version = cartRef.current?.version ?? -1;
          const result = await api<{ changed: boolean; cart?: Cart }>(`/api/cart/changes?version=${version}`, {
            signal: controller.signal,
          });
          if (result.changed && result.cart) apply(result.cart);
          setLive(true);
          delay = 1000;
        } catch (error) {
          if (stopped || controller.signal.aborted) continue;
          if (error instanceof ApiError && error.status === 401) return;
          setLive(false);
          await sleep(delay);
          delay = Math.min(delay * 2, 30_000);
        }
      }
    })();

    return () => {
      stopped = true;
      controller?.abort();
      wake?.();
      subscription.remove();
      // Signed out (or switched account): forget this account's bag.
      cartRef.current = null;
      lastSeen.current = null;
      setCart(null);
      setLive(false);
    };
  }, [status, apply]);

  const add = useCallback(
    async (slug: string, finish?: string, quantity = 1) => {
      apply(await api<Cart>("/api/cart/items", { method: "POST", body: { slug, finish, quantity } }));
    },
    [apply],
  );

  // Quantity and remove update the screen first, then take the server's answer (or reload).
  const change = useCallback(
    (update: (items: CartItem[]) => CartItem[], request: () => Promise<Cart>) => {
      const current = cartRef.current;
      if (current) {
        const items = update(current.items);
        const optimistic = {
          ...current,
          items,
          count: items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
        };
        cartRef.current = optimistic;
        setCart(optimistic);
      }
      request().then(apply, reload);
    },
    [apply, reload],
  );

  const same = (a: CartItem, b: CartItem) => a.slug === b.slug && (a.finish ?? "") === (b.finish ?? "");

  const setQuantity = useCallback(
    (item: CartItem, quantity: number) => {
      const next = Math.min(Math.max(Math.floor(quantity), 1), MAX_QUANTITY);
      change(
        (items) => items.map((i) => (same(i, item) ? { ...i, quantity: next, lineTotal: i.price * next } : i)),
        () => api<Cart>("/api/cart/items", { method: "PATCH", body: { slug: item.slug, finish: item.finish, quantity: next } }),
      );
    },
    [change],
  );

  const remove = useCallback(
    (item: CartItem) => {
      const params = new URLSearchParams({ slug: item.slug, ...(item.finish ? { finish: item.finish } : {}) });
      change(
        (items) => items.filter((i) => !same(i, item)),
        () => api<Cart>(`/api/cart/items?${params}`, { method: "DELETE" }),
      );
    },
    [change],
  );

  const value = useMemo(() => ({ cart, live, add, setQuantity, remove }), [cart, live, add, setQuantity, remove]);
  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const value = use(CartContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}
