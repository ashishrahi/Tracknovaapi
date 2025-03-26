import { registerService, findService, signinService } from "./v2/index.js";


export const v2CompanyManageService = {
    registerService: registerService,
    findService: findService
}

export const v2AuthService = {
    signinService: signinService,
}