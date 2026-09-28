import { loginAdminApi, logoutAdminApi } from "./ma-admin-api";

/** Session token from Worker POST /api/login — not the CF secret. */
export const ADMIN_SESSION_KEY = "ma-admin-session";
export const ADMIN_TOKEN_KEY = "ma-admin-token";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function isAdminSession(): boolean {
  return Boolean(getAdminToken());
}

export function setAdminSession(token: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
}

export async function loginAdmin(user: string, pass: string): Promise<boolean> {
  try {
    const token = await loginAdminApi(user, pass);
    setAdminSession(token);
    return true;
  } catch {
    return false;
  }
}

export function logoutAdmin() {
  if (typeof window === "undefined") return;
  const token = getAdminToken();
  if (token) {
    void logoutAdminApi(token).catch(() => {});
  }
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
