import { registerService, findService, signinService, switchCompanyWithDbNameService, getCountry, getStatebyCountry, getCitybyState } from "./v2/index.js";


export const v2CompanyManageService = {
    registerService: registerService,
    findService: findService,
    switchCompanyWithDbNameService: switchCompanyWithDbNameService
}

export const v2AuthService = {
    signinService: signinService,
}

export const v2CountryService = {
    getCountry: getCountry
}

export const v2StateService = {
    getStatebyCountry: getStatebyCountry
}

export const v2CityService = {
    getCitybyState: getCitybyState
}