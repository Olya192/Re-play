const CACHE_NAME = 'v1_static_cache'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/biomes/earth/forest/biome.png',
  '/biomes/earth/forest/sky.png',
  '/biomes/variation/clouds.webp',
  '/biomes/variation/desserts.webp',
  '/biomes/variation/fruits.webp',
  '/biomes/variation/mountains.webp',
  '/biomes/variation/sky-v4.webp',
  '/biomes/variation/water.jpg'
]

// 1. Install Event: Cache essential files
self.addEventListener('install', (event) => {
  console.log('install')
  event.waitUntil(
    caches.open(CACHE_NAME).then(async(cache) => {
      try {
        // Cache the root assets (static assets like HTML)
        await cache.addAll(ASSETS_TO_CACHE)

        // Dynamically cache all CSS files
        const cssFiles = await fetchAssets('css') // This is a custom function
        await cache.addAll(cssFiles)

        // Dynamically cache all JS files
        const jsFiles = await fetchAssets('js') // This is a custom function
        await cache.addAll(jsFiles)
      } catch ( error ) {
        console.error('Failed to cache resources:', error)
      }
    })
  )
  self.skipWaiting()
})

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('activate')
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
    fetch(event.request)
      .catch(() => {
        // If network fails, try matching the asset in the cache
        return caches.match(event.request).then((response) => {
          // If asset is found in cache, return it; otherwise return offline page
          return response || caches.match('/index.html')
        })
      })
  )
})


// A function to dynamically fetch assets based on type
async function fetchAssets(type) {
  const response = await fetch('/') // You could make a request to the root
  const text = await response.text()

  let assets = []
  let regex

  // Dynamically generate regex based on asset type
  if (type === 'css') {
    regex = /href="([^"]+\.css)"/g // Match CSS files by href attributes
  } else if (type === 'js') {
    regex = /src="([^"]+\.js)"/g // Match JS files by src attribute
  }

  let match
  while ( (match = regex.exec(text)) ) {
    console.log('-', match[1])
    assets.push(match[1]) // Add matched asset URLs
  }

  return assets
}
