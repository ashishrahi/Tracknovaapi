const isProd = process.env.NODE_ENV === "production";

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  domain: isProd ? ".ashishrahidev.site" : undefined,
  path: "/",
};

/**
 * Keep clearCookie options aligned with set-cookie options so browsers
 * delete the exact same cookie (name + domain + path + flags).
 * @param {import("express").Response} res
 */
export function clearRefreshTokenCookie(res) {
  res.clearCookie("refreshToken", {
    ...refreshCookieOptions,
  });
}
