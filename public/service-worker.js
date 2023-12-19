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
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
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
