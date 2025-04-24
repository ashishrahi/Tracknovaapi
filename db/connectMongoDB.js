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
import dotenv from "dotenv";

dotenv.config();

const uri = String(process.env.MONGODB_SERVER_URI);

// For Cental DB
let central_db = null;
let CentralDBModels = {}; // Store models

// For Tenant DB
let tenant_db = null;
let TenantDBModels = {};

let tenantDBName = null;

// mongoose.set("debug", true); 

export async function connectMongoDB() {
    if (central_db) return CentralDBModels; // ✅ Reuse existing connection
    try {
        central_db = await mongoose
            .createConnection(`${uri}/central_db`)
            .asPromise();
        console.log(
            `✅ Connected to Central DB: ${central_db.name} and central_db ready state is `,
            central_db.readyState
        );


        // Define models once
        CentralDBModels = {
            Company: central_db.model("Company", CompanySchema),
            Idp_account: central_db.model("Idp_account", Idp_accountSchema),
            CountryMaster: central_db.model("CountryMaster", CountryMasterSchema),
            StateMaster: central_db.model("StateMaster", StateMasterSchema),
            CityMaster: central_db.model("CityMaster", CityMasterSchema),
            Menu: central_db.model("Menu", MenuSchema),

        };


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
    // console.log("🛠 Checking CentralDBModels:", Object.keys(CentralDBModels)); // ✅ Check loaded models

    if (!central_db) {
        console.log("⏳ Connecting to MongoDB again...");
        return await connectMongoDB();
    }

    return CentralDBModels;
}


//-------- connectTenantDB ----------->


export async function connectTenantDB(dbName) {
    try {
        tenantDBName = dbName;
        // await mongoose.connection.close(); // close existing connection;
        if (tenant_db && tenant_db.readyState === 1) {
            console.log(`🔄 Reusing existing connection for ${tenantDBName}`);
            return TenantDBModels;
        }

        console.log(`🔄 Creating new connection for ${tenantDBName}`);
        tenant_db = await mongoose.createConnection(`${uri}/${tenantDBName}`).asPromise();

        TenantDBModels = {
            tenant_db: tenant_db,
            Company: tenant_db.model("Company", CompanySchema),
            Idp_account: tenant_db.model("Idp_account", Idp_accountSchema),
            AreaWardMaster: tenant_db.model("AreaWardMaster", AreaWardMasterSchema),
            AspNetRoles: tenant_db.model("AspNetRoles", AspNetRolesSchema),
            AspNetUsers: tenant_db.model("AspNetUsers", AspNetUsersSchema),
            BinLocation: tenant_db.model("BinLocation", BinLocationSchema),
            BrandMaster: tenant_db.model("brandMaster", BrandMasterSchema),
            Campaign: tenant_db.model("Campaign", CampaignSchema),
            CampaignDetail: tenant_db.model("CampaignDetail", CampaignDetailSchema),
            CampaignTemplate: tenant_db.model("CampaignTemplate", CampaignTemplateSchema),
            CityMaster: tenant_db.model("CityMaster", CityMasterSchema),
            CommGroup: tenant_db.model("CommGroup", CommGroupSchema),
            CommMembers: tenant_db.model("CommMembers", CommMembersSchema),
            ContractorMaster: tenant_db.model("ContractorMaster", ContractorMasterSchema),
            CountryMaster: tenant_db.model("CountryMaster", CountryMasterSchema),
            Department: tenant_db.model("Department", DepartmentSchema),
            Designation: tenant_db.model("Designation", DesignationSchema),
            DeviceType: tenant_db.model("DeviceType", DeviceTypeSchema),
            EmailSetting: tenant_db.model("EmailSetting", EmailSettingSchema),
            EmpMaster: tenant_db.model("EmpMaster", EmpMasterSchema),
            EventSetting: tenant_db.model("EventSetting", EventSettingSchema),
            FuelCorrection: tenant_db.model("FuelCorrection", FuelCorrectionSchema),
            FuelType: tenant_db.model("FuelType", FuelTypeSchema),
            Geofencing: tenant_db.model("Geofencing", GeofencingSchema),
            HandheldMaster: tenant_db.model("HandheldMaster", HandheldMasterSchema),
            HelpCreate: tenant_db.model("HelpCreate", HelpCreateSchema),
            // Idp_account
            ItemCategoryMaster: tenant_db.model("ItemCategoryMaster", ItemCategoryMasterSchema),
            ItemMaster: tenant_db.model("ItemMaster", ItemMasterSchema),
            ItemTypeMaster: tenant_db.model("ItemTypeMaster", ItemTypeMasterSchema),
            Menu: tenant_db.model("Menu", MenuSchema),
            Node: tenant_db.model("Node", NodeSchema),
            NodePermission: tenant_db.model("NodePermission", NodePermissionSchema),
            NT: tenant_db.model("NT", NTSchema),
            NTCurrentDay: tenant_db.model("NTCurrentDay", NTCurrentDaySchema),
            Period: tenant_db.model("Period", PeriodSchema),
            Petrol_Pump_tbl: tenant_db.model("Petrol_Pump_tbl", Petrol_Pump_tblSchema),
            RolePermission: tenant_db.model("RolePermission", RolePermissionSchema),
            RosterPlan: tenant_db.model("RosterPlan", RosterPlanSchema),
            RosterPlanDetail: tenant_db.model("RosterPlanDetail", RosterPlanDetailSchema),
            Route: tenant_db.model("Route", RouteSchema),
            RouteAreaBinDetail: tenant_db.model("RouteAreaBinDetail", RouteAreaBinDetailSchema),
            RouteAreaDetail: tenant_db.model("RouteAreaDetail", RouteAreaDetailSchema),
            SmsSetting: tenant_db.model("SmsSetting", SmsSettingSchema),
            StateMaster: tenant_db.model("StateMaster", StateMasterSchema),
            SubscriptionRequest: tenant_db.model("SubscriptionRequest", SubscriptionRequestSchema),
            SummaryNT: tenant_db.model("SummaryNT", SummaryNTSchema),
            TaxMaster: tenant_db.model("TaxMaster", TaxMasterSchema),
            tc_users: tenant_db.model("tc_users", tc_usersSchema),
            UnitMaster: tenant_db.model("UnitMaster", UnitMasterSchema),
            // Users
            UserPermission: tenant_db.model("UserPermission", UserPermissionSchema),
            VehicleAddTempInfo: tenant_db.model("VehicleAddTempInfo", VehicleAddTempInfoSchema),
            VehicleTypeChild: tenant_db.model("VehicleTypeChild", VehicleTypeChildSchema),
            VehicleTypeMaster: tenant_db.model("VehicleTypeMaster", VehicleTypeMasterSchema),
            VendorMaster: tenant_db.model("VendorMaster", VendorMasterSchema),
            // Ward Master    
            ZoneMaster: tenant_db.model("ZoneMaster", ZoneMasterSchema),


        };
        return TenantDBModels;
    } catch (error) {
        console.error(`❌ Tenant DB Connection Error (${tenantDBName}):`, error.message);
        throw new ApiErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message
        );
    }
}

export async function getTenantDBModels(dbName) {
    // console.log("🛠 Checking TenantDBModels:", Object.keys(TenantDBModels)); // ✅ Check loaded models
    const dbNameToUse = dbName || tenantDBName;
    if (!tenant_db || tenant_db.readyState === 0) {
        console.log("⏳ Connecting to MongoDB Again for tenant connection...");
        return await connectTenantDB(dbNameToUse);
    }
    return TenantDBModels;
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


