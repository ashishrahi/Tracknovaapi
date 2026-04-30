import test from "node:test";
import assert from "node:assert/strict";
import { buildSignupRedirectUrl } from "../utils/tenantAppUrl.js";

test("buildSignupRedirectUrl returns absolute workspace URL when env configured", () => {
  const prevHost = process.env.TENANT_BASE_HOST;
  const prevProto = process.env.TENANT_APP_PROTOCOL;
  const prevEnv = process.env.NODE_ENV;
  try {
    process.env.TENANT_BASE_HOST = "saas.example.net";
    process.env.TENANT_APP_PROTOCOL = "https";
    delete process.env.NODE_ENV;
    assert.equal(buildSignupRedirectUrl("acme-corp"), "https://acme-corp.saas.example.net");
    assert.equal(buildSignupRedirectUrl(""), null);
  } finally {
    if (prevHost === undefined) delete process.env.TENANT_BASE_HOST;
    else process.env.TENANT_BASE_HOST = prevHost;
    if (prevProto === undefined) delete process.env.TENANT_APP_PROTOCOL;
    else process.env.TENANT_APP_PROTOCOL = prevProto;
    if (prevEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevEnv;
  }
});
