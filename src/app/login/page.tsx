"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/google-signin-button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="w-full max-w-[420px] border border-line bg-surface p-10">
      <div className="flex flex-col gap-2 border-b border-line pb-6">
        <div className="text-[11px] tracking-[0.2em] text-gold uppercase">
          Welcome back
        </div>
        <div className="font-heading text-[26px] font-semibold">Log in</div>
      </div>
      <div className="flex flex-col gap-5 pt-6">
        <GoogleSignInButton next={next} />
        <div className="flex items-center gap-3.5">
          <div className="h-px flex-1 bg-line" />
          <span className="text-[11px] tracking-[0.14em] text-mut uppercase">
            or
          </span>
          <div className="h-px flex-1 bg-line" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" size="form" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <p className="text-center text-sm text-mut">
          No account yet?{" "}
          <Link href="/signup" className="border-b border-gold text-gold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-[420px] animate-pulse border border-line bg-surface p-10">
      <div className="flex flex-col gap-2 border-b border-line pb-6">
        <div className="h-3 w-24 bg-muted" />
        <div className="h-7 w-32 bg-muted" />
      </div>
      <div className="flex flex-col gap-5 pt-6">
        <div className="h-[46px] w-full bg-muted" />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-12 bg-muted" />
            <div className="h-[46px] w-full bg-muted" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-muted" />
            <div className="h-[46px] w-full bg-muted" />
          </div>
          <div className="h-12 w-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
