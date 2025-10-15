class FraudDetection {
  constructor() {
    this.suspiciousPatterns = [];
    this.userBehavior = {};
  }

  // Track user behavior
  trackBehavior(action, data) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    if (!this.userBehavior[userId]) {
      this.userBehavior[userId] = {
        actions: [],
        timestamps: [],
        patterns: {}
      };
    }

    const behavior = this.userBehavior[userId];
    behavior.actions.push(action);
    behavior.timestamps.push(Date.now());
    
    // Keep only last 100 actions
    if (behavior.actions.length > 100) {
      behavior.actions.shift();
      behavior.timestamps.shift();
    }

    this.analyzePattern(userId, action, data);
  }

  // Analyze patterns for fraud
  analyzePattern(userId, action, data) {
    const behavior = this.userBehavior[userId];
    const recentActions = behavior.actions.slice(-10);
    const recentTimestamps = behavior.timestamps.slice(-10);

    // Check for rapid-fire submissions
    if (action === 'survey_submit') {
      const rapidSubmissions = recentTimestamps.filter(
        (timestamp, index) => index > 0 && timestamp - recentTimestamps[index - 1] < 30000
      ).length;

      if (rapidSubmissions > 3) {
        this.flagSuspicious(userId, 'rapid_submissions', { count: rapidSubmissions });
      }
    }

    // Check for identical responses
    if (action === 'survey_response' && data.responses) {
      const identicalResponses = data.responses.filter(r => r === data.responses[0]).length;
      if (identicalResponses === data.responses.length && data.responses.length > 5) {
        this.flagSuspicious(userId, 'identical_responses', { surveyId: data.surveyId });
      }
    }

    // Check for bot-like behavior
    const actionVariety = new Set(recentActions).size;
    if (recentActions.length >= 10 && actionVariety < 3) {
      this.flagSuspicious(userId, 'low_action_variety', { variety: actionVariety });
    }
  }

  // Flag suspicious activity
  flagSuspicious(userId, type, data) {
    const flag = {
      userId,
      type,
      data,
      timestamp: Date.now(),
      severity: this.getSeverity(type)
    };

    this.suspiciousPatterns.push(flag);
    
    // Report to server if high severity
    if (flag.severity >= 7) {
      this.reportToServer(flag);
    }
  }

  // Get severity score
  getSeverity(type) {
    const severityMap = {
      'rapid_submissions': 8,
      'identical_responses': 9,
      'low_action_variety': 6,
      'unusual_timing': 5
    };
    return severityMap[type] || 5;
  }

  // Report to server
  async reportToServer(flag) {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/security/fraud-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(flag)
      });
    } catch (error) {
      console.error('Failed to report fraud:', error);
    }
  }

  // Validate survey response
  validateSurveyResponse(responses, timeSpent) {
    const avgTimePerQuestion = timeSpent / responses.length;
    
    // Flag if too fast (less than 2 seconds per question)
    if (avgTimePerQuestion < 2000) {
      this.trackBehavior('survey_response', {
        responses,
        timeSpent,
        flag: 'too_fast'
      });
      return false;
    }

    // Check for patterns in responses
    const responsePattern = responses.join('');
    if (/^(.)\1{4,}/.test(responsePattern)) {
      this.trackBehavior('survey_response', {
        responses,
        flag: 'pattern_detected'
      });
      return false;
    }

    return true;
  }

  // Get user risk score
  getUserRiskScore(userId) {
    const userFlags = this.suspiciousPatterns.filter(flag => flag.userId === userId);
    const recentFlags = userFlags.filter(flag => Date.now() - flag.timestamp < 24 * 60 * 60 * 1000);
    
    return recentFlags.reduce((score, flag) => score + flag.severity, 0);
  }
}

// Initialize fraud detection
const fraudDetection = new FraudDetection();

// Track page views
document.addEventListener('DOMContentLoaded', () => {
  fraudDetection.trackBehavior('page_view', { url: window.location.pathname });
});

// Track form submissions
document.addEventListener('submit', (e) => {
  if (e.target.id === 'survey-form') {
    fraudDetection.trackBehavior('survey_submit', { formId: e.target.id });
  }
});

// Export for use in other scripts
window.fraudDetection = fraudDetection;