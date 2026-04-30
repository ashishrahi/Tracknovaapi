import { StatusCodes } from "http-status-codes";
import { getCentralDBModels } from "../db/index.js";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";
import {
  findCompanyByWorkspaceSlugWithFallbacks,
  normalizeWorkspaceSlug,
} from "../utils/tenantLogin.js";

/** @type {readonly string[]} */
export const PUBLIC_ROUTES = [
  "/api/v2/company/register",
  "/api/v2/company/status",
  "/api/v2/public",
  "/api/v2/auth",
  "/api/auth",
];

const RESERVED_HOSTS = new Set([
  "ashishrahidev.site",
  "www.ashishrahidev.site",
  "api-v1.ashishrahidev.site",
]);

/**
 * Keep public/auth endpoints reachable even when host does not map to a tenant.
 * Tenant-specific APIs should still require a resolvable tenant.
 *
 * @param {import("express").Request} req
 * @returns {boolean}
 */
function isProtectedTenantRoute(req) {
  const raw = String(req.originalUrl || req.url || "").toLowerCase();

  if (!raw) return false;
  if (req.method === "OPTIONS") return false;

  /** Strip query/hash so `/api/v2/company/register?ref=1` stays public */
  let path = raw;
  const qi = path.indexOf("?");
  if (qi !== -1) path = path.slice(0, qi);
  const hi = path.indexOf("#");
  if (hi !== -1) path = path.slice(0, hi);

  const isPublic = PUBLIC_ROUTES.some((route) => path.startsWith(route));

  return !isPublic;
}

/**
 * @param {string | string[] | undefined} raw
 * @returns {string}
 */
function normalizeXTenantHeader(raw) {
  if (typeof raw === "string") return raw.trim();
  if (Array.isArray(raw) && raw.length) return normalizeXTenantHeader(raw[0]);
  return "";
}

/**
 * @param {import("mongoose").Model} Company
 * @param {string} normalizedHeader
 */
async function lookupCompanyFromXTenantHeader(Company, normalizedHeader) {
  if (!normalizedHeader) return null;
  /** MongoDB ObjectId (24 hex) — distinguish from alphanumeric workspace slugs */
  if (/^[a-fA-F0-9]{24}$/.test(normalizedHeader)) {
    const byId = await Company.findById(normalizedHeader);
    if (byId) return byId;
  }
  const slug = normalizeWorkspaceSlug(normalizedHeader);
  if (!slug) return null;
  return findCompanyByWorkspaceSlugWithFallbacks(Company, slug);
}

/**
 * Parses `Host` / `host` header: strips port, lowercases ASCII host.
 * Supports bracketed IPv6 (`[2001:db8::1]:443` → `[2001:db8::1]`).
 *
 * @param {string | undefined} raw
 * @returns {string | null} hostname only, lowercase, or null if missing/invalid
 */
