// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Phone number validation (basic)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// XSS prevention
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// CSRF token validation
export const validateCSRFToken = (token: string): boolean => {
  // In a real application, you would validate against the server
  return Boolean(token && token.length > 0);
};

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) { }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Form validation utilities
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validatePattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

// File validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Date validation
export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isFutureDate = (date: string): boolean => {
  const d = new Date(date);
  const now = new Date();
  return d > now;
};

// Number validation
export const isValidNumber = (value: any): boolean => {
  return !isNaN(value) && isFinite(value);
};

export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Social security number validation (US)
export const validateSSN = (ssn: string): boolean => {
  const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
  return ssnRegex.test(ssn);
};

// ZIP code validation (US)
export const validateZIPCode = (zip: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

// Generic form validation
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    if (rule.required && !validateRequired(value)) {
      errors.push(rule.message || 'This field is required');
      continue;
    }

    if (value && typeof value === 'string') {
      if (rule.minLength && !validateMinLength(value, rule.minLength)) {
        errors.push(rule.message || `Minimum length is ${rule.minLength} characters`);
      }

      if (rule.maxLength && !validateMaxLength(value, rule.maxLength)) {
        errors.push(rule.message || `Maximum length is ${rule.maxLength} characters`);
      }

      if (rule.pattern && !validatePattern(value, rule.pattern)) {
        errors.push(rule.message || 'Invalid format');
      }
    }

    if (rule.custom && !rule.custom(value)) {
      errors.push(rule.message || 'Invalid value');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Profile-specific validation functions
export interface ProfileValidationRules {
  personalInfo: {
    name: { required: boolean; minLength: number; maxLength: number };
    email: { required: boolean; format: RegExp };
    phone: { required: boolean; format: RegExp };
    country: { required: boolean; minLength: number };
    goal: { maxLength: number };
  };
  careerProfile: {
    industry: { required: boolean; minLength: number };
    jobTitle: { required: boolean; minLength: number };
    profileSummary: { required: boolean; minLength: number; maxLength: number };
  };
  education: {
    degree: { required: boolean; minLength: number };
    school: { required: boolean; minLength: number };
    startDate: { required: boolean };
    endDate: { required: boolean };
    description: { maxLength: number };
  };
  experience: {
    jobTitle: { required: boolean; minLength: number };
    companyName: { required: boolean; minLength: number };
    location: { required: boolean; minLength: number };
    startDate: { required: boolean };
    endDate: { required: boolean };
    description: { required: boolean; minLength: number };
  };
  project: {
    projectTitle: { required: boolean; minLength: number };
    startDate: { required: boolean };
    endDate: { required: boolean };
    projectLink: { format: RegExp };
    description: { required: boolean; minLength: number };
  };
}

// Profile validation rules
export const profileValidationRules: ProfileValidationRules = {
  personalInfo: {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: true, format: /^[\+]?[1-9][\d]{0,15}$/ },
    country: { required: true, minLength: 2 },
    goal: { maxLength: 1000 }
  },
  careerProfile: {
    industry: { required: true, minLength: 2 },
    jobTitle: { required: true, minLength: 2 },
    profileSummary: { required: true, minLength: 10, maxLength: 2000 }
  },
  education: {
    degree: { required: true, minLength: 2 },
    school: { required: true, minLength: 2 },
    startDate: { required: true },
    endDate: { required: true },
    description: { maxLength: 1000 }
  },
  experience: {
    jobTitle: { required: true, minLength: 2 },
    companyName: { required: true, minLength: 2 },
    location: { required: true, minLength: 2 },
    startDate: { required: true },
    endDate: { required: true },
    description: { required: true, minLength: 10 }
  },
  project: {
    projectTitle: { required: true, minLength: 2 },
    startDate: { required: true },
    endDate: { required: true },
    projectLink: { format: /^https?:\/\/.+/ },
    description: { required: true, minLength: 10 }
  }
};

// Personal Info validation
export const validatePersonalInfo = (data: {
  name: string;
  email: string;
  phone: string;
  country: string;
  goal: string;
}): ValidationResult => {
  const errors: string[] = [];
  const rules = profileValidationRules.personalInfo;

  // Name validation
  if (rules.name.required && !data.name.trim()) {
    errors.push('Name is required');
  } else if (data.name.trim() && data.name.length < rules.name.minLength) {
    errors.push(`Name must be at least ${rules.name.minLength} characters`);
  } else if (data.name.length > rules.name.maxLength) {
    errors.push(`Name must be less than ${rules.name.maxLength} characters`);
  }

  // Email validation
  if (rules.email.required && !data.email.trim()) {
    errors.push('Email is required');
  } else if (data.email.trim() && !rules.email.format.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

  // Phone validation
  if (rules.phone.required && !data.phone.trim()) {
    errors.push('Phone number is required');
  } else if (data.phone.trim()) {
    const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
    if (!rules.phone.format.test(cleanPhone)) {
      errors.push('Please enter a valid phone number');
    }
  }

  // Country validation
  if (rules.country.required && !data.country.trim()) {
    errors.push('Country is required');
  } else if (data.country.trim() && data.country.length < rules.country.minLength) {
    errors.push(`Country must be at least ${rules.country.minLength} characters`);
  }

  // Goal validation
  if (data.goal && data.goal.length > rules.goal.maxLength) {
    errors.push(`Goal must be less than ${rules.goal.maxLength} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Career Profile validation
export const validateCareerProfile = (data: {
  industry: string;
  jobTitle: string;
  profileSummary: string;
}): ValidationResult => {
  const errors: string[] = [];
  const rules = profileValidationRules.careerProfile;

  // Industry validation
  if (rules.industry.required && !data.industry.trim()) {
    errors.push('Industry is required');
  } else if (data.industry.trim() && data.industry.length < rules.industry.minLength) {
    errors.push(`Industry must be at least ${rules.industry.minLength} characters`);
  }

  // Job Title validation
  if (rules.jobTitle.required && !data.jobTitle.trim()) {
    errors.push('Job title is required');
  } else if (data.jobTitle.trim() && data.jobTitle.length < rules.jobTitle.minLength) {
    errors.push(`Job title must be at least ${rules.jobTitle.minLength} characters`);
  }

  // Profile Summary validation
  if (rules.profileSummary.required && !data.profileSummary.trim()) {
    errors.push('Profile summary is required');
  } else if (data.profileSummary.trim()) {
    if (data.profileSummary.length < rules.profileSummary.minLength) {
      errors.push(`Profile summary must be at least ${rules.profileSummary.minLength} characters`);
    } else if (data.profileSummary.length > rules.profileSummary.maxLength) {
      errors.push(`Profile summary must be less than ${rules.profileSummary.maxLength} characters`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Education validation
export const validateEducation = (data: {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  isStudying: boolean;
  description: string;
}): ValidationResult => {
  const errors: string[] = [];
  const rules = profileValidationRules.education;

  // Degree validation
  if (rules.degree.required && !data.degree.trim()) {
    errors.push('Degree is required');
  } else if (data.degree.trim() && data.degree.length < rules.degree.minLength) {
    errors.push(`Degree must be at least ${rules.degree.minLength} characters`);
  }

  // School validation
  if (rules.school.required && !data.school.trim()) {
    errors.push('School is required');
  } else if (data.school.trim() && data.school.length < rules.school.minLength) {
    errors.push(`School must be at least ${rules.school.minLength} characters`);
  }

  // Start Date validation
  if (rules.startDate.required && !data.startDate) {
    errors.push('Start date is required');
  } else if (data.startDate && !isValidDate(data.startDate)) {
    errors.push('Please enter a valid start date');
  }

  // End Date validation (only if not currently studying)
  if (!data.isStudying) {
    if (rules.endDate.required && !data.endDate) {
      errors.push('End date is required');
    } else if (data.endDate && !isValidDate(data.endDate)) {
      errors.push('Please enter a valid end date');
    } else if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
      errors.push('End date must be after start date');
    }
  }

  // Description validation
  if (data.description && data.description.length > rules.description.maxLength) {
    errors.push(`Description must be less than ${rules.description.maxLength} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Experience validation
export const validateExperience = (data: {
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  description: string;
}): ValidationResult => {
  const errors: string[] = [];
  const rules = profileValidationRules.experience;

  // Job Title validation
  if (rules.jobTitle.required && !data.jobTitle.trim()) {
    errors.push('Job title is required');
  } else if (data.jobTitle.trim() && data.jobTitle.length < rules.jobTitle.minLength) {
    errors.push(`Job title must be at least ${rules.jobTitle.minLength} characters`);
  }

  // Company Name validation
  if (rules.companyName.required && !data.companyName.trim()) {
    errors.push('Company name is required');
  } else if (data.companyName.trim() && data.companyName.length < rules.companyName.minLength) {
    errors.push(`Company name must be at least ${rules.companyName.minLength} characters`);
  }

  // Location validation
  if (rules.location.required && !data.location.trim()) {
    errors.push('Location is required');
  } else if (data.location.trim() && data.location.length < rules.location.minLength) {
    errors.push(`Location must be at least ${rules.location.minLength} characters`);
  }

  // Start Date validation
  if (rules.startDate.required && !data.startDate) {
    errors.push('Start date is required');
  } else if (data.startDate && !isValidDate(data.startDate)) {
    errors.push('Please enter a valid start date');
  }

  // End Date validation (only if not currently working)
  if (!data.isCurrentlyWorking) {
    if (rules.endDate.required && !data.endDate) {
      errors.push('End date is required');
    } else if (data.endDate && !isValidDate(data.endDate)) {
      errors.push('Please enter a valid end date');
    } else if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
      errors.push('End date must be after start date');
    }
  }

  // Description validation
  if (rules.description.required && !data.description.trim()) {
    errors.push('Description is required');
  } else if (data.description.trim() && data.description.length < rules.description.minLength) {
    errors.push(`Description must be at least ${rules.description.minLength} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Project validation
export const validateProject = (data: {
  projectTitle: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  projectLink: string;
  description: string;
}): ValidationResult => {
  const errors: string[] = [];
  const rules = profileValidationRules.project;

  // Project Title validation
  if (rules.projectTitle.required && !data.projectTitle.trim()) {
    errors.push('Project title is required');
  } else if (data.projectTitle.trim() && data.projectTitle.length < rules.projectTitle.minLength) {
    errors.push(`Project title must be at least ${rules.projectTitle.minLength} characters`);
  }

  // Start Date validation
  if (rules.startDate.required && !data.startDate) {
    errors.push('Start date is required');
  } else if (data.startDate && !isValidDate(data.startDate)) {
    errors.push('Please enter a valid start date');
  }

  // End Date validation (only if not currently working)
  if (!data.isCurrentlyWorking) {
    if (rules.endDate.required && !data.endDate) {
      errors.push('End date is required');
    } else if (data.endDate && !isValidDate(data.endDate)) {
      errors.push('Please enter a valid end date');
    } else if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
      errors.push('End date must be after start date');
    }
  }

  // Project Link validation
  if (data.projectLink && !rules.projectLink.format.test(data.projectLink)) {
    errors.push('Please enter a valid project URL (must start with http:// or https://)');
  }

  // Description validation
  if (rules.description.required && !data.description.trim()) {
    errors.push('Description is required');
  } else if (data.description.trim() && data.description.length < rules.description.minLength) {
    errors.push(`Description must be at least ${rules.description.minLength} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export all validation functions
export default {
  sanitizeInput,
  isValidEmail,
  validatePassword,
  isValidUrl,
  isValidPhoneNumber,
  escapeHtml,
  validateCSRFToken,
  RateLimiter,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateFileType,
  validateFileSize,
  isValidDate,
  isFutureDate,
  isValidNumber,
  validateRange,
  validateCreditCard,
  validateSSN,
  validateZIPCode,
  validateField,
  // Profile-specific validations
  validatePersonalInfo,
  validateCareerProfile,
  validateEducation,
  validateExperience,
  validateProject,
  profileValidationRules
};
