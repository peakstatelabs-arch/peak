import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/**
 * Set a brand-new client's password and clear the must_change_password
 * gate in one atomic server-side step. Logs verbosely on every step so
 * we can read Vercel logs and pinpoint failures real users hit.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("complete-password-change: no user from cookies");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!user.email) {
    console.error("complete-password-change: user has no email", { userId: user.id });
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

  console.log("complete-password-change: starting", { userId: user.id, email: user.email });

  const admin = createAdminClient();

  const { error: pwError } = await admin.auth.admin.updateUserById(user.id, {
    password,
  });
  if (pwError) {
    console.error("complete-password-change: updateUserById failed", pwError);
    return NextResponse.json({ error: pwError.message }, { status: 400 });
  }
  console.log("complete-password-change: password updated for", user.id);

  const { error: profileError, data: profileUpdated } = await admin
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", user.id)
    .select("id, must_change_password");
  if (profileError) {
    console.error("complete-password-change: profile update failed", profileError);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }
  console.log("complete-password-change: profile after update", profileUpdated);

  // Read it back to be 100% sure the flag actually committed before we
  // hand control back to the client and they redirect into the layout.
  const { data: verify } = await admin
    .from("profiles")
    .select("must_change_password")
    .eq("id", user.id)
    .single();
  console.log("complete-password-change: verify must_change_password =", verify?.must_change_password);
  if (verify?.must_change_password !== false) {
    console.error("complete-password-change: VERIFY FAILED, flag still true after update");
    return NextResponse.json(
      { error: "Couldn't clear password reset flag. Please contact support." },
      { status: 500 }
    );
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (signInError) {
    console.error("complete-password-change: re-sign-in failed", signInError);
    return NextResponse.json(
      { ok: true, needsReLogin: true },
      { status: 200 }
    );
  }
  console.log("complete-password-change: re-signed in OK");

  return NextResponse.json({ ok: true });
}
