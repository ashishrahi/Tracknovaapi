import { StatusCodes } from "http-status-codes";
import { getCentralDBModels } from "../../db/index.js";

export const getCountry = async (model) => {
    try {
      const { CountryMaster } = await getCentralDBModels();
      const { countryId } = model;
  
      if (countryId === -1) {
        // Fetch all countries
        const country = await CountryMaster.find({}).lean();
  
        const countryList = country.map((list) => {
          return {
            countryCode: list.CountryCode,
            countryId: list.CountryId,
            countryName: list.CountryName,
            createdBy: list.CreatedBy,
            updatedBy: list.UpdatedBy,
            createdOn: list.createdAt,
            updatedOn: list.updatedAt,
          };
        });
  
        return {
          isSuccess: true,
          //    internalSuccess:false,
          mesg: "Country Data has been fetched successfully",
          insertedId: "",
          internalSuccess: false,
          data: countryList,
        };
      } else {
        // Fetch specific country by CountryId
        const country = await CountryMaster.findOne({ CountryId: countryId });
  
        const countryDetail = {
          countryCode: country.CountryCode,
          countryId: country.CountryId,
          countryName: country.CountryName,
          createdBy: country.CreatedBy,
          updatedBy: country.UpdatedBy,
          createdOn: country.createdAt,
          updatedOn: country.updatedAt,
        };
  
        return {
          isSuccess: true,
          internalSuccess: false,
          mesg: `Country ${country.CountryName} details has been fetched successfully`,
          insertedId: "",
          data: countryDetail,
        };
      }
    } catch (error) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        mesg: error.message,
      };
    }
  };