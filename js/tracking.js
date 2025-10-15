// Simple tracking for Survey Africa
function trackEvent(eventName, properties = {}) {
  console.log('Event:', eventName, properties);
  
  // Store events locally for analytics
  const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
  events.push({
    event: eventName,
    properties,
    timestamp: new Date().toISOString(),
    url: window.location.href
  });
  
  // Keep only last 100 events
  if (events.length > 100) {
    events.splice(0, events.length - 100);
  }
  
  localStorage.setItem('analytics_events', JSON.stringify(events));
}

// Track page views
window.addEventListener('load', () => {
  trackEvent('page_view', {
    page: window.location.pathname,
    title: document.title
  });
});

// Track clicks on important elements
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn, .cta-button, .nav-link')) {
    trackEvent('button_click', {
      text: e.target.textContent.trim(),
      href: e.target.href || null
    });
  }
});