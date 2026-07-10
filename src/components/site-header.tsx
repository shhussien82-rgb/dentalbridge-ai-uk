"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { BrandMark } from "@/components/brand-mark";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignOutButton } from "@/components/sign-out-button";

export function SiteHeader({ userEmail }: { userEmail?: string | null }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isLoggedIn = Boolean(userEmail);

  const themeToggle = (
    <Button
      type="button"
      variant="outline"
      size="nav"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="size-2.5 rounded-full bg-gold" />
      <span suppressHydrationWarning>{isDark ? "Dark" : "Light"}</span>
    </Button>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-8">
        <BrandMark />
        <div className="flex items-center gap-7">
          {isLoggedIn ? (
            <>
              <Link
                href="/"
                className="text-sm text-mut transition-colors hover:text-ink"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-mut transition-colors hover:text-ink"
              >
                Dashboard
              </Link>
              {themeToggle}
              <SignOutButton size="nav" />
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-sm text-mut transition-colors hover:text-ink"
              >
                How it works
              </Link>
              <Link
                href="/login"
                className="text-sm text-mut transition-colors hover:text-ink"
              >
                Log in
              </Link>
              <Link href="/signup" className={buttonVariants({ size: "nav" })}>
                Begin assessment
              </Link>
              {themeToggle}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
