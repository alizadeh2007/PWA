/* eslint-disable no-restricted-globals */
//! Static caches
const CACHE_NAME = "Static_1";
const precachedResources = ["/", "/index.html"];

//! Cache

self.addEventListener("install", (event) => {
  event.waitUntil(async () => {
    await caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "index.html"]);
    });
  });
});

//! Fetch and Updating | Dynamicy
self.addEventListener("fetch", (event) => {
  try {
    const request = event.request;
    if (
      request.method !== "POST" &&
      request.url.startsWith("chrome-extension://")
    ) {
      // Ignore requests with the 'chrome-extension' scheme
      return;
    }

    // Handle other requests as usual
    event.respondWith(
      caches.match(request).then((response) => {
        // Return the cached response if found
        if (response) {
          return response;
        }

        // Fetch the resource and cache it
        return fetch(request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } catch (error) {
    console.log("An error occured at the fetch service worker", error);
  }
});
//! Activate
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
