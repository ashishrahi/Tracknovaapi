import { probWireTamp, getVehicleNotMoved, sample, SmpCurr, Geofence, NTCurrent, VehCurrStat, GetDashData,GetNTDashboard, GetTopFuelCons, GetTopFuelConsNT, GetTopFuelConsNTOnOff, GetRunningStatus, GetLongIdleVeh, GetVehicleMovement } from "./NTRead.controller.js";
import { getVehicleDistance } from "./Dashboard.controller.js";
import { GetCommGroup, UpsertCommGroup, DeleteCommGroup, GetCommGroupByEmpId, GetAllEmailSetting, UpsertEmailSetting, GetAllSmsSetting, GetCampaignDetailById, GetCampaign, UpsertCampaign, DeleteCampaign, GetCampaignTemplate, UpsertCampaignTemplate, DeleteCampaignTemplate, GetEventSetting, UpsertEventSetting, DeleteEventSetting, GetMasters, UpsertSmsSetting } from "./Comm.controller.js";
import { AddUpdateItemCategory, GetItemCategory, DeleteItemCategory } from "./ItemCategory.controller.js"
import { AddUpdateItemMaster, GetItemMaster, DeleteItemMaster } from "./ItemMaster.controller.js";
import { AddUpdateItemTypeMaster, GetItemTypeMaster, DeleteItemTypeMaster } from "./ItemTypeMaster.controller.js";
import { GetMapVehicleData } from "./MapVehicleData.controller.js"
import { AddUpdateNewNodeMaster} from "./NewNodeMaster.controller.js"
import { AddUpdateNodePermission } from "./NodePermission.controller.js";
import { AddUpdateVehicleAuditInfo, GetVehicleAuditInfo, DeleteVehicleAuditInfo } from "./VehicleAuditInfo.controller.js"
import { VehicleFuelDateRange } from "./VehicleFuelDateRange.controller.js"
import { VehicleTrack } from "./VehicleMoving.controller.js";
import { AddUpdateVehicleType, GetVehicleType, DeleteVehicleType } from "./VehicleType.controller.js";


export const NTReadController = {
    probWireTamp: probWireTamp,
    getVehicleNotMoved: getVehicleNotMoved,
    sample: sample,
    SmpCurr: SmpCurr,
    Geofence: Geofence, 
    NTCurrent: NTCurrent,
    VehCurrStat: VehCurrStat,
    GetDashData: GetDashData,
    GetNTDashboard: GetNTDashboard,
    GetTopFuelCons: GetTopFuelCons,
    GetTopFuelConsNT: GetTopFuelConsNT,
    GetTopFuelConsNTOnOff: GetTopFuelConsNTOnOff,
    GetRunningStatus: GetRunningStatus,
    GetLongIdleVeh: GetLongIdleVeh,
    GetVehicleMovement: GetVehicleMovement


}

export const DashboardController = {
    getVehicleDistance: getVehicleDistance,
}

export const CommController = {
    GetCommGroup: GetCommGroup,
    UpsertCommGroup: UpsertCommGroup,
    DeleteCommGroup: DeleteCommGroup,
    GetCommGroupByEmpId: GetCommGroupByEmpId,
    GetAllEmailSetting: GetAllEmailSetting,
    UpsertEmailSetting: UpsertEmailSetting,
    GetAllSmsSetting: GetAllSmsSetting,
    GetCampaignDetailById: GetCampaignDetailById,
    GetCampaign: GetCampaign,
    UpsertCampaign: UpsertCampaign,
    DeleteCampaign: DeleteCampaign,
    GetCampaignTemplate: GetCampaignTemplate,
    UpsertCampaignTemplate: UpsertCampaignTemplate,
    DeleteCampaignTemplate: DeleteCampaignTemplate,
    GetEventSetting: GetEventSetting,
    UpsertEventSetting: UpsertEventSetting,
    DeleteEventSetting: DeleteEventSetting,
    GetMasters: GetMasters,
    UpsertSmsSetting: UpsertSmsSetting
}

export const ItemCategoryController = {
    AddUpdateItemCategory: AddUpdateItemCategory,
    GetItemCategory: GetItemCategory,
    DeleteItemCategory: DeleteItemCategory
}

export const ItemMasterController = {
    AddUpdateItemMaster: AddUpdateItemMaster,
    GetItemMaster: GetItemMaster,
    DeleteItemMaster: DeleteItemMaster
}

export const ItemTypeMasterController = {
    AddUpdateItemTypeMaster: AddUpdateItemTypeMaster,
    GetItemTypeMaster: GetItemTypeMaster,
    DeleteItemTypeMaster: DeleteItemTypeMaster
}

export const MapVehicleDataController = {
    GetMapVehicleData: GetMapVehicleData
}

export const NewNodeMasterController = {
    AddUpdateNewNodeMaster: AddUpdateNewNodeMaster
}

export const NodePermissionController = {
    AddUpdateNodePermission: AddUpdateNodePermission
}

export const VehicleAuditInfoController = {
    AddUpdateVehicleAuditInfo: AddUpdateVehicleAuditInfo,
    GetVehicleAuditInfo: GetVehicleAuditInfo,
    DeleteVehicleAuditInfo: DeleteVehicleAuditInfo
}

export const VehicleFuelDateRangeController = {
    VehicleFuelDateRange: VehicleFuelDateRange
}

export const VehicleMovingController = {
    VehicleTrack: VehicleTrack
}

export const VehicleTypeController = {
    AddUpdateVehicleType: AddUpdateVehicleType,
    GetVehicleType: GetVehicleType,
    DeleteVehicleType: DeleteVehicleType
}
