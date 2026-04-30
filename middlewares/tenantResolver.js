import { StatusCodes } from "http-status-codes";
import { getCentralDBModels } from "../db/index.js";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";
import {
  findCompanyByWorkspaceSlugWithFallbacks,
  normalizeWorkspaceSlug,
} from "../utils/tenantLogin.js";

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
  // Reject accidental spaces, IPv6 zones, empty after parse
  if (!normalized || /[\s#/]/.test(normalized)) return null;

  /** Hostnames: labels separated by `.`, alphanumeric + hyphen per label */
  const hostPattern =
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/;
  /** Allow plain `localhost`, single DNS label for dev */
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
 * Resolve tenant from Host: verified custom domain first, then subdomain → workspaceSlug.
 * Sets `req.company` or responds 404 / 503.
 *
 * @type {import("express").RequestHandler}
 */
async function tenantResolver(req, res, next) {
  try {
    const rawHost = req.headers.host ?? req.headers.Host;
    const hostname = parseHostnameFromHostHeader(
      typeof rawHost === "string" ? rawHost : Array.isArray(rawHost) ? rawHost[0] : ""
    );

    if (!hostname) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Missing or invalid Host header"));
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

    /** 1 — verified custom domain (exact host match on stored lowercase domain) */
    let company = await Company.findOne({
      customDomains: {
        $elemMatch: { domain: hostname, verified: true },
      },
    });

    /** 2 — subdomain → workspaceSlug */
    if (!company) {
      const slug = subdomainWorkspaceSlug(hostname, process.env.TENANT_BASE_HOST);

      if (slug) {
        company = await findCompanyByWorkspaceSlugWithFallbacks(Company, slug);
      }
    }

    if (!company) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new ApiErrorResponse(StatusCodes.NOT_FOUND, "Tenant not found"));
    }

    req.company = company;
    next();
  } catch (err) {
    next(err);
  }
}

export default tenantResolver;
