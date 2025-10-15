class RealtimeManager {
  constructor() {
    this.eventSource = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Initialize real-time updates
  init() {
    this.startPolling();
    this.setupNotifications();
  }

  // Start polling for updates
  startPolling() {
    setInterval(() => {
      this.fetchLiveStats();
      this.fetchNotifications();
    }, 30000); // Poll every 30 seconds
  }

  // Fetch live statistics
  async fetchLiveStats() {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) return;
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/realtime/stats`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const stats = await response.json();
        this.updateStatsDisplay(stats);
      }
    } catch (error) {
      console.error('Failed to fetch live stats:', error);
      this.handleError('Failed to update live statistics');
    }
  }

  // Fetch notifications
  async fetchNotifications() {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) return;
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/realtime/notifications`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const notifications = await response.json();
        this.displayNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      this.handleError('Failed to fetch notifications');
    }
  }

  // Update stats display
  updateStatsDisplay(stats) {
    const elements = {
      totalUsers: document.getElementById('total-users'),
      activeSurveys: document.getElementById('active-surveys'),
      totalEarnings: document.getElementById('total-earnings')
    };

    if (elements.totalUsers) elements.totalUsers.textContent = stats.totalUsers.toLocaleString();
    if (elements.activeSurveys) elements.activeSurveys.textContent = stats.activeSurveys;
    if (elements.totalEarnings) elements.totalEarnings.textContent = `$${stats.totalEarnings.toFixed(2)}`;
  }

  // Display notifications
  displayNotifications(notifications) {
    const container = document.getElementById('notifications-container');
    if (!container) return;

    container.innerHTML = '';
    notifications.forEach(notif => {
      const notifDiv = document.createElement('div');
      notifDiv.className = `notification ${this.sanitizeClass(notif.type)}`;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'notification-content';

      const messageP = document.createElement('p');
      messageP.textContent = notif.message;

      const timeSmall = document.createElement('small');
      timeSmall.textContent = new Date(notif.timestamp).toLocaleTimeString();

      contentDiv.appendChild(messageP);
      contentDiv.appendChild(timeSmall);
      notifDiv.appendChild(contentDiv);
      container.appendChild(notifDiv);
    });
  }

  // Sanitize CSS class names
  sanitizeClass(className) {
    return className.replace(/[^a-zA-Z0-9-_]/g, '');
  }

  // Setup browser notifications
  setupNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  // Show browser notification
  showNotification(title, message) {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Handle errors
  handleError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      setTimeout(() => errorDiv.style.display = 'none', 5000);
    }
  }
}

// Initialize real-time manager
const realtimeManager = new RealtimeManager();
document.addEventListener('DOMContentLoaded', () => realtimeManager.init());