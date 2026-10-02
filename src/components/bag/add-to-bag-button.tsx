"use client";

import { useEffect, useState } from "react";
import { bagStore, type BagItem } from "@/lib/bag-store";

type AddToBagButtonProps = {
  item: Omit<BagItem, "quantity">;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  compactOnMobile?: boolean;
};

export function AddToBagButton({ item, quantity = 1, className = "", children, compactOnMobile }: AddToBagButtonProps) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [added]);

  const label = added ? "Added" : (children ?? "Add to bag");

  return (
    <button
      type="button"
      onClick={() => {
        bagStore.add(item, quantity);
        setAdded(true);
      }}
      aria-label={compactOnMobile ? `Add ${item.name} to bag` : undefined}
      className={className}
    >
      {compactOnMobile ? (
        <>
          <span aria-hidden className="text-base leading-none sm:hidden">
            {added ? "✓" : "+"}
          </span>
          <span className="hidden sm:inline">{label}</span>
        </>
      ) : (
        <span aria-live="polite">{label}</span>
      )}
    </button>
  );
}
