// Iron Man Theme Colors
export const THEME = {
  colors: {
    gold: '#FFD700',
    deepRed: '#A91C0A',
    darkSteel: '#2C3E50',
    brightOrange: '#FF4500',
    white: '#FFFFFF',
    darkBg: '#0F1419',
    cardBg: '#1A1F2E',
    borderColor: '#FFD700',
    success: '#28A745',
    error: '#DC3545',
    warning: '#FFC107',
  },
  transitions: {
    smooth: '0.3s ease-in-out',
    fast: '0.15s ease-in-out',
    slow: '0.6s ease-in-out',
  },
  shadows: {
    glow: '0 0 20px rgba(255, 215, 0, 0.3)',
    heavyGlow: '0 0 40px rgba(255, 215, 0, 0.5)',
    card: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
};

// Validation Rules
export const VALIDATION = {
  password: {
    minLength: 8,
    requireNumbers: true,
    requireSpecialChars: true,
    requireUpperCase: false,
  },
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
  idea: {
    titleMaxLength: 100,
    descriptionMaxLength: 5000,
    categoryMaxLength: 50,
  },
  comment: {
    maxLength: 500,
  },
};

// Rate Limiting
export const RATE_LIMITS = {
  loginAttempts: 5,
  loginLockoutMinutes: 15,
  emailVerificationResends: 3,
  ideaCreationPerMinute: 1,
};

// Progress Stages
export const PROGRESS_STAGES = ['concept', 'validation', 'mvp', 'beta', 'live'] as const;

// Error Messages
export const ERROR_MESSAGES = {
  auth: {
    invalidEmail: 'Invalid email address',
    weakPassword: 'Password must be 8+ characters with numbers and special characters',
    emailExists: 'Email already registered',
    invalidCredentials: 'Invalid email or password',
    accountLocked: 'Account locked. Try again in 15 minutes',
    twoFARequired: '2FA code required',
    invalidTwoFACode: 'Invalid 2FA code',
    sessionExpired: 'Your session has expired. Please login again',
    emailNotVerified: 'Please verify your email before logging in',
  },
  collaboration: {
    notAuthorized: "You don't have permission to perform this action",
    ownerRemovalNotAllowed: 'You cannot remove yourself as owner. Transfer ownership first.',
    duplicateInvite: 'User is already a collaborator on this idea',
    inviteExpired: 'This invite link has expired',
  },
  idea: {
    notFound: 'Idea not found',
    ownershipRequired: 'Only the idea owner can edit this',
    deleteConfirm: 'Are you sure you want to delete this idea? This action cannot be undone.',
  },
  network: {
    offline: 'You are offline. Changes will sync when you reconnect.',
    timeout: 'Request timeout. Please try again.',
    error: 'Something went wrong. Please try again.',
  },
};
