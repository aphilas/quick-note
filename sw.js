const CACHE_VERSION = 1
const CACHE_NAME = `v${CACHE_VERSION}`

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.addAll(resources)
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/site.webmanifest",
      "/favicon-32x32.png",
      "/favicon-16x16.png",
      "/scripts/main.js",
      "/styles/main.css",
    ])
  )

  // Force the waiting service worker to become the active service worker.
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable()
      }
    })()
  )

  // Take control of the page immediately.
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      try {
        // Try to use the navigation preload response.
        const preloadResponse = await event.preloadResponse

        if (preloadResponse) {
          return preloadResponse
        }

        // Always try the network first.
        const networkResponse = await fetch(event.request)
        return networkResponse
      } catch (error) {
        // Error likely due to a network error.
        const cache = await caches.open(CACHE_NAME)
        const cachedResponse = await cache.match(event.request)

        if (cachedResponse) {
          return cachedResponse
        }
      }
    })()
  )
})
