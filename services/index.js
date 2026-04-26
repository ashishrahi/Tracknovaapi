import {
    registerService,
    findService,
    deleteCompanyByIdService,
    updateCompanyByIdService,
    signinService,
    switchCompanyWithDbNameService,
    getCountry,
    getStatebyCountry,
    addState,
    stateList,
    deleteState,
    addCity,
    cityList,
    getCitybyState,
    deleteCity,
    addCountry,
    deleteCountry,
    refreshService,
    findCompaniesPaginatedService,
    getCompanyListStatsService,
    getCompanyByIdService,
    getTenantUsageSnapshotService,
    getTenantUsersPageService,
    getTenantVehiclesPageService,
    getCompanyAuditLogPageService,
    bulkCompanyActionService,
    processSubscriptionExpiryService,
    logCompanyAuditEntry,
} from "./v2/index.js";

export const v2CompanyManageService = {
    registerService: registerService,
    findService: findService,
    deleteCompanyByIdService: deleteCompanyByIdService,
    updateCompanyByIdService: updateCompanyByIdService,
    switchCompanyWithDbNameService: switchCompanyWithDbNameService,
    findCompaniesPaginatedService: findCompaniesPaginatedService,
    getCompanyListStatsService: getCompanyListStatsService,
    getCompanyByIdService: getCompanyByIdService,
    getTenantUsageSnapshotService: getTenantUsageSnapshotService,
    getTenantUsersPageService: getTenantUsersPageService,
    getTenantVehiclesPageService: getTenantVehiclesPageService,
    getCompanyAuditLogPageService: getCompanyAuditLogPageService,
    bulkCompanyActionService: bulkCompanyActionService,
    processSubscriptionExpiryService: processSubscriptionExpiryService,
    logCompanyAuditEntry: logCompanyAuditEntry,
};

export const v2AuthService = {
    signinService: signinService,
    refreshService: refreshService
}

export const v2CountryService = {  
    addCountry:addCountry,
    getCountry: getCountry,
    deleteCountry: deleteCountry
}

export const v2StateService = {
    addState : addState,
    getStatebyCountry: getStatebyCountry,
    stateList : stateList,
    deleteState : deleteState
}

export const v2CityService = {
    addCity:addCity,
    cityList : cityList,
    getCitybyState: getCitybyState,
    deleteCity: deleteCity
}