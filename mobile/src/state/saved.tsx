import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useSession } from "./session";
import { useToast } from "./toast";

// Products the customer has saved (the heart), stored with their account.
type SavedValue = {
  products: Product[] | null;
  isSaved: (slug: string) => boolean;
  toggle: (product: Product) => void;
  reload: () => Promise<void>;
};

const SavedContext = createContext<SavedValue | null>(null);

export function SavedProvider({ children }: PropsWithChildren) {
  const { status } = useSession();
  const toast = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);
  const productsRef = useRef<Product[] | null>(null);

  const replace = useCallback((next: Product[] | null) => {
    productsRef.current = next;
    setProducts(next);
  }, []);

  const reload = useCallback(async () => {
    try {
      replace((await api<{ products: Product[] }>("/api/saved")).products);
    } catch {
      // Keep what is on screen.
    }
  }, [replace]);

  useEffect(() => {
    if (status !== "signedIn") return;
    let current = true;
    api<{ products: Product[] }>("/api/saved")
      .then((result) => current && replace(result.products))
      .catch(() => undefined);
    return () => {
      current = false;
      replace(null);
    };
  }, [status, replace]);

  const toggle = useCallback(
    (product: Product) => {
      const before = productsRef.current ?? [];
      const saved = before.some((p) => p.slug === product.slug);
      replace(saved ? before.filter((p) => p.slug !== product.slug) : [product, ...before]);
      api(`/api/saved/${encodeURIComponent(product.slug)}`, { method: saved ? "DELETE" : "PUT" }).catch(() => {
        replace(before);
        toast.show({ message: "Couldn't update your saved items. Try again." });
      });
    },
    [replace, toast],
  );

  const isSaved = useCallback((slug: string) => !!products?.some((p) => p.slug === slug), [products]);

  const value = useMemo(() => ({ products, isSaved, toggle, reload }), [products, isSaved, toggle, reload]);
  return <SavedContext value={value}>{children}</SavedContext>;
}

export function useSaved() {
  const value = use(SavedContext);
  if (!value) throw new Error("useSaved must be used inside <SavedProvider>");
  return value;
}
