import "dotenv/config";

import mongoose from "mongoose";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { connectMongoDB } from "../db/connectMongoDB.js";
import { runWithTenantContext, setRequestTenantDbName } from "../db/tenantContext.js";
import { getCentralDBModels } from "../db/index.js";
import { runSignupTenantProvisioning } from "../services/v2/signupTenantProvisioning.service.js";

const QUEUE_NAME = "signupQueue";
const concurrency = Math.max(
    1,
    Math.min(50, Number.parseInt(String(process.env.SIGNUP_WORKER_CONCURRENCY || "5"), 10) || 5)
);

await connectMongoDB();

const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
        const { companyId, adminTemporaryPassword } = job.data || {};
        if (!companyId || typeof adminTemporaryPassword !== "string" || !adminTemporaryPassword) {
            throw new Error(`${QUEUE_NAME}: invalid job payload`);
        }

        const oid =
            mongoose.Types.ObjectId.isValid(companyId) ? new mongoose.Types.ObjectId(String(companyId)) : companyId;

        const { Company, Idp_account } = await getCentralDBModels();
        try {
            const company = await Company.findById(oid).lean();
            if (!company?.database?.dbName) {
                throw new Error(`${QUEUE_NAME}: company or dbName missing for ${companyId}`);
            }

            const idp = await Idp_account.findOne({ accountOwner: oid }).lean();
            const adminUserName = idp?.users?.[0]?.username;
            if (!adminUserName || typeof adminUserName !== "string") {
                throw new Error(`${QUEUE_NAME}: IdP embedded admin username missing`);
            }

            const dbName = company.database.dbName;

            await new Promise((resolve, reject) => {
                runWithTenantContext(() => {
                    setRequestTenantDbName(dbName);
                    runSignupTenantProvisioning({
                        company,
                        adminUserName,
                        adminTemporaryPassword,
                    })
                        .then(resolve)
                        .catch(reject);
                });
            });

            await Company.findByIdAndUpdate(companyId, { status: "ready" });

            return { ok: true, companyId: String(companyId) };
        } catch (err) {
            try {
                await Company.findByIdAndUpdate(companyId, { status: "failed" });
            } catch (updateErr) {
                console.error(`[signup-worker] failed to mark company failed`, updateErr?.message || updateErr);
            }
            throw err;
        }
    },
    {
        connection: redisConnection,
        concurrency,
    }
);

worker.on("completed", (job) => {
    console.log(`[signup-worker] completed job ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.error(`[signup-worker] failed job ${job?.id}`, err?.message || err);
});

console.log(`[signup-worker] listening on "${QUEUE_NAME}" (concurrency=${concurrency})`);
