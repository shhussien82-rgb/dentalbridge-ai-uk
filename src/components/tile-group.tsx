"use client";

import { cn } from "@/lib/utils";

export function TileGroup({
  options,
  value,
  onChange,
  columns = 2,
  className,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 3 ? "grid-cols-3" : "grid-cols-2",
        className
      )}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "border px-4 py-3.5 text-center font-sans text-sm transition-colors select-none",
              active
                ? "border-gold bg-gold-soft font-semibold text-gold"
                : "border-line-strong bg-transparent font-normal text-ink hover:border-gold"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
