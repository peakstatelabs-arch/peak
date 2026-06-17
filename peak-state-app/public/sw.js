const CACHE = "psl-v2";
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

  if (
    url.pathname.startsWith("/portal/api/") ||
    url.pathname.startsWith("/portal/auth/") ||
    !url.pathname.startsWith("/portal/")
  ) {
    return;
  }

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

// Clicking a notification opens (or focuses) the peptide tracker.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = "/portal/peptide-tracker";
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
