const CACHE_NAME = "llm-wiki-playground-v3";
const CACHE_PREFIX = "llm-wiki-playground-";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => precacheShell(cache))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function precacheShell(cache) {
  const indexUrl = new URL("./index.html", self.registration.scope);
  const indexResponse = await fetch(indexUrl);
  if (!indexResponse.ok) {
    throw new Error(`Failed to precache ${indexUrl.href}`);
  }

  const html = await indexResponse.clone().text();
  await cache.put(indexUrl.href, indexResponse);

  const scopeUrl = new URL("./", self.registration.scope).href;
  const manifestUrl = new URL("./manifest.webmanifest", self.registration.scope);
  const urls = new Set([scopeUrl, manifestUrl.href]);

  for (const raw of linkedUrls(html)) {
    urls.add(new URL(raw, indexUrl).href);
  }

  const manifestResponse = await fetch(manifestUrl);
  if (manifestResponse.ok) {
    const manifest = await manifestResponse.json();
    for (const icon of manifest.icons ?? []) {
      if (icon.src) urls.add(new URL(icon.src, manifestUrl).href);
    }
  }

  await cache.addAll([...urls]);
}

function linkedUrls(html) {
  const urls = [];
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
    const value = match[1];
    if (!value || value.startsWith("#") || value.startsWith("data:") || value.startsWith("mailto:")) {
      continue;
    }
    urls.push(value);
  }
  return urls;
}

async function networkFirst(request) {
  const indexUrl = new URL("./index.html", self.registration.scope).href;
  try {
    return await cacheResponse(request, await fetch(request));
  } catch {
    return (await caches.match(request)) ?? (await caches.match(indexUrl)) ?? Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    return await cacheResponse(request, await fetch(request));
  } catch {
    return Response.error();
  }
}

async function cacheResponse(request, response) {
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}
