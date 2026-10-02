"use client";

import Link from "next/link";
import { BagIcon } from "../icons";
import { useBag } from "./use-bag";

export function BagButton() {
  const { count } = useBag();

  return (
    <Link
      href="/bag"
      aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
      className="flex items-center gap-2 rounded-full border-ink text-xs md:border md:px-3 md:py-1.5 md:hover:bg-ink/5"
    >
      <BagIcon />
      <span className="hidden md:inline">Bag</span>
      <span className="grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 font-mono text-[0.625rem] text-paper">
        {count}
      </span>
    </Link>
  );
}
