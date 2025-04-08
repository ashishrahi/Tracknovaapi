import { registerService, findService, signinService, switchCompanyWithDbNameService, getCountry, getStatebyCountry, addState,  stateList, deleteState, addCity, cityList, getCitybyState, deleteCity, addCountry, deleteCountry } from "./v2/index.js";

export const v2CompanyManageService = {
    registerService: registerService,
    findService: findService,
    switchCompanyWithDbNameService: switchCompanyWithDbNameService
}

export const v2AuthService = {
    signinService: signinService,
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