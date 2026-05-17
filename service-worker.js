const CACHE_NAME = "chuk-cache-v1";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",

  "./assets/icon-72.png",
  "./assets/icon-96.png",
  "./assets/icon-128.png",
  "./assets/icon-144.png",
  "./assets/icon-152.png",
  "./assets/icon-192.png",
  "./assets/icon-384.png",
  "./assets/icon-512.png",

  "./assets/screenshot1.png",
  "./assets/screenshot2.png"
];


// INSTALL
self.addEventListener("install", (event) => {

  console.log("Service Worker Installed");

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then((cache) => {

        console.log("Caching Files");

        return cache.addAll(STATIC_ASSETS);

      })

  );

  self.skipWaiting();

});


// ACTIVATE
self.addEventListener("activate", (event) => {

  console.log("Service Worker Activated");

  event.waitUntil(

    caches.keys().then((keys) => {

      return Promise.all(

        keys.map((key) => {

          if (key !== CACHE_NAME) {

            console.log("Removing Old Cache:", key);

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});


// FETCH
self.addEventListener("fetch", (event) => {

  event.respondWith(

    caches.match(event.request)

      .then((cachedResponse) => {

        // CACHE FIRST
        if (cachedResponse) {

          return cachedResponse;

        }

        // NETWORK
        return fetch(event.request)

          .then((networkResponse) => {

            // SAVE NEW RESPONSE
            return caches.open(CACHE_NAME)

              .then((cache) => {

                cache.put(
                  event.request,
                  networkResponse.clone()
                );

                return networkResponse;

              });

          })

          .catch(() => {

            // OFFLINE FALLBACK
            if (
              event.request.destination === "document"
            ) {

              return caches.match("./index.html");

            }

          });

      })

  );

});


// PUSH NOTIFICATION
self.addEventListener("push", (event) => {

  const data = event.data
    ? event.data.text()
    : "New Notification";

  event.waitUntil(

    self.registration.showNotification(
      "Chuk an Chukk",
      {
        body: data,
        icon: "./assets/icon-192.png",
        badge: "./assets/icon-96.png"
      }
    )

  );

});


// NOTIFICATION CLICK
self.addEventListener(
  "notificationclick",
  (event) => {

    event.notification.close();

    event.waitUntil(

      clients.openWindow("./")

    );

  }
);
