// CSRF Token Management
class CSRFManager {
  constructor() {
    this.token = null;
    this.init();
  }

  async init() {
    await this.fetchToken();
    this.setupInterceptors();
  }

  async fetchToken() {
    try {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        this.token = data.csrfToken;
        this.updateForms();
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }

  updateForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      let csrfInput = form.querySelector('input[name="_csrf"]');
      if (!csrfInput) {
        csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';
        form.appendChild(csrfInput);
      }
      csrfInput.value = this.token;
    });
  }

  setupInterceptors() {
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      if (options.method && options.method !== 'GET' && options.method !== 'HEAD') {
        options.headers = {
          ...options.headers,
          'X-CSRF-Token': this.token
        };
      }
      return originalFetch(url, options);
    };
  }

  getToken() {
    return this.token;
  }
}

// Initialize CSRF manager
const csrfManager = new CSRFManager();
window.csrfManager = csrfManager;