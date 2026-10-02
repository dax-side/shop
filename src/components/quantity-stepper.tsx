"use client";

import { MAX_QUANTITY } from "@/lib/bag-store";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  label: string;
  size?: "sm" | "lg";
};

export function QuantityStepper({ value, onChange, label, size = "sm" }: QuantityStepperProps) {
  const height = size === "lg" ? "h-12 w-24" : "h-8 w-20";

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-center justify-between rounded-full border border-ink px-1 font-mono text-sm ${height}`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className="grid size-7 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-30"
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Increase quantity"
        className="grid size-7 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
