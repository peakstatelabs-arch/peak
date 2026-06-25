import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/**
 * Set a brand-new client's password and clear the must_change_password
 * gate in one atomic server-side step.
 *
 * Why server-side: the prior two-step approach (client updates password,
 * then client POSTs to flip the flag) worked on desktop Chrome but
 * failed silently on iPhone Safari. iOS's stricter ITP/cookie handling
 * meant the new session cookie from the client-side password update
 * wasn't reliably available on the immediate follow-up fetch — server
 * read no user, returned 401, form re-rendered to the same screen with
 * no error context. Doing both writes here + re-signing the user in to
 * mint fresh cookies on this response eliminates the race entirely.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.email) {
    return NextResponse.json(
      { error: "Account has no email on file. Contact support." },
      { status: 400 }
    );
  }

  const { password } = await request.json();
  if (typeof password !== "string" || password.length < 10) {
    return NextResponse.json(
      { error: "Password must be at least 10 characters." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { error: pwError } = await admin.auth.admin.updateUserById(user.id, {
    password,
  });
  if (pwError) {
    console.error("complete-password-change: updateUserById failed", pwError);
    return NextResponse.json({ error: pwError.message }, { status: 400 });
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", user.id);
  if (profileError) {
    console.error("complete-password-change: profile update failed", profileError);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Admin updateUserById invalidates all the user's existing sessions.
  // Re-sign in with the new password through the user-scoped client so
  // fresh session cookies land on this response — the next page they
  // load is authenticated and the must_change_password gate is cleared.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (signInError) {
    console.error("complete-password-change: re-sign-in failed", signInError);
    // Profile is correct; they just need to log in manually. Surface that.
    return NextResponse.json(
      { ok: true, needsReLogin: true },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true });
}
