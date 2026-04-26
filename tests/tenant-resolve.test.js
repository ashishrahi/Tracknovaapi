import test from "node:test";
import assert from "node:assert/strict";
import { findCompanyWhenWorkspaceSlugMissingByName } from "../utils/tenantLogin.js";
import { workspaceSlugify } from "../utils/companyIdentifiers.js";

test("name fallback: finds company with empty workspaceSlug when slug matches companyName", async () => {
  const wantSlug = workspaceSlugify("Acme Transport Co");
  const leanDoc = { _id: "507f1f77bcf86cd799439011", companyName: "Acme Transport Co" };
  let updateCalled = false;
  const fullDoc = { _id: "507f1f77bcf86cd799439011", markModified() {} };
  const Company = {
    find: () => ({
      select: () => ({
        limit: () => ({ lean: async () => [leanDoc] }),
      }),
    }),
    findById: async () => fullDoc,
    updateOne: async (filter, u) => {
      updateCalled = true;
      assert.equal(u.$set.workspaceSlug, wantSlug);
    },
  };
  const out = await findCompanyWhenWorkspaceSlugMissingByName(Company, wantSlug);
  assert.equal(out, fullDoc);
  assert.equal(updateCalled, true);
});

test("name fallback: no match when derived slug differs", async () => {
  const Company = {
    find: () => ({
      select: () => ({
        limit: () => ({ lean: async () => [{ _id: "1", companyName: "Other LLC" }] }),
      }),
    }),
  };
  const out = await findCompanyWhenWorkspaceSlugMissingByName(Company, "nope");
  assert.equal(out, null);
});
