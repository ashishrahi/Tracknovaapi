/**
 * Backfill Company.companyCode and Company.workspaceSlug for existing tenants,
 * then sync indexes (including unique username per tenant on Idp_account).
 *
 * Run from repo: `node scripts/migrate-tenant-auth.mjs`
 * Requires MONGODB_SERVER_URI and uses central_db like the API.
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getCentralDBModels, closeAllMongoConnections } from "../db/index.js";
import {
  ensureUniqueCompanyCode,
  ensureUniqueWorkspaceSlug,
} from "../utils/companyIdentifiers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function reportDuplicateIdpUsernames(Idp_account) {
  const dupes = await Idp_account.collection
    .aggregate([
      { $unwind: "$users" },
      {
        $group: {
          _id: { accountOwner: "$accountOwner", u: "$users.username" },
          c: { $sum: 1 },
        },
      },
      { $match: { c: { $gt: 1 } } },
    ])
    .toArray();
  if (dupes.length) {
    console.error(
      "[migrate-tenant-auth] Duplicate (accountOwner, username) pairs in Idp_account — fix before unique index:"
    );
    console.error(JSON.stringify(dupes, null, 2));
    return false;
  }
  return true;
}

async function main() {
  const { Company, Idp_account } = await getCentralDBModels();

  const companies = await Company.find({}).lean();
  let updated = 0;
  for (const c of companies) {
    const set = {};
    if (!c.companyCode) {
      set.companyCode = await ensureUniqueCompanyCode(Company, c.companyName, c._id);
    }
    if (!c.workspaceSlug) {
      set.workspaceSlug = await ensureUniqueWorkspaceSlug(Company, c.companyName, c._id);
    }
    if (Object.keys(set).length) {
      await Company.updateOne({ _id: c._id }, { $set: set });
      updated++;
      console.log(`[migrate-tenant-auth] Company ${c._id} →`, set);
    }
  }
  console.log(`[migrate-tenant-auth] Updated ${updated} companies (total ${companies.length}).`);

  const canIndex = await reportDuplicateIdpUsernames(Idp_account);
  if (canIndex) {
    try {
      await Idp_account.syncIndexes();
      await Company.syncIndexes();
      console.log("[migrate-tenant-auth] syncIndexes() completed for Idp_account and Company.");
    } catch (e) {
      console.error("[migrate-tenant-auth] syncIndexes failed:", e?.message || e);
      process.exitCode = 1;
    }
  } else {
    console.error("[migrate-tenant-auth] Skipping syncIndexes — resolve duplicates and re-run.");
    process.exitCode = 1;
  }

  await closeAllMongoConnections();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
  return closeAllMongoConnections();
});
