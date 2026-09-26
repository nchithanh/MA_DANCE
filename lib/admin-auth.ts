/** Temporary client-side gate — visible in the static bundle. Not production auth. */
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "ma@2026";
export const ADMIN_SESSION_KEY = "ma-admin-session";

export function isAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export function loginAdmin(user: string, pass: string): boolean {
  if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function logoutAdmin() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
