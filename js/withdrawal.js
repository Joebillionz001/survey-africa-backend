// Withdrawal API integration
class WithdrawalAPI {
  constructor() {
    this.baseURL = `${API_CONFIG.BASE_URL}/api`;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  }

  async getWithdrawalLimits() {
    return this.request('/withdrawals/limits');
  }

  async initiateWithdrawal(data) {
    return this.request('/withdrawals', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getTransactionHistory(page = 1, limit = 20) {
    return this.request(`/withdrawals/history?page=${page}&limit=${limit}`);
  }

  async getTransaction(id) {
    return this.request(`/withdrawals/${id}`);
  }
}

// Currency utilities
const CurrencyUtils = {
  symbols: {
    USD: '$',
    NGN: '₦',
    GHS: '₵',
    ZAR: 'R',
    KES: 'KSh'
  },

  format(amount, currency) {
    return `${this.symbols[currency] || '$'}${amount.toFixed(2)}`;
  },

  exchangeRates: {
    USD: 1,
    NGN: 750,
    GHS: 12,
    ZAR: 18,
    KES: 130
  },

  convert(amount, fromCurrency, toCurrency) {
    const usdAmount = amount / this.exchangeRates[fromCurrency];
    return usdAmount * this.exchangeRates[toCurrency];
  }
};

// Export for use in other files
window.WithdrawalAPI = WithdrawalAPI;
window.CurrencyUtils = CurrencyUtils;