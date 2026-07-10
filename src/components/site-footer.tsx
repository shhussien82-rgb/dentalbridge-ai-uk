import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const SITEMAP_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Sign up" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact us" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <BrandMark variant="footer" />
        <nav className="flex flex-wrap gap-x-7 gap-y-3">
          {SITEMAP_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-mut transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-8 py-6 text-[12.5px] text-mut sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} DentalBridge. All rights reserved.</p>
          <p className="max-w-[560px] sm:text-right">
            DentalBridge is an informational planning tool, not a substitute
            for official guidance from the GDC, UKVI, or your dental defence
            organization.
          </p>
        </div>
      </div>
    </footer>
  );
}
