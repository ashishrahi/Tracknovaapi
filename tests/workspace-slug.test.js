import test from "node:test";
import assert from "node:assert/strict";
import { workspaceSlugify } from "../utils/companyIdentifiers.js";
import { normalizeWorkspaceSlug } from "../utils/tenantLogin.js";

test("normalizeWorkspaceSlug matches workspaceSlugify (login vs stored slug)", () => {
  const pairs = [
    ["testingCompany", "testingcompany"],
    ["Testing Company", "testing-company"],
    ["  Acme  Corp  ", "acme-corp"],
    ["acme-corp", "acme-corp"],
  ];
  for (const [input, want] of pairs) {
    assert.equal(workspaceSlugify(input), want);
    assert.equal(normalizeWorkspaceSlug(input), want);
  }
});

test("empty workspace input normalizes to empty string", () => {
  assert.equal(normalizeWorkspaceSlug(""), "");
  assert.equal(normalizeWorkspaceSlug("  "), "");
});
