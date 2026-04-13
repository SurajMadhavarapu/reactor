// In-memory rate limiter for authentication endpoints
// Tracks failed attempts per email/identifier over a 15-minute window

interface AttemptTracker {
  [key: string]: number[];
}

// Global in-memory store for rate limiting
const attemptMap: AttemptTracker = {};

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_AUTH_ATTEMPTS = 5;
const MAX_GENERAL_ATTEMPTS = 30;

function cleanOldAttempts(key: string, windowMs: number): number[] {
  const now = Date.now();
  const attempts = attemptMap[key] || [];
  
  // Filter out attempts older than the window
  const recentAttempts = attempts.filter((time) => now - time < windowMs);
  
  if (recentAttempts.length === 0) {
    delete attemptMap[key];
  } else {
    attemptMap[key] = recentAttempts;
  }
  
  return recentAttempts;
}

export async function checkAuthRateLimit(identifier: string): Promise<boolean> {
  const key = `auth:${identifier}`;
  const recentAttempts = cleanOldAttempts(key, RATE_LIMIT_WINDOW);
  
  if (recentAttempts.length >= MAX_AUTH_ATTEMPTS) {
    return false;
  }
  
  recentAttempts.push(Date.now());
  attemptMap[key] = recentAttempts;
  return true;
}

export async function checkGeneralRateLimit(identifier: string): Promise<boolean> {
  const key = `general:${identifier}`;
  const recentAttempts = cleanOldAttempts(key, 60 * 1000); // 1 minute window for general
  
  if (recentAttempts.length >= MAX_GENERAL_ATTEMPTS) {
    return false;
  }
  
  recentAttempts.push(Date.now());
  attemptMap[key] = recentAttempts;
  return true;
}

export function getRemainingTime(identifier: string): number {
  const key = `auth:${identifier}`;
  const attempts = attemptMap[key] || [];
  const now = Date.now();
  
  const recentAttempts = attempts.filter((time) => now - time < RATE_LIMIT_WINDOW);
  
  if (recentAttempts.length === 0) return 0;
  
  const oldestAttempt = Math.min(...recentAttempts);
  const remainingMs = RATE_LIMIT_WINDOW - (now - oldestAttempt);
  return Math.ceil(remainingMs / 1000); // Return in seconds
}

export function resetRateLimit(identifier: string): void {
  delete attemptMap[`auth:${identifier}`];
  delete attemptMap[`general:${identifier}`];
}