export function parseHostnameFromHostHeader(raw) {
  if (raw == null) return null;
  const s = String(raw).trim().toLowerCase();
  if (!s) return null;

  let hostOnly = s;
  if (hostOnly.startsWith("[")) {
    const closing = hostOnly.indexOf("]");
    if (closing === -1) return null;
    const bracketed = hostOnly.slice(0, closing + 1);
    const rest = hostOnly.slice(closing + 1);
    if (rest.startsWith(":")) hostOnly = bracketed.slice(1, -1);
    else if (rest === "") hostOnly = bracketed.slice(1, -1);
    else return null;
  } else {
    const colon = hostOnly.lastIndexOf(":");
    if (colon !== -1) {
      const possiblePort = hostOnly.slice(colon + 1);
      if (/^\d+$/.test(possiblePort)) hostOnly = hostOnly.slice(0, colon);
    }
  }

  const normalized = hostOnly.toLowerCase();
  if (!normalized || /[\s#/]/.test(normalized)) return null;

  /** Hostnames: labels separated by `.`, alphanumeric + hyphen per label */
  const hostPattern =
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/;
  if (normalized !== "localhost" && !hostPattern.test(normalized)) return null;

  return normalized;
}

/**
 * Tenant workspace lives on `{slug}.{base}` (e.g. acme.saas.example.com).
 * Set `TENANT_BASE_HOST` to the apex app host (no port), e.g. `saas.example.com`.
 *
 * @param {string} hostname
 * @param {string | undefined} baseHostFromEnv
 * @returns {string | null} normalized workspace slug derived from subdomain, or null
 */
export function subdomainWorkspaceSlug(hostname, baseHostFromEnv) {
  const base = String(baseHostFromEnv ?? "").trim().toLowerCase();
  if (!base) return null;

  const h = hostname.toLowerCase();
  const b = base;
  const suffix = `.${b}`;
  if (h === b || h === `www.${b}` || !h.endsWith(suffix)) return null;

  const left = h.slice(0, -suffix.length);
  if (!left || left.includes(".")) return null;

  const slug = normalizeWorkspaceSlug(left);
  return slug || null;
}

/**
 * Ordered resolution for tests / reuse:
 * 1) `x-tenant-id` (company id or workspace slug)
 * 2) verified custom hostname
 * 3) `{slug}.{TENANT_BASE_HOST}` subdomain
 *
 * Reserved apex hosts skip host-derived tenant (SPA/API gateways still send `x-tenant-id`).
 *
 * @param {import("mongoose").Model} Company
 * @param {{
 *   xTenantRaw: string,
 *   hostname: string | null,
 *   tenantBaseHost: string | undefined,
 * }} input
 */
export async function resolveTenantCompanyForRequest(Company, input) {
  const ht = normalizeXTenantHeader(input.xTenantRaw);
  if (ht) {
    const viaHeader = await lookupCompanyFromXTenantHeader(Company, ht);
    if (viaHeader) return viaHeader;
  }

  const hostname = input.hostname;
  if (!hostname) return null;

  const isReserved = RESERVED_HOSTS.has(hostname);
  if (isReserved) return null;

  let company = await Company.findOne({
    customDomains: {
      $elemMatch: { domain: hostname, verified: true },
    },
  });

  if (!company) {
    const slug = subdomainWorkspaceSlug(hostname, input.tenantBaseHost);
    if (slug) {
      company = await findCompanyByWorkspaceSlugWithFallbacks(Company, slug);
    }
  }

  return company;
}

/**
 * Resolve tenant from `x-tenant-id`, then Host (custom domain, then subdomain).
 * Sets `req.company` / `req.tenant` or responds 404 / 503.
 *
 * @type {import("express").RequestHandler}
 */
async function tenantResolver(req, res, next) {
  try {
    req.tenant = null;
    req.company = null;

    const rawHost = req.headers.host ?? req.headers.Host;
    const hostname = parseHostnameFromHostHeader(
      typeof rawHost === "string" ? rawHost : Array.isArray(rawHost) ? rawHost[0] : ""
    );

    if (!hostname) {
      if (isProtectedTenantRoute(req)) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(new ApiErrorResponse(StatusCodes.NOT_FOUND, "Tenant not found"));
      }
      return next();
    }

    const { Company } = await getCentralDBModels();
    if (!Company) {
      return res
        .status(StatusCodes.SERVICE_UNAVAILABLE)
        .json(
          new ApiErrorResponse(
            StatusCodes.SERVICE_UNAVAILABLE,
            "Tenant catalog unavailable"
          )
        );
    }

    const xt =
      normalizeXTenantHeader(req.headers["x-tenant-id"]) ||
      normalizeXTenantHeader(req.headers["X-Tenant-Id"]);

    const company = await resolveTenantCompanyForRequest(Company, {
      xTenantRaw: xt,
      hostname,
      tenantBaseHost: process.env.TENANT_BASE_HOST,
    });

    if (!company) {
      if (isProtectedTenantRoute(req)) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(new ApiErrorResponse(StatusCodes.NOT_FOUND, "Tenant not found"));
      }
      return next();
    }

    req.tenant = company;
    req.company = company;
    next();
  } catch (err) {
    next(err);
  }
}

export default tenantResolver;
