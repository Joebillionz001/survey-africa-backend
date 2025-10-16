// js/config.js
// API Configuration
const API_CONFIG = (() => {
  const hostname = window.location.hostname; // e.g., 'localhost', '127.0.0.1', 'your-site.com'

  // Define backend URLs
  const localBackend = 'http://localhost:5000';
  const productionBackend = 'https://surveyafrica-backend.up.railway.app';

  // Determine which backend to use
  const getBaseUrl = () => {
    // Use local backend for local development
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
      return localBackend;
    }
    // Use production backend for all other domains (ngrok, live site, etc.)
    return productionBackend;
  };

  return {
    BASE_URL: getBaseUrl(),
    // IMPORTANT: This should be set as an environment variable in your hosting environment (e.g., Netlify).
    // For local testing, you can temporarily set it here.
    // NEVER put your Client Secret here. Only the public Client ID is safe for frontend code.
    // Your Client ID looks like: 'xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com'
    GOOGLE_CLIENT_ID: '738803132069-2smc9eictpu5t09e4q070bqe27ci47hu.apps.googleusercontent.com'
  };
})();
