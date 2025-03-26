import { signup } from "./auth.controller.js";
import { register } from "./company_manage.controller.js";

export const v2AuthController = {
    signup: signup
}

export const v2CompanyManageController = {
    register: register
}