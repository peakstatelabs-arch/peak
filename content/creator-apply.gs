/**
 * Peak State Creator Program — application email notifier.
 *
 * Emails you every Creator Program application (all answers) when someone
 * completes /creator/apply. Pairs with the Zapier → ClickFunnels hook, which
 * handles the contact + "Creator Program" tag; this handles the full Q&A that
 * ClickFunnels can't store.
 *
 * SETUP
 *  1. Go to https://script.google.com → New project. Paste this whole file in.
 *  2. Change RECIPIENT below to the address that should receive applications.
 *  3. Deploy → New deployment → type "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Copy the Web app URL (…/exec).
 *  4. In your hosting env (Vercel), set:
 *       CREATOR_NOTIFY_WEBHOOK_URL = <that /exec URL>
 *  5. Submit a test application — you should get an email within a few seconds.
 *
 * Note: the first deploy prompts you to authorize sending email as your account.
 */

// Where applications are emailed. Comma-separate for multiple recipients.
var RECIPIENT = "drewdeorsey@gmail.com";

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    var fullName =
      data.name ||
      [data.first_name, data.last_name].filter(Boolean).join(" ") ||
      "Unknown applicant";

    var rows = [
      ["Name", fullName],
      ["Email", data.email],
      ["Phone", data.phone || "—"],
      ["TikTok", data.tiktok_handle || "—"],
      ["Instagram", data.instagram_handle || "—"],
      ["Followers", data.followers],
      ["Content type", data.content_type],
      ["Using peptides/GLP-1s", data.using_peptides],
      ["Why join", data.why],
      ["Agreed to guidelines", data.acknowledged_guidelines ? "Yes" : "No"],
      ["Submitted", data.timestamp],
    ];

    var textBody = rows
      .map(function (r) {
        return r[0] + ": " + (r[1] == null ? "" : r[1]);
      })
      .join("\n");

    var htmlBody =
      '<div style="font-family:Arial,Helvetica,sans-serif;color:#155090">' +
      '<h2 style="margin:0 0 4px">New Creator Program application</h2>' +
      '<p style="margin:0 0 16px;color:#5b7fa6">' +
      fullName +
      "</p>" +
      '<table cellpadding="8" style="border-collapse:collapse;font-size:14px">' +
      rows
        .map(function (r) {
          var val = r[1] == null ? "" : String(r[1]);
          val = val
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>");
          return (
            '<tr style="border-bottom:1px solid #e2eef1">' +
            '<td style="font-weight:bold;white-space:nowrap;vertical-align:top">' +
            r[0] +
            "</td><td>" +
            val +
            "</td></tr>"
          );
        })
        .join("") +
      "</table></div>";

    MailApp.sendEmail({
      to: RECIPIENT,
      subject: "New Creator Application — " + fullName,
      replyTo: data.email || RECIPIENT,
      body: textBody,
      htmlBody: htmlBody,
    });

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
