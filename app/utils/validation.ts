import { VALIDATION } from './constants';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < VALIDATION.password.minLength) {
    errors.push(`Password must be at least ${VALIDATION.password.minLength} characters`);
  }

  if (VALIDATION.password.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (VALIDATION.password.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): boolean => {
  return (
    username.length >= VALIDATION.username.minLength &&
    username.length <= VALIDATION.username.maxLength &&
    VALIDATION.username.pattern.test(username)
  );
};

export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, ''); // Basic XSS prevention
};

export const validateIdeaTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= VALIDATION.idea.titleMaxLength;
};

export const validateIdeaDescription = (description: string): boolean => {
  return description.trim().length > 0 && description.length <= VALIDATION.idea.descriptionMaxLength;
};

export const validateComment = (comment: string): boolean => {
  return comment.trim().length > 0 && comment.length <= VALIDATION.comment.maxLength;
};

export const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};
