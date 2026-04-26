import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateRegisterCompanyModel } from "../utils/validation/joi.js";

const base = {
  companyName: "Acme Logistics",
  companyPhone: "9876543210",
  companyEmail: "ops@acmecorp.com",
  companyAddress: "1 Main St",
  pincode: "208001",
  city: "Kanpur",
  state: "UP",
  country: "India",
  admin: {
    name: "Jane Doe",
    email: "ops@acmecorp.com",
    phone: "9876543210",
    role: "Admin",
  },
  subscription: {
    plan: "Trial",
    fromDate: "2026-01-01T00:00:00.000Z",
    toDate: "2026-12-31T00:00:00.000Z",
    status: "Active",
  },
  database: {
    backupEnabled: "Inactive",
  },
};

describe("validateRegisterCompanyModel — database.dbName", () => {
  it("accepts missing dbName (public signup shape)", () => {
    const { error } = validateRegisterCompanyModel({ ...base, database: { backupEnabled: "Inactive" } });
    assert.equal(error, undefined);
  });

  it("accepts empty string dbName (lenient; server will replace)", () => {
    const { error } = validateRegisterCompanyModel({
      ...base,
      database: { dbName: "", backupEnabled: "Inactive" },
    });
    assert.equal(error, undefined);
  });

  it("accepts a valid manual dbName (admin flow)", () => {
    const { error, value } = validateRegisterCompanyModel({
      ...base,
      database: { dbName: "acme_logistics_db", backupEnabled: "Active" },
    });
    assert.equal(error, undefined);
    assert.equal(value.database.dbName, "acme_logistics_db");
  });

  it("rejects invalid characters in dbName when provided", () => {
    const { error } = validateRegisterCompanyModel({
      ...base,
      database: { dbName: "bad name", backupEnabled: "Active" },
    });
    assert.ok(error, "expected Joi error for invalid dbName");
  });

  it("normalizes +91 admin and company phone to 10 local digits", () => {
    const { error, value } = validateRegisterCompanyModel({
      ...base,
      companyPhone: "+91 98765-43210",
      admin: { ...base.admin, phone: "0091 98765-43210" },
    });
    assert.equal(error, undefined);
    assert.equal(value.admin.phone, "9876543210");
    assert.equal(value.companyPhone, "9876543210");
  });
});
