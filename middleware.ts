import { NextRequest, NextResponse } from "next/server";

const STRUCTURED_PEPTIDES_HOSTS = new Set([
  "structuredpeptides.com",
  "www.structuredpeptides.com",
]);

// One canonical address: browsers keep cookies and the saved cart per
// address, so a visitor bouncing between peakstate.shop and
// www.peakstate.shop would lose their cart. Send the bare domain to www.
const APEX_HOST = "peakstate.shop";
const CANONICAL_ORIGIN = "https://www.peakstate.shop";

// Countries the site doesn't serve. Vercel sets x-vercel-ip-country on every
// request (and overwrites any value the visitor sends). Visitors from these
// get a generic "site is down" page — deliberately no mention of location.
const BLOCKED_COUNTRIES = new Set(["AU"]);

const DOWN_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Peak State Labs</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #f3fafb; color: #1a4f8b; text-align: center; padding: 24px; box-sizing: border-box; }
  img { width: 56px; height: 56px; border-radius: 14px; }
  h1 { margin: 20px 0 8px; font-size: 26px; }
  p { margin: 0; font-size: 16px; color: rgba(26, 79, 139, 0.7); }
</style>
</head>
<body>
  <main>
    <img src="/logo.png" alt="Peak State Labs">
    <h1>Site temporarily unavailable</h1>
    <p>We're currently down. Please check back later.</p>
  </main>
</body>
</html>`;

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  const { pathname, search } = request.nextUrl;

  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country && BLOCKED_COUNTRIES.has(country)) {
    return pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Service unavailable." }, { status: 503 })
      : new NextResponse(DOWN_PAGE, {
          status: 503,
          headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
        });
  }

  // API calls are only here for the country check above.
  if (pathname.startsWith("/api/")) return NextResponse.next();

  if (host.split(":")[0] === APEX_HOST) {
    return NextResponse.redirect(`${CANONICAL_ORIGIN}${pathname}${search}`, 308);
  }

  if (STRUCTURED_PEPTIDES_HOSTS.has(host) && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/structured-peptides";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
