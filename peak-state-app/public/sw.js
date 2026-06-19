const CACHE = "psl-v3";
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

// Web Push — fired when our server sends a push, even if the app is closed.
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

// If a push subscription gets refreshed by the browser, drop the stale one.
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    fetch("/portal/api/push/unsubscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ endpoint: event.oldSubscription?.endpoint }),
    }).catch(() => {})
  );
});
