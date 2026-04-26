import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "./apiResponse/index.js";
import { workspaceSlugify } from "./companyIdentifiers.js";

/** Collation for case-insensitive username storage and index use (matches multikey on users.username). */
export const IDP_USERNAME_COLLATION = { locale: "en", strength: 2 };

/**
 * @param {string} s
 */
function escapeRegexLiteral(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {unknown} s
 * @returns {string}
 */
export function normalizeSignInUsername(s) {
  return String(s ?? "")
    .toLowerCase()
    .trim();
}

/**
 * @param {unknown} s
 * @returns {string}
 */
export function normalizeCompanyCode(s) {
  return String(s ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/**
 * Match {@link workspaceSlugify}: spaces/punctuation become hyphens, same as stored `Company.workspaceSlug`.
 * Empty input returns "" (caller treats as missing).
 *
 * @param {unknown} s
 * @returns {string}
 */
export function normalizeWorkspaceSlug(s) {
  const raw = String(s ?? "").trim();
  if (!raw) return "";
  return workspaceSlugify(raw);
}

/**
 * Match stored `workspaceSlug` when the user omits hyphens (e.g. `testingcompany` vs `testing-company`).
 * @param {import("mongoose").Model} Company
 * @param {string} normalizedSlug
 */
async function findCompanyByCollapsedWorkspaceSlug(Company, normalizedSlug) {
  const collapsed = String(normalizedSlug).replace(/-/g, "");
  if (!collapsed) return null;
  return Company.findOne({
    $expr: {
      $eq: [
        {
          $replaceAll: {
            input: { $ifNull: ["$workspaceSlug", ""] },
            find: "-",
            replacement: "",
          },
        },
        collapsed,
      ],
    },
  });
}

/**
 * Companies created before slug backfill, or a failed $set, may lack `workspaceSlug`.
 * Match login slug to {@link workspaceSlugify}(companyName) and backfill `workspaceSlug` when unique.
 * @param {import("mongoose").Model} Company
 * @param {string} normalizedSlug
 */
export async function findCompanyWhenWorkspaceSlugMissingByName(Company, normalizedSlug) {
  if (!normalizedSlug) return null;
  const candidates = await Company.find({
    $or: [{ workspaceSlug: { $exists: false } }, { workspaceSlug: null }, { workspaceSlug: "" }],
  })
    .select("companyName workspaceSlug companyCode")
    .limit(2000)
    .lean();

  for (const c of candidates) {
    if (workspaceSlugify(c.companyName) !== normalizedSlug) continue;
    const full = await Company.findById(c._id);
    if (!full) continue;
    try {
      await Company.updateOne({ _id: c._id }, { $set: { workspaceSlug: normalizedSlug } });
    } catch {
      // Unique index may block if another row already has this slug — still allow this sign-in.
    }
    return full;
  }
  return null;
}

/**
 * Resolve by workspace slug: exact, then hyphen-collapsed, then name-derived slug for missing DB field.
 * @param {import("mongoose").Model} Company
 * @param {string} normalizedSlug
 */
export async function findCompanyByWorkspaceSlugWithFallbacks(Company, normalizedSlug) {
  if (!normalizedSlug) return null;
  let c = await Company.findOne({ workspaceSlug: normalizedSlug });
  if (c) return c;
  c = await findCompanyByCollapsedWorkspaceSlug(Company, normalizedSlug);
  if (c) return c;
  return findCompanyWhenWorkspaceSlugMissingByName(Company, normalizedSlug);
}

/**
 * Resolve which company a sign-in targets when `companyCode` and/or `workspaceSlug` are sent.
 *
 * @param {import("mongoose").Model} Company
 * @param {{ companyCode?: string, workspaceSlug?: string }} input — normalized (empty strings treated as missing)
 * @returns {Promise<import("mongoose").Document | null>}
 */
export async function resolveCompanyFromTenantSignIn(Company, input) {
  const code = input.companyCode && input.companyCode.length > 0 ? input.companyCode : null;
  const slug = input.workspaceSlug && input.workspaceSlug.length > 0 ? input.workspaceSlug : null;

  if (!code && !slug) {
    return null;
  }

  if (code && slug) {
    const byCode = await Company.findOne({ companyCode: code });
    const bySlug = await findCompanyByWorkspaceSlugWithFallbacks(Company, slug);
    if (byCode && bySlug && !byCode._id.equals(bySlug._id)) {
      throw new ApiErrorResponse(
        StatusCodes.BAD_REQUEST,
        "companyCode and workspaceSlug refer to different workspaces."
      );
    }
    if (byCode || bySlug) {
      return byCode || bySlug;
    }
    return null;
  }
  if (code) {
    return Company.findOne({ companyCode: code });
  }
  return findCompanyByWorkspaceSlugWithFallbacks(Company, slug);
}

/**
 * Resolve an Idp account for a workspace sign-in. Tries, in order:
 * 1) `users.username` with {@link IDP_USERNAME_COLLATION} (case-insensitive)
 * 2) `$elemMatch` + case-insensitive regex (handles legacy / odd storage edge cases)
 * 3) Scan documents for `accountOwner` and match username in app code
 *
 * @param {import("mongoose").Model} Idp_account
 * @param {import("mongoose").Types.ObjectId} accountOwner
 * @param {string} normalizedUsername — from {@link normalizeSignInUsername} (lowercase, trimmed)
 * @returns {Promise<import("mongoose").Document | null>}
 */
/**
 * Find embedded user for sign-in: `users.username`, `users.email` (admin email), or the same value as the Idp top-level
 * `username` field, which in TrackNova is the admin work email.
 * @param {Array<{username?:string, email?:string}>} [users]
 * @param {string} normalizedLogin — lowercased, trimmed
 */
export function findEmbeddedUserBySignInName(users, normalizedLogin) {
  const n = String(normalizedLogin ?? "").toLowerCase().trim();
  if (!n) return undefined;
  for (const u of users || []) {
    const un = String(u?.username ?? "").toLowerCase().trim();
    const em = String(u?.email ?? "").toLowerCase().trim();
    if (un === n || em === n) return u;
  }
  return undefined;
}

export async function findIdpForTenantSignIn(Idp_account, accountOwner, normalizedUsername) {
  const n = String(normalizedUsername ?? "").trim();
  if (!n) return null;

  let doc = await Idp_account
    .findOne({
      accountOwner,
      "users.username": n,
    })
    .collation(IDP_USERNAME_COLLATION);
  if (doc) return doc;

  doc = await Idp_account.findOne({
    accountOwner,
    "users.email": n,
  });
  if (doc) return doc;

  doc = await Idp_account.findOne({
    accountOwner,
    username: n,
  });
  if (doc) return doc;

  const safe = escapeRegexLiteral(n);
  doc = await Idp_account.findOne({
    accountOwner,
    users: { $elemMatch: { username: { $regex: new RegExp(`^${safe}$`, "i") } } },
  });
  if (doc) return doc;

  const candidates = await Idp_account.find({ accountOwner });
  for (const c of candidates) {
    if (findEmbeddedUserBySignInName(c.users, n)) return c;
  }
  return null;
}

/**
 * Legacy sign-in: find Idp documents that contain a user with this login name.
 * Tries collation match first, then case-insensitive regex on embedded users.
 *
 * @param {import("mongoose").Model} Idp_account
 * @param {string} normalizedUsername
 * @returns {Promise<import("mongoose").Document[]>}
 */
export async function findIdpCandidatesByUsername(Idp_account, normalizedUsername) {
  const n = String(normalizedUsername ?? "").trim();
  if (!n) return [];

  const byCollation = await Idp_account
    .find({ "users.username": n })
    .collation(IDP_USERNAME_COLLATION);
  if (byCollation.length) return byCollation;

  const byEmail = await Idp_account.find({ "users.email": n });
  if (byEmail.length) return byEmail;

  const byTop = await Idp_account.find({ username: n });
  if (byTop.length) return byTop;

  const safe = escapeRegexLiteral(n);
  return Idp_account.find({
    users: { $elemMatch: { username: { $regex: new RegExp(`^${safe}$`, "i") } } },
  });
}

/**
 * One IdP row for “forgot password”: same resolution as sign-in (username, user email, or Idp `username` / admin email).
 * @param {import("mongoose").Model} Idp_account
 * @param {import("mongoose").Types.ObjectId|undefined} accountOwner
 * @param {string} normalizedLogin
 */
export async function findIdpBySignInForForgotPassword(Idp_account, accountOwner, normalizedLogin) {
  const n = String(normalizedLogin ?? "").trim();
  if (!n) return null;
  const base = accountOwner ? { accountOwner } : {};
  let doc = await Idp_account
    .findOne({ ...base, "users.username": n })
    .collation(IDP_USERNAME_COLLATION);
  if (doc) return doc;
  doc = await Idp_account.findOne({ ...base, "users.email": n });
  if (doc) return doc;
  doc = await Idp_account.findOne({ ...base, username: n });
  if (doc) return doc;
  const safe = escapeRegexLiteral(n);
  return Idp_account.findOne({
    ...base,
    users: { $elemMatch: { username: { $regex: new RegExp(`^${safe}$`, "i") } } },
  });
}
