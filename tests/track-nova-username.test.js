import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildTrackNovaSignInUsername,
  last4PhoneDigits,
} from "../utils/trackNovaSignInUsername.js";

describe("trackNova sign-in username", () => {
  it("builds firstName + last4 from formatted Indian mobile", () => {
    const u = buildTrackNovaSignInUsername("Ashish", "+91 98895-58866");
    assert.equal(u, "ashish8866");
  });

  it("strips symbols from first name token", () => {
    const u = buildTrackNovaSignInUsername("O'Brien", "9000001234");
    assert.equal(u, "obrien1234");
  });

  it("last4 is always 4 digits from local 10-digit part", () => {
    assert.equal(last4PhoneDigits("919889558866"), "8866");
    assert.equal(last4PhoneDigits("9889558866"), "8866");
  });
});
