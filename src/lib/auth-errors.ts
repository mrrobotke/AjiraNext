/**
 * Maps raw Supabase/auth error strings to safe, user-friendly messages.
 * Used by both server actions and client-side error handlers.
 */
export function mapAuthError(raw: string): string {
  if (!raw) return "Something went wrong. Please try again.";
  const lowered = raw.toLowerCase();
  if (lowered.includes("invalid login credentials"))
    return "Email or password is incorrect.";
  if (lowered.includes("email not confirmed"))
    return "Please confirm your email before signing in.";
  if (lowered.includes("user already registered"))
    return "An account with this email already exists.";
  if (lowered.includes("rate limit"))
    return "Too many attempts. Please wait a moment and try again.";
  if (lowered.includes("network"))
    return "Network error. Please check your connection and try again.";
  return "Something went wrong. Please try again.";
}
