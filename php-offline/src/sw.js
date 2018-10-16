importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"
);

if (!workbox) {
  console.log(`Boo! Workbox didn't load 😬`);
  throw new Error("Failed loading workbox");
}

workbox.setConfig({
  debug: true
});
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

// caceh js and css
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "static-resources"
  })
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "google-fonts-stylesheets"
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30
      })
    ]
  })
);

// cache images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

// cache homepage
workbox.routing.registerRoute(
  "/",
  workbox.strategies.cacheFirst({
    cacheName: "pages",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

const FALLBACK_HTML = "/offline.html";

// preload offline page
workbox.precaching.precacheAndRoute([{ url: FALLBACK_HTML, revision: "1" }]);

// Use a stale-while-revalidate strategy for all other requests.
workbox.routing.setDefaultHandler(workbox.strategies.staleWhileRevalidate());

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
workbox.routing.setCatchHandler(({ event, request, url }) => {
  try {
    // Use event, request, and url to figure out how to respond.
    // One approach would be to use request.destination, see
    // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
    switch (request.destination) {
      case "document":
        return caches.match(FALLBACK_HTML);
        break;

      default:
        // If we don't have a fallback, just return an error response.
        console.log(event);
        return Response.error();
    }
  } catch (error) {
    return caches.match(FALLBACK_HTML);
  }
});

/*
workbox.routing.registerRoute(
  new RegExp('/images/'),
  async ({event}) => {
    try {
      return await workbox.strategies.cacheFirst().handle({event});
    } catch (error) {
      return caches.match(FALLBACK_IMAGE_URL);
    }
  }
});
*/

/*
const strategy = workbox.strategies.networkOnly()
workbox.routing.registerRoute(new RegExp('/.*'), ({event}) => {
  return strategy.handle({event})
    .catch(() => caches.match('<%= options.offlinePage %>'))
})<% } %>

const customHandler = async (args) => {
  try {
    console.log(args.event.request.url)
    const response = await networkFirst.handle(args);
    return response || await caches.match(args.event.request.url);
  }catch (error) {
      return caches.open('/offline.html').then(function(cache) {
         return caches.match('/offline.html');
    })
  }
}
*/
