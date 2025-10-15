// Input validation and sanitization utilities
class InputValidator {
  // Sanitize HTML input to prevent XSS
  static sanitizeHTML(input) {
    if (typeof input !== 'string') return input;
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .trim();
  }

  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validate password strength
  static validatePassword(password) {
    if (typeof password !== 'string') return false;
    
    return {
      isValid: password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /\d/.test(password),
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password)
    };
  }

  // Validate phone number
  static validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
  }

  // Sanitize form data
  static sanitizeFormData(formData) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeHTML(value).substring(0, 500); // Limit length
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeFormData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  // Validate required fields
  static validateRequired(data, requiredFields) {
    const errors = [];
    
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`${field} is required`);
      }
    }
    
    return errors;
  }

  // Show validation error
  static showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
      element.style.color = '#ef4444';
    }
  }

  // Clear validation error
  static clearError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
    }
  }

  // Validate file upload
  static validateFile(file, options = {}) {
    const {
      maxSize = 2 * 1024 * 1024, // 2MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
      allowedExtensions = ['.jpg', '.jpeg', '.png']
    } = options;

    if (!file) return { isValid: false, error: 'No file selected' };

    // Check file size
    if (file.size > maxSize) {
      return { isValid: false, error: `File size must be less than ${maxSize / 1024 / 1024}MB` };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type' };
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return { isValid: false, error: 'Invalid file extension' };
    }

    // Check for suspicious filenames
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return { isValid: false, error: 'Invalid filename' };
    }

    return { isValid: true };
  }
}

// Make it globally available
window.InputValidator = InputValidator;