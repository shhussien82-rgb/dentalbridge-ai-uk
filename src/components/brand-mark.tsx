import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  variant = "header",
  className,
}: {
  variant?: "header" | "footer";
  className?: string;
}) {
  if (variant === "footer") {
    return (
      <Link
        href="/"
        className={cn("flex items-center gap-3", className)}
      >
        <span className="flex size-7 shrink-0 items-center justify-center border border-gold font-heading text-xs font-semibold text-gold">
          DB
        </span>
        <span className="text-[11px] tracking-[0.18em] text-mut uppercase">
          DentalBridge · UK Pathway Advisory
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("flex items-center gap-3.5", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center border border-gold font-heading text-[15px] font-semibold tracking-[0.05em] text-gold">
        DB
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-heading text-[15px] font-semibold tracking-[0.14em] text-ink">
          DENTALBRIDGE
        </span>
        <span className="text-[10.5px] tracking-[0.18em] text-mut uppercase">
          UK Pathway Advisory
        </span>
      </span>
    </Link>
  );
}
