import { describe, it, after, before } from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";
import { getTenantDBModels, closeAllMongoConnections } from "../db/connectMongoDB.js";
import { runWithTenantContext, setRequestTenantDbName } from "../db/tenantContext.js";
import { AddUpdateEmployeeQuery } from "../utils/DBQueries/EmpMaster.Query.js";

const uri = process.env.MONGODB_SERVER_URI;
const canRun = typeof uri === "string" && uri.length > 0;
const testDb = "company_signup_emp_test";

/**
 * Public signup path uses a partial employee + __companyRegistration so strict
 * empMasterValidator does not block tenant admin creation.
 */
describe("AddUpdateEmployeeQuery — __companyRegistration (public signup path)", () => {
  if (!canRun) {
    it.skip("requires MONGODB_SERVER_URI", () => {});
    return;
  }

  before(async () => {
    const { EmpMaster } = await getTenantDBModels(testDb);
    if (EmpMaster) {
      await EmpMaster.deleteMany({ EmpName: { $regex: /^Signup Test/ } });
    }
  });

  it("returns isSuccess and data with Empid for partial signup payload", async () => {
    const t = String(Date.now());
    const pan = `ABCDE${t.slice(-4)}F`; // PAN: 5 letters + 4 digits + 1 letter
    const aadhaar = `2${t.slice(-11).padStart(11, "0")}`; // 12 digits, leading 2–9

    const result = await new Promise((resolve, reject) => {
      runWithTenantContext(() => {
        setRequestTenantDbName(testDb);
        AddUpdateEmployeeQuery({
          __companyRegistration: true,
          userId: null,
          empid: 0,
          empName: `Signup Test ${t}`,
          empCode: "",
          empPerAddress: "1 Test Street, City",
          empLocalAddress: "1 Test Street, City",
          empMobileNo: t.slice(-10), // 10 digit mobile
          empStatus: "Active",
          empPanNumber: pan,
          empAddharNo: aadhaar,
          empJoiningDate: Date.now(),
          empStateId: "test-state",
          empCountryID: "IN",
          empCityId: "test-city",
          empPincode: "208001",
          roleId: "",
          imageFile: "",
          email: `signup+${t}@example.com`,
          registerModel: {
            id: "",
            username: "",
            email: "user@example.com",
            password: "1234",
            role: "",
          },
          userPermission: [],
        })
          .then(resolve)
          .catch(reject);
      });
    });

    assert.equal(result.isSuccess, true);
    assert.ok(result.data, "expected result.data (mongoose doc or lean object)");
    const plain =
      result.data && typeof result.data.toObject === "function"
        ? result.data.toObject()
        : result.data;
    assert.ok(plain && typeof plain.Empid === "number", "expected Empid on created employee");
  });

  after(async () => {
    await closeAllMongoConnections();
  });
});
