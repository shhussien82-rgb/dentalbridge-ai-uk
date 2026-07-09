import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles the redirect back from Supabase OAuth (e.g. Google): exchanges the
// auth code for a session cookie, then sends the user on to wherever they
// were headed (defaults to the dashboard).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/login?error=auth_callback_failed&reason=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed&reason=missing_code`);
}
