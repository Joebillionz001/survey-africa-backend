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

      // Track login
      if (typeof tracking !== 'undefined') {
        tracking.trackUserLogin(email);
      }

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

      // Track registration
      if (typeof tracking !== 'undefined') {
        tracking.trackUserRegistration(userData);
      }

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
    return [];
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
    return [];
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
    return [];
  }

  // YouTube Tasks
  getYouTubeTasks() {
    return [];
  }

  // Handle Google OAuth redirect
  async handleOAuthRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');

    if (token && userId) {
      try {
        // Fetch user data using the token and userId
        const user = await api.getCurrentUser(); // This will use the token set by setAuthSession
        if (user) {
          await api.setAuthSession(token, user); // Set session with fetched user data
          this.currentUser = user;
          localStorage.setItem('isLoggedIn', 'true');
          this.updateUI();
          showToast('Logged in successfully via Google!', 'success');
        } else {
          showToast('Failed to retrieve user data after Google login.', 'error');
        }
      } catch (error) {
        console.error('Error handling Google OAuth redirect:', error);
        showToast('Error during Google login.', 'error');
      } finally {
        // Clean up URL parameters to prevent re-processing on refresh
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('token');
        newUrl.searchParams.delete('userId');
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    }
  }

  async getBitLabsSurveys() {
    try {
      // Use centralized API_CONFIG.BASE_URL
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/external-surveys/bitlabs`, {
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
    const responses = this.loadResponses();
    const earnings = this.loadEarnings();
    return {
      totalSurveys: this.surveys.length,
      totalResponses: responses.length,
      totalEarnings: this.currentUser?.totalEarnings || 0,
      activeUsers: this.getUsers().length
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
    // Track logout
    if (typeof tracking !== 'undefined') {
      tracking.trackUserLogout();
    }

    api.logout();
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
  }

  handleGetStartedRedirect() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'signup.html';
    }
  }

  handleLoginRedirect() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'login.html';
    }
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

  setupEventListeners() {
    // Event listeners setup
  }

  loadResponses() {
    return [];
  }

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
