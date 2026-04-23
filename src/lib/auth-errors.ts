/**
 * Discriminated error-code contract shared between server actions and
 * client-side error handlers. The server emits `{ code: AuthErrorCode }`;
 * the client renders the message via `authErrorMessage(code)`.
 */
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_NOT_CONFIRMED: "EMAIL_NOT_CONFIRMED",
  EMAIL_ALREADY_REGISTERED: "EMAIL_ALREADY_REGISTERED",
  RATE_LIMITED: "RATE_LIMITED",
  OAUTH_FAILED: "OAUTH_FAILED",
  OAUTH_DENIED: "OAUTH_DENIED",
  ONBOARDING_CONFLICT: "ONBOARDING_CONFLICT",
  INVALID_INPUT: "INVALID_INPUT",
  INVALID_ROLE: "INVALID_ROLE",
  NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
  SESSION_ERROR: "SESSION_ERROR",
  SESSION_REFRESH_FAILED: "SESSION_REFRESH_FAILED",
  SYNC_FAILED: "SYNC_FAILED",
  REQUEST_FAILED: "REQUEST_FAILED",
  ACCESS_DENIED: "ACCESS_DENIED",
  NETWORK: "NETWORK",
  UNKNOWN: "UNKNOWN",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export interface AuthActionError {
  code: AuthErrorCode;
  /** Optional developer-facing hint; never rendered to end users. */
  hint?: string;
}

/**
 * Returns the user-facing message for an auth error code.
 * All branches must return non-empty strings; the default arm reuses the
 * `UNKNOWN` copy to guarantee defense against code drift.
 */
export function authErrorMessage(code: AuthErrorCode): string {
  switch (code) {
    case AUTH_ERROR_CODES.INVALID_CREDENTIALS:
      return "Incorrect email or password.";
    case AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED:
      return "Please confirm your email before signing in.";
    case AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED:
      return "An account with this email already exists.";
    case AUTH_ERROR_CODES.RATE_LIMITED:
      return "Too many attempts. Please wait a moment and try again.";
    case AUTH_ERROR_CODES.OAUTH_FAILED:
      return "Google sign-in didn't complete. Please try again.";
    case AUTH_ERROR_CODES.OAUTH_DENIED:
      return "Google sign-in was cancelled. Please try again.";
    case AUTH_ERROR_CODES.ONBOARDING_CONFLICT:
      return "Your account already has a role. Redirecting…";
    case AUTH_ERROR_CODES.INVALID_INPUT:
      return "Please check your input and try again.";
    case AUTH_ERROR_CODES.INVALID_ROLE:
      return "That role isn't available. Please pick another.";
    case AUTH_ERROR_CODES.NOT_AUTHENTICATED:
      return "Please sign in to continue.";
    case AUTH_ERROR_CODES.SESSION_ERROR:
      return "Your session couldn't be verified. Please sign in again.";
    case AUTH_ERROR_CODES.SESSION_REFRESH_FAILED:
      return "We couldn't refresh your session. Please sign in again.";
    case AUTH_ERROR_CODES.SYNC_FAILED:
      return "Something went wrong syncing your account. Please try again.";
    case AUTH_ERROR_CODES.REQUEST_FAILED:
      return "The request didn't complete. Please try again.";
    case AUTH_ERROR_CODES.ACCESS_DENIED:
      return "You don't have access to that page.";
    case AUTH_ERROR_CODES.NETWORK:
      return "Network error. Check your connection and retry.";
    case AUTH_ERROR_CODES.UNKNOWN:
    default:
      return "Something went wrong. Please try again.";
  }
}
