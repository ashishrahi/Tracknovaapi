import test from "node:test";
import assert from "node:assert/strict";
import { resolveTenantCompanyForRequest } from "../middlewares/tenantResolver.js";

test("resolveTenantCompany: x-tenant-id ObjectId binds tenant", async () => {
  const company = { _id: "507f1f77bcf86cd799439011", workspaceSlug: "acme-corp" };
  const oid = company._id;
  const Company = {
    async findById(id) {
      assert.equal(id, oid);
      return company;
    },
    findOne: async () => {
      assert.fail("should not resolve host-derived tenant when Mongo id hits");
    },
  };
  const out = await resolveTenantCompanyForRequest(Company, {
    xTenantRaw: oid,
    hostname: "api-v1.example.com",
    tenantBaseHost: "example.com",
  });
  assert.equal(out, company);
});

test("resolveTenantCompany: workspace slug header uses slug lookup", async () => {
  const company = { _id: "2", workspaceSlug: "fleet-one" };
  const Company = {
    findById: async () => null,
    findOne: async (q) => {
      if (q?.workspaceSlug === "fleet-one") return company;
      if (q?.$expr) return null;
      return null;
    },
    find: () => ({
      select: () => ({
        limit: () => ({
          lean: async () => [],
        }),
      }),
    }),
  };

  const out = await resolveTenantCompanyForRequest(Company, {
    xTenantRaw: "fleet-one",
    hostname: "localhost",
    tenantBaseHost: "example.com",
  });
  assert.equal(out, company);
});

test("resolveTenantCompany: reserved API host skips host mapping without header", async () => {
  const Company = {
    findById: async () => null,
    findOne: async () => null,
    find: () => ({
      select: () => ({
        limit: () => ({
          lean: async () => [],
        }),
      }),
    }),
  };
  const out = await resolveTenantCompanyForRequest(Company, {
    xTenantRaw: "",
    hostname: "api-v1.ashishrahidev.site",
    tenantBaseHost: "ashishrahidev.site",
  });
  assert.equal(out, null);
});
