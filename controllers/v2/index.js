import { signin, logout, refresh } from "./auth.controller.js";
import { register, find, switchCompanyDatabase, switchCompanyDatabaseWithDbName} from "./company_manage.controller.js";
import { addCountry, getCountry, deleteCountry } from "./country.controller.js";
import { addState, getState, stateList, deleteState } from "./state.controller.js";
import { getCity, addCity, cityList, deleteCity  } from "./city.controller.js";

export const v2AuthController = {
    signin: signin,
    logout: logout,
    refresh: refresh
}

export const v2CompanyManageController = {
    register: register,
    find: find,
    switchCompanyDatabase: switchCompanyDatabase,
    switchCompanyDatabaseWithDbName: switchCompanyDatabaseWithDbName,
}

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