import { NextRequest, NextResponse } from "next/server";

// Zapier Catch Hook that forwards Peak State Creator Program applications into
// ClickFunnels 2.0 (where the "Creator Program" tag is applied). Catch-hook URLs
// are write-only, so the value is safe to keep here as a fallback, but it can be
// overridden via the ZAPIER_CREATOR_WEBHOOK_URL env var without a redeploy.
//
// TODO: replace the placeholder below with the real catch-hook URL, or set
// ZAPIER_CREATOR_WEBHOOK_URL in the environment.
const ZAPIER_CREATOR_WEBHOOK_URL =
  "https://hooks.zapier.com/hooks/catch/REPLACE_ME/creator-program/";

// Tag ClickFunnels should apply to everyone who comes through this funnel.
// Zapier reads this field off the payload so the tag can change without a deploy.
const CREATOR_PROGRAM_TAG = "Creator Program";

const FOLLOWER_OPTIONS = [
  "Just getting started",
  "Under 1K",
  "1K–5K",
  "5K–25K",
  "25K–100K",
  "100K+",
];

const CONTENT_OPTIONS = [
  "Health & wellness",
  "Fitness",
  "Weight loss / body transformation",
  "Peptides / GLP-1s",
  "Beauty / lifestyle",
  "Other",
];

const PEPTIDE_OPTIONS = ["Yes", "No", "Not currently, but interested"];

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName = str(body.firstName);
    const lastName = str(body.lastName);
    const email = str(body.email).toLowerCase();
    const phone = str(body.phone);
    const tiktok = str(body.tiktok);
    const instagram = str(body.instagram);
    const followers = str(body.followers);
    const contentType = str(body.contentType);
    const usingPeptides = str(body.usingPeptides);
    const why = str(body.why);
    const acknowledged = body.acknowledged === true;

    // Required fields (phone + Instagram are optional per the application copy).
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First and last name are required" },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }
    if (!tiktok) {
      return NextResponse.json(
        { error: "TikTok handle is required" },
        { status: 400 }
      );
    }
    if (!FOLLOWER_OPTIONS.includes(followers)) {
      return NextResponse.json(
        { error: "Please select a follower range" },
        { status: 400 }
      );
    }
    if (!CONTENT_OPTIONS.includes(contentType)) {
      return NextResponse.json(
        { error: "Please select a content type" },
        { status: 400 }
      );
    }
    if (!PEPTIDE_OPTIONS.includes(usingPeptides)) {
      return NextResponse.json(
        { error: "Please answer the peptide question" },
        { status: 400 }
      );
    }
    if (!why) {
      return NextResponse.json(
        { error: "Please tell us why you want to join" },
        { status: 400 }
      );
    }
    if (!acknowledged) {
      return NextResponse.json(
        { error: "You must agree to the creator guidelines" },
        { status: 400 }
      );
    }

    const webhookUrl =
      process.env.ZAPIER_CREATOR_WEBHOOK_URL || ZAPIER_CREATOR_WEBHOOK_URL;

    if (webhookUrl.includes("REPLACE_ME")) {
      // Fail loudly in logs but don't leak config details to the client.
      console.error(
        "Creator apply: ZAPIER_CREATOR_WEBHOOK_URL is not configured"
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const userAgent = req.headers.get("user-agent") || "";

    // Normalize social handles to bare @handles for a clean ClickFunnels record.
    const normalizeHandle = (raw: string) => {
      if (!raw) return "";
      const handle = raw
        .replace(/^https?:\/\/(www\.)?(tiktok|instagram)\.com\//i, "")
        .replace(/\/+$/, "")
        .replace(/^@/, "")
        .trim();
      return handle ? `@${handle}` : "";
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Contact — what Zapier maps into ClickFunnels for the tag + follow-up.
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        // Full application context.
        tiktok_handle: normalizeHandle(tiktok),
        instagram_handle: normalizeHandle(instagram),
        followers,
        content_type: contentType,
        using_peptides: usingPeptides,
        why,
        acknowledged_guidelines: acknowledged,
        // Routing metadata.
        tag: CREATOR_PROGRAM_TAG,
        source: "creator-program-application",
        timestamp: new Date().toISOString(),
        ip,
        user_agent: userAgent,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error(
        "Creator apply: Zapier webhook error:",
        response.status,
        responseText
      );
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: "Application received", email });
  } catch (err) {
    console.error("Creator apply error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
