import jwt from "jsonwebtoken";

/**
 * Insecure HTTP (e.g. localhost) cannot set Secure cookies; SameSite=None requires Secure.
 * Production: Secure + SameSite=None for cross-site credentialed API calls (separate subdomains or origins).
 */
function useSecureRefreshCookie() {
  if (process.env.REFRESH_COOKIE_FORCE_INSECURE === "true") return false;
  if (process.env.REFRESH_COOKIE_FORCE_SECURE === "true") return true;
  if (process.env.NODE_ENV === "production") return true;
  return false;
}

/**
 * @param {boolean} secure
 * @returns {"lax" | "strict" | "none"}
 */
function sameSiteFor(secure) {
  const fromEnv = (process.env.REFRESH_COOKIE_SAMESITE || "").toLowerCase();
  if (fromEnv === "lax" || fromEnv === "strict" || fromEnv === "none") {
    if (fromEnv === "none" && !secure) {
      return "lax";
    }
    return fromEnv;
  }
  return secure ? "none" : "lax";
}

/**
 * @param {string} refreshToken
 * @returns {number | undefined} maxAge in ms for Express res.cookie, or undefined if not decodable
 */
function maxAgeMsFromJwt(refreshToken) {
  if (!refreshToken) return undefined;
  const decoded = jwt.decode(refreshToken, { complete: false });
  if (decoded == null || typeof decoded !== "object" || !("exp" in decoded)) {
    return undefined;
  }
  const exp = /** @type {{ exp: number }} */ (decoded).exp;
  if (typeof exp !== "number" || !Number.isFinite(exp)) return undefined;
  return Math.max(0, exp * 1000 - Date.now());
}

/**
 * @param {string} refreshToken
 * @returns {import("cookie").CookieParseOptions & { maxAge?: number; httpOnly: boolean; path: string; secure: boolean; sameSite: "lax" | "strict" | "none" }}
 */
export function getRefreshCookieSetOptions(refreshToken) {
  const secure = useSecureRefreshCookie();
  return {
    httpOnly: true,
    path: process.env.REFRESH_COOKIE_PATH || "/",
    secure,
    sameSite: sameSiteFor(secure),
    maxAge: maxAgeMsFromJwt(refreshToken),
  };
}

/**
 * clearCookie() must use the same path + flags as setCookie, including httpOnly.
 * @param {import("express").Response} res
 */
export function clearRefreshTokenCookie(res) {
  const secure = useSecureRefreshCookie();
  res.clearCookie("refreshToken", {
    path: process.env.REFRESH_COOKIE_PATH || "/",
    httpOnly: true,
    secure,
    sameSite: sameSiteFor(secure),
  });
}

export { useSecureRefreshCookie, sameSiteFor, maxAgeMsFromJwt };
