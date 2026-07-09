"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/google-signin-button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("Check your email to confirm your account, then log in.");
      router.push("/login");
      return;
    }
    router.push("/questionnaire");
    router.refresh();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-[420px] border border-line bg-surface p-10">
        <div className="flex flex-col gap-2 border-b border-line pb-6">
          <div className="text-[11px] tracking-[0.2em] text-gold uppercase">
            New engagement
          </div>
          <div className="font-heading text-[26px] font-semibold">
            Create your account
          </div>
        </div>
        <div className="flex flex-col gap-5 pt-6">
          <GoogleSignInButton next="/questionnaire" />
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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" size="form" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Begin assessment"}
            </Button>
          </form>
          <p className="text-center text-sm text-mut">
            Already have an account?{" "}
            <Link href="/login" className="border-b border-gold text-gold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
