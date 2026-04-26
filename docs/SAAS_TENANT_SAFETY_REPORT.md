# SaaS tenant-isolation and risk report

**Date:** 2026-04-26  
**Scope:** `my_VTS_API` (Express + Mongoose, per-tenant DB via `getTenantDBModels` / `AsyncLocalStorage`)

## Summary

This pass removed **direct imports of tenant-bound Mongoose models** from request-path code and routed data access through `await getTenantDBModels([dbName])`, which uses the per-request database name (from `setRequestTenantDbName` in `getLoggedInCompany.middleware.js`) or an explicit `dbName` when provided.

**Critical fix:** `utils/DBQueries/Dashboard.Query.js` previously used `NTCurrentDay` / `ItemMaster` from the default schema import path; those calls now obtain models from the active tenant connection inside each exported query.

## How tenant context is set

- **Global prefix:** `app.js` wraps each HTTP request in `runWithTenantContext` (`db/tenantContext.js`).
- **Authenticated users:** `getLoggedInCompany` validates JWT, loads company (central DB), and calls `setRequestTenantDbName(company.database.dbName)` when the user is not `SuperAdmin`.
- **Resolving the DB name:** `getTenantDBModels()` uses `resolveTenantDbName` in `connectMongoDB.js` (explicit arg → `AsyncLocalStorage` → error if missing).

## Route-level verification

- **No route should hit a tenant without context** if it depends on `getTenantDBModels()` without a `dbName` argument: a missing tenant raises `400` *"Tenant database not in context"*.
- **SuperAdmin:** `setRequestTenantDbName` is not set; any handler that only calls `getTenantDBModels()` with no arg will fail for those users. Callers that must support SuperAdmin need central-only logic or to pass a chosen tenant explicitly (existing pattern in v2 auth where `getTenantDBModels(companyDBDetails.database.dbName)` is used).
- **`switchDatabase` middleware** (`routes/v2/Company.routes.js`) additionally opens the tenant and attaches `req.db` for a narrow set of v2 company flows.

## Residual risks (recommended follow-ups)

| Area | Risk | Mitigation |
|------|------|------------|
| **IDOR / token tampering** | A forged `ownerId` in JWT could point at another company if verification is ever weakened. | Keep JWT secret rotation; consider binding `dbName` into the token and comparing to company record. |
| **SuperAdmin + tenant data** | SuperAdmin has no `dbName` in context; any tenant query without an explicit `dbName` will error or must use central models only. | Document which endpoints are SuperAdmin-safe; add integration tests. |
| **`nodeMailer1.js` dynamic transporter** | `getTenantDBModels()` is now used; email settings read from whichever tenant is in the current async context. | Ensure email send only runs after tenant is set, or pass `dbName` into a helper. |
| **`auth.middleware` (optional / currently unused in `app.js`)** | User lookup on `AspNetUsers` only runs when `getRequestTenantDbName()` is set. | Re-enable only after `getLoggedInCompany` (or equivalent) has set the tenant, or add central fallback if product requires it. |
| **LRU tenant cache** | Long-lived process caches many `createConnection` instances until idle sweep. | Tune `TENANT_MAX_CACHED` / `TENANT_DB_IDLE_MS`; monitor memory on shared hosts. |

## Automated tests

- **`npm test`:** `tests/tenant-parallel.test.js` — parallel `getTenantDBModels('tenant_iso_test_a'|'tenant_iso_test_b')` and `AsyncLocalStorage` two-request simulation. **Requires** `MONGODB_SERVER_URI`; skipped otherwise.

## Change inventory (this pass)

- Controllers: removed unused `../modals` (and `../modals/index.js`) tenant model imports where `getTenantDBModels` already provided models; **`NTRead`**, **`Comm` (DeleteCommGroup)**, and **`Dashboard.Query`** were corrected to always resolve tenant models in-scope.
- Services: removed unused `Company` / `EmpMaster` default model imports; central access remains through `getCentralDBModels()`.
- Middleware: `auth.middleware` no longer uses a global `AspNetUsers` model import; uses tenant `AspNetUsers` when tenant context exists.
- Utilities: `utils/DBQueries/*`, pipelines, and `nodeMailer1` — removed default model imports in favor of `getTenantDBModels()`.

## Sign-off

This report reflects static analysis and targeted fixes plus passing parallel tenant tests against MongoDB. Full production sign-off should add HTTP-level tests (authenticated tenant A vs B hitting real routes) and monitoring for `Tenant database not in context` and cross-tenant access attempts.
