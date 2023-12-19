/* eslint-disable no-restricted-globals */
//! Static caches 
const CACHE_NAME = "Static_4";
const precachedResources = [
"/",
"/index.html"
];

//! Cache

self.addEventListener("install", (event) => {
   event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const stack=[];
      let check=true
      precachedResources.forEach(path => {
      stack.push(cache.add(path).catch((path)=>console.log(`can't load ${path} to cache`)))
      check=cache.add(path)
      if(!check || check===null || check===undefined){
      console.log("path faild to install",path);
    }
    return Promise.all(stack);
  })
    return true;
  } catch (error) {
      console.log("An error occured at the install service worker",error);
  }
   })());
});

//! Fetch and Updating | Dynamicy
self.addEventListener('fetch', (event) => {
  try {
  const request = event.request;
  if (request.method !== 'POST' && request.url.startsWith('chrome-extension://')) {
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
  console.log("An error occured at the fetch service worker",error);

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
