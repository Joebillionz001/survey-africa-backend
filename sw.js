const CACHE_NAME = 'survey-africa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/login.html',
  '/signup.html',
  '/enhanced-survey-builder.html',
  '/survey-preview.html',
  '/js/app.js',
  '/js/api.js',
  '/js/config.js',
  '/js/mobile.js',
  '/css/responsive.css',
  '/css/footer.css',
  '/css/logo.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Validate URL to prevent SSRF
  const url = new URL(event.request.url);
  const allowedHosts = [
    'localhost',
    '127.0.0.1',
    'surveyafrica.netlify.app',
    'surveyafrica-backend.up.railway.app',
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net'
  ];
  
  if (!allowedHosts.some(host => url.hostname === host || url.hostname.endsWith('.' + host))) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline survey submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'survey-submission') {
    event.waitUntil(syncSurveySubmissions());
  }
});

async function syncSurveySubmissions() {
  const submissions = await getStoredSubmissions();
  
  for (const submission of submissions) {
    try {
      // Validate submission data
      if (!submission.data || !submission.token) {
        continue;
      }
      
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${submission.token}`
        },
        body: JSON.stringify(submission.data)
      });

      if (response.ok) {
        await removeStoredSubmission(submission.id);
        
        // Show notification
        self.registration.showNotification('Survey Submitted!', {
          body: 'Your survey response has been submitted successfully.',
          icon: '/icon-192.png',
          badge: '/badge-72.png'
        });
      }
    } catch (error) {
      console.error('Failed to sync submission:', error);
    }
  }
}

async function getStoredSubmissions() {
  // This would typically use IndexedDB
  return [];
}

async function removeStoredSubmission(id) {
  // Remove from IndexedDB
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New survey available!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Take Survey',
        icon: '/icon-survey.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Survey Africa', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard.html')
    );
  }
});