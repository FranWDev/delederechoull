const BASE = self.location.pathname.replace(/service-worker\.js$/, "");

const ASSETS = [
  BASE + "index.html",
  BASE + "assets/favicon.ico",
  BASE + "assets/logo.svg",
  BASE + "assets/drive.svg",
  BASE + "assets/example.webp",
  BASE + "assets/icon-512.png",
  BASE + "assets/icon-192.png",
  BASE + "styles/var.css",
  BASE + "styles/main.css",
  BASE + "styles/section/hero.css",
  BASE + "styles/section/about.css",
  BASE + "styles/section/social.css",
  BASE + "styles/section/repository.css",
  BASE + "styles/section/gallery.css",
  BASE + "styles/section/contact.css",
  BASE + "styles/section/footer.css",
  BASE + "styles/responsive.css",
  BASE + "scripts/parallax.js",
  BASE + "scripts/slider.js",
  BASE + "scripts/main.js",
  BASE + "scripts/scroll-animations.js",
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});
