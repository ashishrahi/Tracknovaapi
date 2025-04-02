import { signin } from "./auth.controller.js";
import { register, find, switchCompanyDatabase, switchCompanyDatabaseWithDbName} from "./company_manage.controller.js";
import { getCountry } from "./country.controller.js";
import { getState } from "./state.controller.js";

export const v2AuthController = {
    signin: signin
}

export const v2CompanyManageController = {
    register: register,
    find: find,
    switchCompanyDatabase: switchCompanyDatabase,
    switchCompanyDatabaseWithDbName: switchCompanyDatabaseWithDbName,
}

export const v2ContryController = {
    getCountry: getCountry,
    // addUpdateCountry: addUpdateCountry,
}

export const v2StateController = {
    getState: getState
}