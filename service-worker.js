const CACHE_NAME = "dele-derecho-v1";
const OFFLINE_PAGE = "/index.html";

const ESSENTIAL_ASSETS = [
  "/",
  "/index.html",
  "/styles/var.css",
  "/styles/main.css",
  "/styles/responsive.css",
  "/styles/section/hero.css",
  "/styles/section/about.css",
  "/styles/section/social.css",
  "/styles/section/repository.css",
  "/styles/section/gallery.css",
  "/styles/section/contact.css",
  "/styles/section/footer.css",
  "/scripts/main.js",
  "/scripts/parallax.js",
  "/scripts/slider.js",
  "/scripts/scroll-animations.js",
  "/assets/favicon.ico",
  "/assets/logo.svg",
  "/assets/drive.svg",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
];

const GALLERY_ASSETS = [
  "/assets/slider1.webp",
  "/assets/slider2.webp",
  "/assets/slider3.webp",
  "/assets/slider4.webp",
  "/assets/slider5.webp",
  "/assets/slider6.webp",
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Instalando...");
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Cacheando archivos esenciales");
      return cache.addAll(ESSENTIAL_ASSETS)
        .then(() => {
          console.log("[Service Worker] Archivos esenciales en caché");
          // Cachear imágenes de forma no-crítica
          cache.addAll(GALLERY_ASSETS).catch((err) => {
            console.log("[Service Worker] Error cacheando imágenes:", err);
          });
        })
        .catch((err) => {
          console.error("[Service Worker] Error durante instalación:", err);
        });
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activando...");
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log("[Service Worker] Eliminando caché antiguo:", cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log("[Service Worker] Activado correctamente");
    })
  );
  
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          console.log("[Service Worker] Recurso externo no disponible (offline):", request.url);
          return new Response("Recurso no disponible sin conexión", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain; charset=UTF-8",
            }),
          });
        })
    );
    return;
  }

  if (
    request.url.includes(".css") ||
    request.url.includes(".js") ||
    request.url.includes(".webp") ||
    request.url.includes(".svg") ||
    request.url.includes(".png") ||
    request.url.includes(".ico") ||
    request.url.includes(".woff") ||
    request.url.includes(".woff2") ||
    request.url.includes(".ttf")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const cacheName = CACHE_NAME;
                const cache = caches.open(cacheName);
                cache.then((c) => c.put(request, response.clone()));
              }
              return response;
            })
            .catch(() => {
              console.log("[Service Worker] Asset no disponible:", request.url);
              return new Response("Recurso no disponible", { status: 404 });
            })
        );
      })
    );
    return;
  }

  if (request.destination === "document" || request.url.endsWith("/") || request.url.endsWith(".html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          console.log("[Service Worker] Usando versión en caché de:", request.url);
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_PAGE);
          });
        })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match(OFFLINE_PAGE);
        });
      })
  );
});
