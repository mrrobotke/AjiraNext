/**
 * Maps raw Supabase/auth error messages to user-friendly strings.
 */
export function mapAuthError(error: string): string {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (error.includes("Invalid login credentials")) {
    return "Email or password is incorrect.";
  }

  if (error.includes("Email not confirmed")) {
    return "Please confirm your email before signing in.";
  }

  if (error.includes("User already registered")) {
    return "An account with this email already exists.";
  }

  if (error.includes("Rate limit exceeded")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (error.includes("Network request failed")) {
    return "Network error. Please check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
}
