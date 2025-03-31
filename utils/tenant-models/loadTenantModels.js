import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadTenantModels(tenantDB) {
    if (!tenantDB) throw new Error("Tenant database connection is required.");

    const modelsPath = path.join(__dirname, "../../modals");
    const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith(".js"));

    for (const file of modelFiles) {
        const modelPath = path.join(modelsPath, file);

        try {
            if (file.startsWith("#")) {
                console.warn(`⚠️ Skipping ${file}: Invalid filename (starts with #).`);
                continue;
            }

            const { default: modelSchema } = await import(`file://${modelPath}`);

            if (!modelSchema || !modelSchema.schema) {
                console.warn(`⚠️ Skipping ${file}: No valid schema found.`);
                continue;
            }

            // Extract the model name correctly (handles .model.js and .modal.js)
            const modelName = file.replace(/(\.model\.js|\.modal\.js)$/, "").trim();

            if (tenantDB.models[modelName]) {
                console.log(`♻️ Model '${modelName}' already registered, skipping...`);
                continue;
            }

            tenantDB.model(modelName, modelSchema.schema);
            console.log(`✅ Registered model in tenantDB: ${modelName}`);
        } catch (error) {
            console.error(`❌ Error loading model '${file}':`, error.message);
        }
    }
}


export default loadTenantModels;