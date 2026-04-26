/**
 * Deterministic TrackNova tenant admin sign-in name:
 * `firstName` (first name token, letters/digits only, lowercased) + last 4 digits of the mobile (local 10-digit).
 *
 * @param {string} [phoneRaw]
 * @returns {string} digits only
 */
export function normalizePhoneDigits(phoneRaw) {
  return String(phoneRaw ?? "").replace(/\D/g, "");
}

/**
 * @param {string} [phoneRaw]
 * @returns {string} last 4 digits; pads with leading zeros if fewer than 4 digits (edge cases)
 */
export function last4PhoneDigits(phoneRaw) {
  const d = normalizeToLocalTenDigits(phoneRaw);
  if (d.length >= 4) {
    return d.slice(-4);
  }
  return d.padStart(4, "0");
}

/**
 * Strips +91 / spaces / punctuation; keeps the last 10 digits as the local Indian mobile when possible.
 * @param {string} [phoneRaw]
 * @returns {string}
 */
export function normalizeToLocalTenDigits(phoneRaw) {
  let d = normalizePhoneDigits(phoneRaw);
  if (d.length === 12 && d.startsWith("91")) {
    d = d.slice(-10);
  } else if (d.length > 10) {
    d = d.slice(-10);
  }
  return d;
}

/**
 * First whitespace-delimited name token, letters and digits only (no spaces/symbols), lowercased.
 * @param {string} [adminName]
 * @returns {string}
 */
export function firstNameTokenFromAdminName(adminName) {
  const first = String(adminName ?? "").trim().split(/\s+/).filter(Boolean)[0] ?? "";
  const alnum = first.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return alnum.length > 0 ? alnum : "user";
}

/**
 * @param {string} adminName
 * @param {string} adminPhone
 * @returns {string}
 */
export function buildTrackNovaSignInUsername(adminName, adminPhone) {
  const first = firstNameTokenFromAdminName(adminName);
  const last4 = last4PhoneDigits(adminPhone);
  return `${first}${last4}`;
}
