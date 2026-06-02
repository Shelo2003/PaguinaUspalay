const CACHE_NAME =
  "pendientes-caja-v1";


const urlsToCache = [

  "/PaguinaUspalay/pendientes-caja/",

  "/PaguinaUspalay/pendientes-caja/index.html",

  "/PaguinaUspalay/pendientes-caja/style.css",

  "/PaguinaUspalay/pendientes-caja/script.js",

  "/PaguinaUspalay/pendientes-caja/api.js"

];


// =========================
// INSTALL
// =========================

self.addEventListener(

  "install",

  event => {

    event.waitUntil(

      caches.open(
        CACHE_NAME
      ).then(cache => {

        return cache.addAll(
          urlsToCache
        );

      })

    );

  }

);


// =========================
// FETCH
// =========================

self.addEventListener(

  "fetch",

  event => {

    event.respondWith(

      caches.match(
        event.request
      ).then(response => {

        return (

          response ||

          fetch(
            event.request
          )

        );

      })

    );

  }

);