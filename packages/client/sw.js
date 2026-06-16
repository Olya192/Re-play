const CACHE_NAME = `static_cache_v${(new Date()).getTime()}`
const MANIFEST_URL = '/manifest.json'

// 1. Install Event: Cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async(cache) => {
      try {
        const files = await fetchAssets('css')
        await cache.addAll(files)
      } catch ( error ) {
        console.error('Failed to cache resources:', error)
      }
    })
  )
  self.skipWaiting()
})

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache)

            return caches.delete(cache)
          }
        })
      )
    })
  )
})

// 3. Fetch Event: Network-first fallback to cache strategy
self.addEventListener('fetch', (event) => {
  console.log('fetch')
  event.respondWith(
    (async() => {
      try {
        const cachedResponse = await caches.match(event.request)

        if (cachedResponse) {
          return cachedResponse
        }

        const response = await fetch(event.request)
        const cache = await caches.open(CACHE_NAME)
        await cache.put(event.request, response.clone())

        return response
      } catch ( error ) {
        return await caches.match('index.html')
      }
    })()
  )
})


// A function to dynamically fetch assets based on type
async function fetchAssets() {
  const assets = ['/', '/index.html']
  const manifest = await loadManifest()

  if (manifest) {
    for ( const [_, value] of Object.entries(manifest) ) {
      assets.push(value.file)

      if (value.css) {
        for ( const cssFile of value.css ) {
          assets.push(cssFile)
        }
      }
    }
  }

  return assets
}

async function loadManifest() {
  try {
    const response = await fetch(MANIFEST_URL)

    return await response.json()

  } catch ( error ) {
    console.warn('Failed to parse manifest:', error)
  }
}