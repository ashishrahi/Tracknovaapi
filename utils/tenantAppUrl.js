/**
 * Build canonical tenant web URL after signup (subdomain workspace).
 *
 * @param {string | undefined | null} workspaceSlug
 * @returns {string | null}
 */
export function buildSignupRedirectUrl(workspaceSlug) {
  const slug = typeof workspaceSlug === "string" ? workspaceSlug.trim() : "";
  const host = typeof process.env.TENANT_BASE_HOST === "string" ? process.env.TENANT_BASE_HOST.trim() : "";
  if (!slug || !host) return null;

  let proto =
    typeof process.env.TENANT_APP_PROTOCOL === "string"
      ? process.env.TENANT_APP_PROTOCOL.trim().toLowerCase()
      : "";
  proto = proto.replace(/^([^:]+):\/\/.*$/, "$1").replace(/:+$/, "");
  if (proto !== "http" && proto !== "https") {
    proto = process.env.NODE_ENV === "production" ? "https" : "http";
  }
  return `${proto}://${slug}.${host}`;
}
