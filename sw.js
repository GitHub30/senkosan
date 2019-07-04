importScripts('/senkosan/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/senkosan/_nuxt/10275cc0efca510e200c.js",
    "revision": "be6f0849f7c765cb4e11791558d07e9a"
  },
  {
    "url": "/senkosan/_nuxt/1d58f48a656c8f9424e3.js",
    "revision": "9ee0753e7cf09fc79de1ad949ccbd0fd"
  },
  {
    "url": "/senkosan/_nuxt/5873623f7f5bd438a953.js",
    "revision": "12ebe5739b81e17965766eb767972add"
  },
  {
    "url": "/senkosan/_nuxt/6bb098db29b6f39df770.js",
    "revision": "60da66c7d2d2c2fd092020497d861160"
  },
  {
    "url": "/senkosan/_nuxt/8d1baea7fb3190ffd649.js",
    "revision": "df235223db6c422b524389873ebf772a"
  },
  {
    "url": "/senkosan/_nuxt/af139cb19095cf5d0b95.js",
    "revision": "bdd286b17cb3254a368eb3cc7a953a38"
  }
], {
  "cacheId": "senko",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/senkosan/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/senkosan/.*'), workbox.strategies.networkFirst({}), 'GET')
