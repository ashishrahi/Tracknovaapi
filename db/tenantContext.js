import { AsyncLocalStorage } from "node:async_hooks";

/** @type {AsyncLocalStorage<{ dbName: string | null }>} */
const tenantStorage = new AsyncLocalStorage();

/**
 * Run the request handler with per-request tenant context.
 * @param {() => void} fn
 */
export function runWithTenantContext(fn) {
    tenantStorage.run({ dbName: null }, fn);
}

/**
 * Binds the tenant database name for the current request (from JWT/company).
 * @param {string | null | undefined} dbName
 */
export function setRequestTenantDbName(dbName) {
    const store = tenantStorage.getStore();
    if (store && dbName) {
        store.dbName = String(dbName);
    }
}

/**
 * @returns {string | null}
 */
export function getRequestTenantDbName() {
    return tenantStorage.getStore()?.dbName ?? null;
}
