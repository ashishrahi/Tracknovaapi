import { describe, it, after, before } from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";
import { getTenantDBModels, closeAllMongoConnections } from "../db/connectMongoDB.js";
import {
  runWithTenantContext,
  setRequestTenantDbName,
} from "../db/tenantContext.js";

const uri = process.env.MONGODB_SERVER_URI;
const canRun = typeof uri === "string" && uri.length > 0;

describe("Tenant DB isolation (parallel A vs B)", () => {
  if (!canRun) {
    it.skip("requires MONGODB_SERVER_URI (parallel tenant isolation)", () => {});
    return;
  }

  const dbA = "tenant_iso_test_a";
  const dbB = "tenant_iso_test_b";

  before(async () => {
    await getTenantDBModels(dbA);
    await getTenantDBModels(dbB);
  });

  it("returns distinct connection handles for explicit dbName in parallel", async () => {
    const [mA, mB] = await Promise.all([
      getTenantDBModels(dbA),
      getTenantDBModels(dbB),
    ]);
    assert.notEqual(
      mA.tenant_db,
      mB.tenant_db,
      "parallel explicit tenants must not share a mongoose connection"
    );
    assert.equal(mA.tenant_db.name, dbA);
    assert.equal(mB.tenant_db.name, dbB);
  });

  it("resolves per-request tenant via AsyncLocalStorage without cross-tenant mix-up", async () => {
    const results = await Promise.all([
      new Promise((resolve, reject) => {
        runWithTenantContext(() => {
          setRequestTenantDbName(dbA);
          getTenantDBModels()
            .then((m) => {
              try {
                assert.equal(m.tenant_db.name, dbA);
                resolve("a");
              } catch (e) {
                reject(e);
              }
            })
            .catch(reject);
        });
      }),
      new Promise((resolve, reject) => {
        runWithTenantContext(() => {
          setRequestTenantDbName(dbB);
          getTenantDBModels()
            .then((m) => {
              try {
                assert.equal(m.tenant_db.name, dbB);
                resolve("b");
              } catch (e) {
                reject(e);
              }
            })
            .catch(reject);
        });
      }),
    ]);
    assert.deepEqual(results.sort(), ["a", "b"]);
  });

  after(async () => {
    await closeAllMongoConnections();
  });
});
