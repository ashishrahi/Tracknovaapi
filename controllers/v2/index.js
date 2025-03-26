import { signin } from "./auth.controller.js";
import { register, find } from "./company_manage.controller.js";

export const v2AuthController = {
    signin: signin
}

export const v2CompanyManageController = {
    register: register,
    find: find
}