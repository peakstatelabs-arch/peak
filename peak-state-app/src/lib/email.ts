import { Resend } from "resend";

/**
 * Safe email sender. Returns { sent: false, reason } when the
 * Resend env vars aren't configured yet so callers can branch on
 * the result instead of throwing. Real failures still throw.
 */

type SendResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: "not_configured" | "skipped" };

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.RESEND_FROM || "Peak State Labs <hello@peakstate.shop>";
const PORTAL_URL = process.env.PORTAL_URL || "https://portal.peakstate.shop";

export async function sendClientInviteEmail(opts: {
  to: string;
  firstName: string | null;
  temporaryPassword: string;
}): Promise<SendResult> {
  const resend = getResend();
  if (!resend) return { sent: false, reason: "not_configured" };

  const greeting = opts.firstName ? `Hey ${opts.firstName},` : "Hey,";
  const loginUrl = `${PORTAL_URL}/login`;
  const subject = "Your Peak State Labs portal is ready";

  const text = `${greeting}

Your Peak State Labs portal is ready to go.

Log in here: ${loginUrl}
Email: ${opts.to}
Temporary password: ${opts.temporaryPassword}

You'll be asked to set your own password the first time you log in,
then you'll choose your protocol (POWER CUT Stack or single vials)
and you're off.

A heads up if you're on iPhone: tap Share → Add to Home Screen after
you log in. Push reminders only work when the portal is installed as
an app — it's a quirk of iOS Safari.

Welcome aboard.
— Peak State Labs`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0b0f14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e5e7eb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f14;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111827;border:1px solid #1f2937;border-radius:14px;padding:32px;">
          <tr><td>
            <div style="font-size:18px;font-weight:600;letter-spacing:-0.01em;margin-bottom:24px;">Peak State <span style="color:#5eead4;">Labs</span></div>
            <h1 style="font-size:22px;font-weight:600;margin:0 0 8px;color:#fff;">Your portal is ready.</h1>
            <p style="margin:0 0 24px;color:#9ca3af;line-height:1.55;">${greeting} log in below to set your password and choose your protocol.</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f14;border:1px solid #1f2937;border-radius:10px;padding:20px;margin-bottom:24px;">
              <tr><td style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;padding-bottom:4px;">Email</td></tr>
              <tr><td style="font-size:14px;color:#e5e7eb;padding-bottom:16px;">${escapeHtml(opts.to)}</td></tr>
              <tr><td style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;padding-bottom:4px;">Temporary password</td></tr>
              <tr><td style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:15px;color:#5eead4;letter-spacing:0.02em;">${escapeHtml(opts.temporaryPassword)}</td></tr>
            </table>

            <a href="${loginUrl}" style="display:block;background:#5eead4;color:#0b0f14;font-weight:600;text-align:center;padding:14px 20px;border-radius:10px;text-decoration:none;font-size:15px;">Log in to the portal</a>

            <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.55;">
              <strong style="color:#9ca3af;">On iPhone?</strong> After logging in, tap Share → Add to Home Screen, then open the portal from the home screen icon. Push reminders only work when it's installed as an app — quirk of iOS Safari.
            </p>

            <p style="margin:24px 0 0;color:#4b5563;font-size:12px;line-height:1.55;">Welcome aboard.<br/>— Peak State Labs</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject,
    text,
    html,
  });
  if (error) throw new Error(error.message);
  return { sent: true, id: data?.id ?? null };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
