// Survey Africa - Main Application
class SurveyApp {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.surveys = this.loadSurveys();
    this.responses = [];
    this.earnings = this.loadEarnings();
  }

  async init() {
    this.setupEventListeners();
    this.updateUI();
    if (this.currentUser) {
      await this.loadUserData();
    }
  }

  // User Management
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
    return null;
  }

  async login(email, password) {
    try {
      const result = await api.login({ email, password });
      localStorage.setItem('isLoggedIn', 'true');
      this.currentUser = result.user;
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      await this.loadUserData();
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async register(userData) {
    try {
      const result = await api.register(userData);
      localStorage.setItem('isLoggedIn', 'true');
      this.currentUser = result.user;
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      await this.loadUserData();
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  getUsers() {
    try {
      const users = localStorage.getItem('users');
      return users ? JSON.parse(users) : this.getDefaultUsers();
    } catch (error) {
      localStorage.removeItem('users');
      return this.getDefaultUsers();
    }
  }

  getDefaultUsers() {
    return [{
      id: 'user_001',
      name: 'Demo User',
      email: null,
      joinDate: '2024-01-15',
      totalEarnings: 247.50,
      referrals: 8,
      surveysCompleted: 23
    }];
  }

  // Survey Management
  loadSurveys() {
    try {
      const surveys = localStorage.getItem('surveys');
      return surveys ? JSON.parse(surveys) : this.getDefaultSurveys();
    } catch (error) {
      console.error('Error loading surveys:', error);
      return this.getDefaultSurveys();
    }
  }

  getDefaultSurveys() {
    return [
      {
        id: 'survey_001',
        title: 'Customer Satisfaction Survey',
        description: 'Help us improve our services',
        status: 'active',
        responses: 156,
        created: '2024-01-20',
        earnings: 78.00,
        questions: [
          { id: 'q1', type: 'rating', text: 'How satisfied are you with our service?', required: true },
          { id: 'q2', type: 'text', text: 'What can we improve?', required: false }
        ]
      },
      {
        id: 'survey_002',
        title: 'Product Feedback Survey',
        description: 'Share your thoughts on our new product',
        status: 'active',
        responses: 89,
        created: '2024-01-25',
        earnings: 44.50,
        questions: [
          { id: 'q1', type: 'multiple', text: 'Which features do you use most?', options: ['Feature A', 'Feature B', 'Feature C'], required: true }
        ]
      }
    ];
  }

  async createSurvey(surveyData) {
    try {
      const survey = await api.createSurvey(surveyData);
      this.surveys.push(survey);
      return survey;
    } catch (error) {
      console.error('Error creating survey:', error);
      throw error;
    }
  }

  // CPA Offers
  getCPAOffers() {
    return [
      { id: 'cpa_1', title: 'Sign up for Free Trial', description: 'Register for streaming service trial', payout: 2.50, url: 'https://example.com/offer1' },
      { id: 'cpa_2', title: 'Download Mobile Game', description: 'Install and play for 5 minutes', payout: 1.75, url: 'https://example.com/offer2' },
      { id: 'cpa_3', title: 'Complete Survey', description: 'Fill out market research survey', payout: 3.00, url: 'https://example.com/offer3' },
      { id: 'cpa_4', title: 'Subscribe to Newsletter', description: 'Join email list for deals', payout: 0.50, url: 'https://example.com/offer4' }
    ];
  }

  // YouTube Tasks
  getYouTubeTasks() {
    return [
      { id: 'yt_1', title: 'Tech Review Channel', description: 'Watch latest smartphone review', payout: 1.00, duration: '10:30', views: '125K', url: 'https://youtube.com/watch?v=example1' },
      { id: 'yt_2', title: 'Cooking Tutorial', description: 'Learn to make African cuisine', payout: 0.75, duration: '15:45', views: '89K', url: 'https://youtube.com/watch?v=example2' },
      { id: 'yt_3', title: 'Business Tips', description: 'Entrepreneurship advice for Africa', payout: 1.25, duration: '8:20', views: '67K', url: 'https://youtube.com/watch?v=example3' },
      { id: 'yt_4', title: 'Music Video', description: 'Latest Afrobeats hit', payout: 0.50, duration: '4:15', views: '234K', url: 'https://youtube.com/watch?v=example4' }
    ];
  }

  async getBitLabsSurveys() {
    try {
      const response = await fetch('http://localhost:5000/api/external-surveys/bitlabs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      return await response.json();
    } catch (error) {
      console.error('Error loading BitLabs surveys:', error);
      return [];
    }
  }

  // Data persistence
  saveSurveys() {
    localStorage.setItem('surveys', JSON.stringify(this.surveys));
  }

  saveCurrentUser() {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  // Analytics
  getAnalytics() {
    return {
      totalSurveys: this.surveys.length,
      totalResponses: 428,
      totalEarnings: this.currentUser?.totalEarnings || 0,
      activeUsers: 1247
    };
  }

  updateUI() {
    this.updateUserInfo();
    this.updateStats();
  }

  updateUserInfo() {
    if (!this.currentUser) return;
    
    const userNameElements = document.querySelectorAll('#userName, .user-name');
    userNameElements.forEach(el => {
      if (el) el.textContent = `${this.currentUser.name} (@${this.currentUser.username || 'user'})`;
    });
    
    const avatarElements = document.querySelectorAll('#userAvatar, .user-avatar');
    avatarElements.forEach(el => {
      if (el && this.currentUser.avatar) el.src = this.currentUser.avatar;
    });
    
    const statsElements = document.querySelectorAll('#userStats, .user-stats');
    statsElements.forEach(el => {
      if (el) el.textContent = `Earnings: $${this.currentUser.totalEarnings || 0} | Surveys: ${this.currentUser.surveysCompleted || 0}`;
    });
  }

  updateStats() {
    const analytics = this.getAnalytics();
    
    const elements = {
      surveys: document.getElementById('surveys'),
      responses: document.getElementById('responses'),
      earnings: document.getElementById('earnings'),
      activeUsers: document.getElementById('activeUsers')
    };

    if (elements.surveys) elements.surveys.textContent = analytics.totalSurveys;
    if (elements.responses) elements.responses.textContent = analytics.totalResponses;
    if (elements.earnings) elements.earnings.textContent = `$${analytics.totalEarnings.toFixed(2)}`;
    if (elements.activeUsers) elements.activeUsers.textContent = analytics.activeUsers;
  }

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'check' : 'exclamation';
    
    const iconElement = document.createElement('i');
    iconElement.className = `fas fa-${icon}-circle`;
    
    const textNode = document.createTextNode(' ' + message);
    
    toast.appendChild(iconElement);
    toast.appendChild(textNode);
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  logout() {
    api.logout();
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
  }

  async loadUserData() {
    try {
      this.surveys = await api.getSurveys();
      this.earnings = await api.getEarnings();
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async submitResponse(surveyId, answers) {
    try {
      const userId = this.currentUser?.id;
      return await api.submitResponse({ surveyId, answers, userId });
    } catch (error) {
      console.error('Error submitting response:', error);
      throw error;
    }
  }

  async updateEarnings(amount, type, description) {
    const originalEarnings = this.currentUser.totalEarnings;
    try {
      await api.addEarning({ type, amount, description });
      this.currentUser.totalEarnings += amount;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } catch (error) {
      this.currentUser.totalEarnings = originalEarnings;
      console.error('Error updating earnings:', error);
      throw error;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setupEventListeners() {}
  loadResponses() { return []; }
  loadEarnings() { 
    try {
      const earnings = localStorage.getItem('userEarnings');
      return earnings ? JSON.parse(earnings) : [];
    } catch (error) {
      console.error('Error loading earnings:', error);
      return [];
    }
  }
}

// Initialize app
const app = new SurveyApp();

// Global functions
function showToast(message, type) { app.showToast(message, type); }
function logout() { app.logout(); }