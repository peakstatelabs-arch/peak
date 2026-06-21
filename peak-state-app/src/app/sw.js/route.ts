// Service worker generated per build. The cache name is tied to the deploy
// SHA so every push to Vercel invalidates the previous shell — no more
// "open it in incognito to see the new build" surprises.

const VERSION =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
  process.env.NEXT_PUBLIC_BUILD_ID ||
  String(Date.now());

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = swSource(VERSION);
  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      // Don't let HTTP caches keep an old SW alive across deploys.
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Service-Worker-Allowed": "/portal/",
    },
  });
}

function swSource(version: string): string {
  return `// Peak State Labs SW — build ${version}
const CACHE = "psl-${version}";
const PRECACHE = [
  "/portal/",
  "/portal/dashboard",
  "/portal/login",
  "/portal/peptide-tracker",
  "/portal/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Never cache: API, auth, the SW itself, or anything outside /portal
  if (
    url.pathname.startsWith("/portal/api/") ||
    url.pathname.startsWith("/portal/auth/") ||
    url.pathname === "/portal/sw.js" ||
    !url.pathname.startsWith("/portal/")
  ) {
    return;
  }

  // Network-first for HTML so new builds show up immediately; cache as fallback.
  const isHTML = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/portal/")))
    );
    return;
  }

  // Stale-while-revalidate for everything else (static assets).
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            cache.put(req, res.clone());
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const target = data.url || "/portal/peptide-tracker";
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of all) {
        if (c.url.includes("/portal/")) {
          c.focus();
          c.navigate(target);
          return;
        }
      }
      await self.clients.openWindow(target);
    })()
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "Peak State Labs", body: "", url: "/portal/peptide-tracker", tag: "psl" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    if (event.data) data.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/portal/icons/icon-192.png",
      badge: "/portal/icons/icon-192.png",
      tag: data.tag,
      data: { url: data.url },
      vibrate: [80, 40, 80],
    })
  );
});

self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    fetch("/portal/api/push/unsubscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ endpoint: event.oldSubscription?.endpoint }),
    }).catch(() => {})
  );
});
`;
}
