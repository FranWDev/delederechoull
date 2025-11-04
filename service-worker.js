const CACHE_NAME = "static-v8";


const ASSETS = [
  "index.html",

  "assets/favicon.ico",
  "assets/logo.svg",
  "assets/drive.svg",
  "assets/example.webp",
  "assets/icon-512.png",
  "assets/icon-192.png",

  "styles/var.css",
  "styles/main.css",
  "styles/section/hero.css",
  "styles/section/about.css",
  "styles/section/social.css",
  "styles/section/repository.css",
  "styles/section/gallery.css",
  "styles/section/contact.css",
  "styles/section/footer.css",
  "styles/responsive.css",

  "scripts/parallax.js",
  "scripts/slider.js",
  "scripts/main.js",
  "scripts/scroll-animations.js",
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
