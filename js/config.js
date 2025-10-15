// API Configuration
const API_CONFIG = (() => {
  const hostname = window.location.hostname;

  let backendUrl;

  if (hostname.includes('ngrok-free.app') || hostname.includes('ngrok.io')) {
    // If on ngrok, use the corresponding ngrok backend URL
    // This assumes the backend is also exposed via ngrok on a different subdomain
    // or you have a specific backend URL for ngrok testing
    const backendSubdomain = 'your-backend-ngrok-subdomain'; // Replace with your actual backend ngrok subdomain
    backendUrl = `https://${backendSubdomain}.ngrok-free.app`;
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Local development
    backendUrl = 'http://localhost:8000'; // Assuming your backend runs on port 8000
  } else {
    // Production environment
    backendUrl = 'https://your-production-backend.com'; // Replace with your production backend URL
  }

  return {
    BASE_URL: backendUrl,
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com' // Replace with your Google Client ID
  };
})();