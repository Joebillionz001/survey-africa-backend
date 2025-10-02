// API Client for Survey Africa Backend
class APIClient {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  // Helper method for API requests
  async request(endpoint, options = {}) {
    if (!endpoint.startsWith('/')) {
      throw new Error('Invalid endpoint');
    }
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Surveys
  async getSurveys() {
    return this.request('/surveys');
  }

  async getPublicSurveys() {
    return this.request('/surveys/public');
  }

  async getSurvey(id) {
    return this.request(`/surveys/${id}`);
  }

  async createSurvey(surveyData) {
    return this.request('/surveys', {
      method: 'POST',
      body: JSON.stringify(surveyData)
    });
  }

  async updateSurvey(id, surveyData) {
    return this.request(`/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(surveyData)
    });
  }

  async deleteSurvey(id) {
    return this.request(`/surveys/${id}`, {
      method: 'DELETE'
    });
  }

  // Responses
  async submitResponse(responseData) {
    return this.request('/responses', {
      method: 'POST',
      body: JSON.stringify(responseData)
    });
  }

  async getSurveyResponses(surveyId) {
    return this.request(`/responses/survey/${surveyId}`);
  }

  // Earnings
  async getEarnings() {
    return this.request('/earnings');
  }

  async addEarning(earningData) {
    return this.request('/earnings', {
      method: 'POST',
      body: JSON.stringify(earningData)
    });
  }

  async getCPAOffers() {
    return this.request('/earnings/cpa-offers');
  }

  async getYouTubeTasks() {
    return this.request('/earnings/youtube-tasks');
  }

  // External Surveys
  async getExternalSurveys() {
    return this.request('/external-surveys');
  }

  async getCPXIframe() {
    return this.request('/external-surveys/cpx-iframe');
  }

  // Logout
  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
}

// Create global API instance
const api = new APIClient();