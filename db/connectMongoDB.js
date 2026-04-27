import mongoose from "mongoose";
import { ConnectionString } from "mongodb-connection-string-url";
import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";
import {
    Idp_accountSchema,
    CompanySchema,
    CompanyAuditLogSchema,
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
    SaasSubscriptionInvoiceSchema,
    TenantUsageMetricSchema,
    SupportTicketSchema,
    LifecycleEmailLogSchema,
    ImpersonationSessionSchema,
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
import { getRequestTenantDbName } from "./tenantContext.js";

dotenv.config();

const uri = String(process.env.MONGODB_SERVER_URI);

/**
 * Replaces the default database in the connection string without breaking query options.
 * String concat like `${uri}/tenant` corrupts `?w=majority` into `w=majority/tenant`.
 * @param {string} baseUri
 * @param {string} dbName
 * @returns {string}
 */
function connectionUriForDatabase(baseUri, dbName) {
    const cs = new ConnectionString(baseUri);
    cs.pathname = `/${dbName}`;
    return cs.toString();
}

const MONGO_OPTIONS = {
    maxPoolSize: Number(process.env.TENANT_DB_MAX_POOL) || 10,
    minPoolSize: 0,
    maxIdleTimeMS: Number(process.env.MONGO_MAX_IDLE_TIME_MS) || 120000,
    serverSelectionTimeoutMS: 30000,
};

const TENANT_IDLE_MS = Number(process.env.TENANT_DB_IDLE_MS) || 20 * 60 * 1000;
const SWEEP_INTERVAL_MS = Number(process.env.TENANT_DB_SWEEP_MS) || 60 * 1000;
const MAX_CACHED_TENANTS = Number(process.env.TENANT_MAX_CACHED) || 100;

const DB_NAME_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

/** @type {import('mongoose').Connection | null} */
let centralDb = null;
/** @type {Record<string, unknown>} */
let centralModels = {};

/**
 * @typedef {Object} TenantEntry
 * @property {import('mongoose').Connection} connection
 * @property {Record<string, unknown> & { tenant_db: import('mongoose').Connection }} models
 * @property {number} lastUsed
 */

/** @type {Map<string, TenantEntry>} */
const tenantByName = new Map();
/** In-flight createConnection per dbName — concurrency-safe coalescing */
const creatingTenant = new Map();
/** @type {NodeJS.Timeout | null} */
let sweepTimer = null;

/**
 * @param {string | undefined} name
 * @returns {boolean}
 */
export function isValidTenantDatabaseName(name) {
    return typeof name === "string" && DB_NAME_PATTERN.test(name);
}

function assertValidDatabaseName(name) {
    if (!isValidTenantDatabaseName(name)) {
        throw new ApiErrorResponse(
            StatusCodes.BAD_REQUEST,
            "Invalid or missing tenant database name"
        );
    }
    return name;
}

/**
 * @param {import('mongoose').Connection} conn
 */
function buildCentralModels(conn) {
    return {
        Company: conn.model("Company", CompanySchema),
        CompanyAuditLog: conn.model("CompanyAuditLog", CompanyAuditLogSchema),
        Idp_account: conn.model("Idp_account", Idp_accountSchema),
        CountryMaster: conn.model("CountryMaster", CountryMasterSchema),
        StateMaster: conn.model("StateMaster", StateMasterSchema),
        CityMaster: conn.model("CityMaster", CityMasterSchema),
        Menu: conn.model("Menu", MenuSchema),
        SaasSubscriptionInvoice: conn.model("SaasSubscriptionInvoice", SaasSubscriptionInvoiceSchema),
        TenantUsageMetric: conn.model("TenantUsageMetric", TenantUsageMetricSchema),
        SupportTicket: conn.model("SupportTicket", SupportTicketSchema),
        LifecycleEmailLog: conn.model("LifecycleEmailLog", LifecycleEmailLogSchema),
        ImpersonationSession: conn.model("ImpersonationSession", ImpersonationSessionSchema),
    };
}

/**
 * @param {import('mongoose').Connection} conn
 */
function buildTenantModels(conn) {
    const m = {
        tenant_db: conn,
        Company: conn.model("Company", CompanySchema),
        Idp_account: conn.model("Idp_account", Idp_accountSchema),
        AreaWardMaster: conn.model("AreaWardMaster", AreaWardMasterSchema),
        AspNetRoles: conn.model("AspNetRoles", AspNetRolesSchema),
        AspNetUsers: conn.model("AspNetUsers", AspNetUsersSchema),
        BinLocation: conn.model("BinLocation", BinLocationSchema),
        BrandMaster: conn.model("brandMaster", BrandMasterSchema),
        Campaign: conn.model("Campaign", CampaignSchema),
        CampaignDetail: conn.model("CampaignDetail", CampaignDetailSchema),
        CampaignTemplate: conn.model("CampaignTemplate", CampaignTemplateSchema),
        CityMaster: conn.model("CityMaster", CityMasterSchema),
        CommGroup: conn.model("CommGroup", CommGroupSchema),
        CommMembers: conn.model("CommMembers", CommMembersSchema),
        ContractorMaster: conn.model("ContractorMaster", ContractorMasterSchema),
        CountryMaster: conn.model("CountryMaster", CountryMasterSchema),
        Department: conn.model("Department", DepartmentSchema),
        Designation: conn.model("Designation", DesignationSchema),
        DeviceType: conn.model("DeviceType", DeviceTypeSchema),
        EmailSetting: conn.model("EmailSetting", EmailSettingSchema),
        EmpMaster: conn.model("EmpMaster", EmpMasterSchema),
        EventSetting: conn.model("EventSetting", EventSettingSchema),
        FuelCorrection: conn.model("FuelCorrection", FuelCorrectionSchema),
        FuelType: conn.model("FuelType", FuelTypeSchema),
        Geofencing: conn.model("Geofencing", GeofencingSchema),
        HandheldMaster: conn.model("HandheldMaster", HandheldMasterSchema),
        HelpCreate: conn.model("HelpCreate", HelpCreateSchema),
        ItemCategoryMaster: conn.model("ItemCategoryMaster", ItemCategoryMasterSchema),
        ItemMaster: conn.model("ItemMaster", ItemMasterSchema),
        ItemTypeMaster: conn.model("ItemTypeMaster", ItemTypeMasterSchema),
        Menu: conn.model("Menu", MenuSchema),
        Node: conn.model("Node", NodeSchema),
        NodePermission: conn.model("NodePermission", NodePermissionSchema),
        NT: conn.model("NT", NTSchema),
        NTCurrentDay: conn.model("NTCurrentDay", NTCurrentDaySchema),
        Period: conn.model("Period", PeriodSchema),
        Petrol_Pump_tbl: conn.model("Petrol_Pump_tbl", Petrol_Pump_tblSchema),
        RolePermission: conn.model("RolePermission", RolePermissionSchema),
        RosterPlan: conn.model("RosterPlan", RosterPlanSchema),
        RosterPlanDetail: conn.model("RosterPlanDetail", RosterPlanDetailSchema),
        Route: conn.model("Route", RouteSchema),
        RouteAreaBinDetail: conn.model("RouteAreaBinDetail", RouteAreaBinDetailSchema),
        RouteAreaDetail: conn.model("RouteAreaDetail", RouteAreaDetailSchema),
        SmsSetting: conn.model("SmsSetting", SmsSettingSchema),
        StateMaster: conn.model("StateMaster", StateMasterSchema),
        SubscriptionRequest: conn.model("SubscriptionRequest", SubscriptionRequestSchema),
        SummaryNT: conn.model("SummaryNT", SummaryNTSchema),
        TaxMaster: conn.model("TaxMaster", TaxMasterSchema),
        tc_users: conn.model("tc_users", tc_usersSchema),
        UnitMaster: conn.model("UnitMaster", UnitMasterSchema),
        UserPermission: conn.model("UserPermission", UserPermissionSchema),
        VehicleAddTempInfo: conn.model("VehicleAddTempInfo", VehicleAddTempInfoSchema),
        VehicleTypeChild: conn.model("VehicleTypeChild", VehicleTypeChildSchema),
        VehicleTypeMaster: conn.model("VehicleTypeMaster", VehicleTypeMasterSchema),
        VendorMaster: conn.model("VendorMaster", VendorMasterSchema),
        ZoneMaster: conn.model("ZoneMaster", ZoneMasterSchema),
    };
    m.vehicleTypeCollection = conn.db.collection(m.VehicleTypeMaster.collection.name);
    return m;
}

/**
 * @param {import('mongoose').Connection} conn
 * @param {string} label
 */
function wireConnectionEvents(conn, label) {
    conn.on("error", (err) => {
        console.error(`MongoDB connection error [${label}]:`, err?.message || err);
    });
    conn.on("disconnected", () => {
        console.warn(`MongoDB disconnected [${label}]`);
    });
}

/**
 * @returns {string | null}
 */
function resolveTenantDbName(/** @type {string | undefined} */ explicit) {
    if (explicit) {
        return assertValidDatabaseName(explicit);
    }
    const fromRequest = getRequestTenantDbName();
    if (fromRequest) {
        return assertValidDatabaseName(fromRequest);
    }
    return null;
}

/**
 * Closes the least-recently-used tenant connection when the cache is full.
 */
function evictLruIfNeeded(/** @type {string} */ aboutToAdd) {
    if (tenantByName.size < MAX_CACHED_TENANTS || tenantByName.has(aboutToAdd)) {
        return;
    }
    let bestKey = null;
    let bestTime = Infinity;
    for (const [name, ent] of tenantByName) {
        if (name === aboutToAdd) {
            return;
        }
        if (ent.lastUsed < bestTime) {
            bestTime = ent.lastUsed;
            bestKey = name;
        }
    }
    if (bestKey) {
        const ent = tenantByName.get(bestKey);
        if (ent) {
            void ent.connection.close().then(() => {
                console.log(`[tenant] LRU evicted closed: ${bestKey}`);
            });
            tenantByName.delete(bestKey);
        }
    }
}

async function createTenantEntry(dbName) {
    const url = connectionUriForDatabase(uri, dbName);
    const connection = await mongoose.createConnection(url, MONGO_OPTIONS).asPromise();
    wireConnectionEvents(connection, `tenant:${dbName}`);

    const entry = {
        connection,
        models: buildTenantModels(connection),
        lastUsed: Date.now(),
    };
    tenantByName.set(dbName, entry);
    console.log(
        `✅ Tenant connection ready: ${dbName} (cached: ${tenantByName.size}, readyState=${connection.readyState})`
    );
    return entry;
}

/**
 * @returns {Promise<TenantEntry>}
 */
async function getOrCreateTenantEntry(dbName) {
    const name = assertValidDatabaseName(dbName);
    const existing = tenantByName.get(name);
    if (existing && existing.connection.readyState === 1) {
        existing.lastUsed = Date.now();
        return existing;
    }
    if (existing) {
        tenantByName.delete(name);
        await existing.connection.close().catch(() => {});
    }

    const pending = creatingTenant.get(name);
    if (pending) {
        return pending;
    }

    evictLruIfNeeded(name);

    const p = (async () => {
        return createTenantEntry(name);
    })();

    creatingTenant.set(name, p);
    try {
        return await p;
    } finally {
        creatingTenant.delete(name);
    }
}

/**
 * @returns {Promise<Record<string, unknown> & { tenant_db: import('mongoose').Connection }>}
 */
export async function connectTenantDB(dbName) {
    const name = assertValidDatabaseName(dbName);
    const entry = await getOrCreateTenantEntry(name);
    return entry.models;
}

/**
 * @returns {Promise<Record<string, unknown> & { tenant_db: import('mongoose').Connection }>}
 */
export async function getTenantDBModels(/** @type {string | undefined} */ dbName) {
    const resolved = resolveTenantDbName(dbName);
    if (!resolved) {
        throw new ApiErrorResponse(
            StatusCodes.BAD_REQUEST,
            "Tenant database not in context. Pass dbName, or require Authorization + company with database.dbName, or set tenant in middleware."
        );
    }
    const entry = await getOrCreateTenantEntry(resolved);
    entry.lastUsed = Date.now();
    return entry.models;
}

function sweepIdleTenants() {
    const now = Date.now();
    for (const [name, ent] of tenantByName) {
        if (now - ent.lastUsed < TENANT_IDLE_MS) {
            continue;
        }
        if (creatingTenant.has(name)) {
            continue;
        }
        tenantByName.delete(name);
        void ent.connection.close().then(() => {
            console.log(`[tenant] Idle close: ${name} (after ${TENANT_IDLE_MS}ms)`);
        });
    }
}

function ensureSweepTimer() {
    if (sweepTimer) {
        return;
    }
    sweepTimer = setInterval(sweepIdleTenants, SWEEP_INTERVAL_MS);
    if (sweepTimer.unref) {
        sweepTimer.unref();
    }
}

export async function connectMongoDB() {
    if (centralDb && centralDb.readyState === 1) {
        return centralModels;
    }
    try {
        if (centralDb) {
            await centralDb.close().catch(() => {});
            centralDb = null;
        }
        centralDb = await mongoose
            .createConnection(connectionUriForDatabase(uri, "central_db"), MONGO_OPTIONS)
            .asPromise();
        wireConnectionEvents(centralDb, "central_db");
        centralModels = buildCentralModels(centralDb);
        ensureSweepTimer();
        console.log(
            `✅ Central DB connected: ${centralDb.name} readyState=${centralDb.readyState}`
        );
        return centralModels;
    } catch (error) {
        console.error("❌ Central DB connection error:", error?.message || error);
        throw new ApiErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error?.message || "Database connection failed"
        );
    }
}

export async function getCentralDBModels() {
    if (!centralDb || centralDb.readyState !== 1) {
        return connectMongoDB();
    }
    return centralModels;
}

export async function closeAllMongoConnections() {
    const closes = [];
    if (sweepTimer) {
        clearInterval(sweepTimer);
        sweepTimer = null;
    }
    if (centralDb) {
        closes.push(
            centralDb.close().then(() => {
                console.log("Central DB connection closed");
            })
        );
        centralDb = null;
        centralModels = {};
    }
    for (const [name, ent] of tenantByName) {
        closes.push(
            ent.connection.close().then(() => {
                console.log(`Tenant connection closed: ${name}`);
            })
        );
    }
    tenantByName.clear();
    await Promise.allSettled(closes);
}

const shutdown = async () => {
    await closeAllMongoConnections();
    process.exit(0);
};

for (const sig of /** @type {const} */ (["SIGINT", "SIGTERM"])) {
    process.on(sig, shutdown);
}
