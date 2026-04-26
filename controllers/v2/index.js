import {
    signin,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
    tenantLogin,
} from "./auth.controller.js";
import {
    register,
    find,
    remove,
    switchCompanyDatabase,
    switchCompanyDatabaseWithDbName,
    listStats,
    getById,
    updateById,
    getUsage,
    getTenantUsers,
    getTenantVehicles,
    getAuditLogs,
    bulkAction,
} from "./company_manage.controller.js";
import { addCountry, getCountry, deleteCountry } from "./country.controller.js";
import { addState, getState, stateList, deleteState } from "./state.controller.js";
import { getCity, addCity, cityList, deleteCity  } from "./city.controller.js";

export const v2AuthController = {
    signin: signin,
    logout: logout,
    refresh: refresh,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    tenantLogin: tenantLogin,
}

export const v2CompanyManageController = {
    register: register,
    find: find,
    remove: remove,
    switchCompanyDatabase: switchCompanyDatabase,
    switchCompanyDatabaseWithDbName: switchCompanyDatabaseWithDbName,
    listStats: listStats,
    getById: getById,
    updateById: updateById,
    getUsage: getUsage,
    getTenantUsers: getTenantUsers,
    getTenantVehicles: getTenantVehicles,
    getAuditLogs: getAuditLogs,
    bulkAction: bulkAction,
};

export const v2ContryController = {
    addCountry:addCountry,
    getCountry: getCountry,
    deleteCountry: deleteCountry
    // addUpdateCountry: addUpdateCountry,
}

export const v2StateController = {

    addState: addState,
    getState: getState,
    stateList : stateList,
    deleteState : deleteState
}

export const v2CityController = {
    addCity: addCity,
    cityList : cityList,
    getCity: getCity,
    deleteCity : deleteCity
}