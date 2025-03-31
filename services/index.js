import { registerService, findService, signinService, switchCompanyWithDbNameService } from "./v2/index.js";


export const v2CompanyManageService = {
    registerService: registerService,
    findService: findService,
    switchCompanyWithDbNameService: switchCompanyWithDbNameService
}

export const v2AuthService = {
    signinService: signinService,
}