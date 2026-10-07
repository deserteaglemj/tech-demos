export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return;
  }

  // Resolve next to the page so `base: "./"` still works in a subpath,
  // not only when the app is hosted at the domain root.
  const swUrl = new URL("sw.js", document.baseURI).href;
  const register = () =>
    navigator.serviceWorker.register(swUrl).catch((error: unknown) => {
      console.warn("Service worker registration failed.", error);
    });

  if (document.readyState === "complete") {
    void register();
  } else {
    window.addEventListener("load", () => void register(), { once: true });
  }
}

registerServiceWorker();
