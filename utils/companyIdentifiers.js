import crypto from "crypto";

/**
 * @param {string} companyName
 * @returns {string}
 */
export function workspaceSlugify(companyName) {
  const s = String(companyName || "company")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return (s || "company").slice(0, 64);
}

/**
 * @param {import("mongoose").Model} Company
 * @param {string} companyName
 * @param {import("mongoose").Types.ObjectId} excludeId
 */
export async function ensureUniqueWorkspaceSlug(Company, companyName, excludeId) {
  const base = workspaceSlugify(companyName);
  for (let i = 0; i < 200; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const taken = await Company.findOne(
      excludeId
        ? { workspaceSlug: candidate, _id: { $ne: excludeId } }
        : { workspaceSlug: candidate }
    );
    if (!taken) {
      return candidate;
    }
  }
  return `${base}-${crypto.randomBytes(4).toString("hex")}`.slice(0, 64);
}

/**
 * @param {import("mongoose").Model} Company
 * @param {string} companyName
 * @param {import("mongoose").Types.ObjectId} excludeId
 */
export async function ensureUniqueCompanyCode(Company, companyName, excludeId) {
  const compact = String(companyName || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const prefix = (compact.slice(0, 4) || "ORG").padEnd(3, "X").slice(0, 4);
  for (let i = 0; i < 200; i++) {
    const suffix = i < 10 ? `0${i}` : i < 200 ? String(i) : "";
    const candidate = (prefix + suffix).replace(/[^A-Z0-9]/g, "").slice(0, 12) || "ORG01";
    const taken = await Company.findOne(
      excludeId
        ? { companyCode: candidate, _id: { $ne: excludeId } }
        : { companyCode: candidate }
    );
    if (!taken) {
      return candidate;
    }
  }
  return (prefix + crypto.randomBytes(2).toString("hex").toUpperCase()).slice(0, 12);
}
