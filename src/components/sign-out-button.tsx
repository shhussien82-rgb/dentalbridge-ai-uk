"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

export function SignOutButton({
  size = "action",
}: {
  size?: VariantProps<typeof buttonVariants>["size"];
}) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="outline" size={size} onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
