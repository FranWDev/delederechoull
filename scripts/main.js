if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        console.log("[App] Service Worker registrado correctamente:", registration);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "activated") {
              console.log("[App] Nuevo Service Worker activado");
            }
          });
        });
      })
      .catch((error) => {
        console.error("[App] Error al registrar Service Worker:", error);
      });
  });
  
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data.type === "OFFLINE_MODE") {
      console.log("[App] Modo offline activado");
    }
  });
} else {
  console.warn("[App] Service Worker no soportado en este navegador");
}
