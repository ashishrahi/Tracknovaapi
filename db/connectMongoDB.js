import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";
import loadTenantModels from "../utils/tenant-models/loadTenantModels.js";
import {
    Idp_accountSchema,
    CompanySchema,
    AspNetRolesSchema,
    AreaWardMasterSchema,
    AspNetUsersSchema,
    BinLocationSchema,
    BrandMasterSchema,
    CampaignSchema,
    CampaignDetailSchema,
    CampaignTemplateSchema,
    CityMasterSchema,
    CommGroupSchema,
    CommMembersSchema,
    ContractorMasterSchema,
    CountryMasterSchema,
    DepartmentSchema,
    DesignationSchema,
    DeviceTypeSchema,
    EmailSettingSchema,
    EmpMasterSchema,
    EventSettingSchema,
    FuelCorrectionSchema,
    FuelTypeSchema,
    GeofencingSchema,
    HandheldMasterSchema,
    HelpCreateSchema,
    ItemCategoryMasterSchema,
    ItemMasterSchema,
    ItemTypeMasterSchema,
    MenuSchema,
    NodeSchema,
    NodePermissionSchema,
    NTSchema,
    NTCurrentDaySchema,
    PeriodSchema,
    Petrol_Pump_tblSchema,
    RolePermissionSchema,
    RosterPlanSchema,
    RosterPlanDetailSchema,
    RouteSchema,
    RouteAreaBinDetailSchema,
    RouteAreaDetailSchema,
    SmsSettingSchema,
    StateMasterSchema,
    SubscriptionRequestSchema,
    SummaryNTSchema,
    TaxMasterSchema,
    tc_usersSchema,
    UnitMasterSchema,
    UserPermissionSchema,
    VehicleAddTempInfoSchema,
    VehicleTypeChildSchema,
    VehicleTypeMasterSchema,
    VendorMasterSchema,
    ZoneMasterSchema,
} from "../modals/index.js";

const uri = String(process.env.MONGODB_SERVER_URI);
let central_db = null;
let CentralDBModels = {}; // Store models

let tenant_db = null;
let TenantDBModels = {};

// mongoose.set("debug", true); //

export async function connectMongoDB() {
    if (central_db) return CentralDBModels; // ✅ Reuse existing connection

    try {
        central_db = await mongoose
            .createConnection(`${uri}/central_db`, {
                serverSelectionTimeoutMS: 30000, // ⏳ Wait longer for MongoDB
                socketTimeoutMS: 45000, // ⏳ Allow more time for queries
                bufferCommands: false,
            })
            .asPromise();
        console.log(
            `✅ Connected to Central DB: ${central_db.name} and central_db object is `,
            central_db.readyState
        );


        // Define models once
        CentralDBModels = {
            Company: central_db.model("Company", CompanySchema),
            Idp_account: central_db.model("Idp_account", Idp_accountSchema),

        };
        console.log("🔍 Loaded Models:", Object.keys(CentralDBModels));


        return CentralDBModels;
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        throw new ApiErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message
        );
    }
}

/**
 * Get models safely after ensuring connection
 */

export async function getCentralDBModels() {
    console.log("🛠 Checking CentralDBModels:", Object.keys(CentralDBModels)); // ✅ Check loaded models

    if (!central_db) {
        console.log("⏳ Connecting to MongoDB again...");
        return await connectMongoDB();
    }

    return CentralDBModels;
}

async function connectTenantDB(dbName) {
    try {
        // await mongoose.connection.close(); // close existing connection;
        if (tenant_db) {
            console.log(`🔄 Reusing existing connection for ${dbName}`);
            return tenant_db;
        }

        console.log(`🔄 Creating new connection for ${dbName}`);
        tenant_db = await mongoose.createConnection(`${uri}/${dbName}`).asPromise();

        TenantDBModels = {
            Company: central_db.model("Company", CompanySchema),
            Idp_account: central_db.model("Idp_account", Idp_accountSchema),
            AreaWardMaster: "",
            AspNetRoles: "",
            AspNetUsers: "",
            BinLocation: "",
            brandMaster: "",
            Campaign: "",
            CampaignDetail: "",
            CampaignTemplate: "",
            CityMaster: "",
            CommGroup: "",
            CommMembers: "",
            ContractorMaster: "",
            CountryMaster: "",
            Department: "",
            Designation: "",
            DeviceType: "",
            EmailSetting: "",
            EmpMaster: "",
            EventSetting: "",
            FuelCorrection: "",
            FuelType: "",
            Geofencing: "",
            HandheldMaster: "",
            AreaWardMaster: "",
        };
        return tenant_db;
    } catch (error) {
        console.error(`❌ Tenant DB Connection Error (${dbName}):`, error.message);
        throw new ApiErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message
        );
    }
}

mongoose.connection.on("connected", () => {
    console.log("Mongoose Connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed");
    process.exit(0);
});

export { connectTenantDB };
