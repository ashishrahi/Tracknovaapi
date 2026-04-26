import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";
import {validateCountryMaster} from "../validation/countryMasterValidator.js"
import { SUCCESS, ERROR } from "../messages/message.js";

/////////////////////////////// AddUpdateCountryMasterQuery ///////////////////////////////

export const AddUpdateCountryMasterQuery = async (model) => {
  try {
      //  Validation By JOI
        const{error} = validateCountryMaster(model)
      // Error Handling by JOI
        if (error) {
          return{
            isSuccess: false,
            internalSuccess: false,
            mesg: error.details[0].message,
          }
        }


    const { CountryMaster } = await getTenantDBModels();
    

    // Try to find an existing record by CountryId
    const existingCountry = await CountryMaster.findOne({
      CountryId: model.countryId,
    });

    if (existingCountry) {
      // Country exists, so update it
      existingCountry.CountryName =
        model.countryName || existingCountry.CountryName;
      existingCountry.CountryCode =
        model.countryCode || existingCountry.CountryCode;
      existingCountry.CreatedBy = model.createdBy || existingCountry.CreatedBy;
      existingCountry.UpdatedBy = model.updatedBy || existingCountry.UpdatedBy;

      // Save the updated record
      await existingCountry.save();

      const updatedCountry = {
        countryId: existingCountry.CountryId,
        countryName: existingCountry.CountryName,
        countryCode: existingCountry.CountryCode,
        updatedBy: existingCountry.UpdatedBy,
        createdBy: existingCountry.CreatedBy,
      };
       
      return {
        isSuccess: true,
        internalSuccess: false,
        mesg: SUCCESS.UPDATE("country"),
        insertedId: "",
        data: updatedCountry,
      };
    } else {
      // Country does not exist, so create a new record
      let newCountryId = model.countryId;

      if (model.countryId === -1 || !model.countryId) {
        const lastCountry = await CountryMaster.findOne()
          .sort({ CountryId: -1 })
          .limit(1);
        newCountryId = lastCountry ? lastCountry.CountryId + 1 : 1;
      }

      // Check for existing CountryName
      const countryNameExists = await CountryMaster.findOne({
        CountryName: model.countryName,
      });
      if (countryNameExists) {
        return {
          isSuccess: false,
          internalSuccess: "true",
          mesg: ERROR.ALREADY_EXISTS_WITH_NAME("country",countryNameExists.CountryName),
          insertedId: "",
          data: countryNameExists,
        };
      }

      const newCountry = new CountryMaster({
        CountryId: newCountryId,
        CountryName: model.countryName,
        CountryCode: model.countryCode,
        UpdatedBy: model.updatedBy || "Admin",
        CreatedBy: model.createdBy || "Admin",
      });

      await newCountry.save();

      const newCountryname = {
        countryId: newCountry.CountryId,
        countryName: newCountry.CountryName,
        countryCode: newCountry.CountryCode,
        updatedBy: newCountry.UpdatedBy,
        createdBy: newCountry.CreatedBy,
      };

      return {
        isSuccess: true,
        internalSuccess: false,
        mesg: SUCCESS.CREATE_WITH_NAME("country",newCountryname.countryName),
        insertedId: "",
        data: newCountryname,
      };
    }
  } catch (error) {
    if (error.code === 11000) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.BAD_REQUEST,
        mesg: ERROR.ALREADY_EXISTS("country"),
      };
    }
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};

///////////////////////////// ImportCountriesQuery ///////////////////////////////

export const ImportCountriesQuery = async (model) => {
  try {
    const { CountryMaster } = await getTenantDBModels();

    let inserted = 0;
    let skipped = 0;

    for (const country of model) {
      // Check if a country with the same CountryName already exists
      const existing = await CountryMaster.findOne({ CountryName: country.countryName });

      if (existing) {
        skipped++;
        continue;
      }

      // Find last CountryId and increment
      const lastCountry = await CountryMaster.findOne().sort({ CountryId: -1 }).limit(1);
      const nextCountryId = lastCountry ? lastCountry.CountryId + 1 : 1;

      // Insert new country with mapped fields
      await CountryMaster.create({
        CountryId: nextCountryId,
        CountryName: country.countryName,
        CountryCode: country.countryCode,
      });

      inserted++;
    }

    return {
      isSuccess: true,
      mesg: SUCCESS.FETCH_ALL("countries"),
      inserted,
      skipped,
    };

  } catch (error) {
    console.error("CSV Import Failed:", error.message);
    return {
      isSuccess: false,
      statusCode: 500,
      mesg: error.message,
    };
  }
};




//////////////////////////////  GetCountryMasterQuery //////////////////////////////////////////////////

export const GetCountryMasterQuery = async (model) => {
  try {
    const { CountryMaster } = await getTenantDBModels();
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
        internalSuccess: false,
        mesg: SUCCESS.FETCH_ALL("countries"),
        insertedId: "",
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
        mesg: SUCCESS.FETCH_ONE_WITH_NAME("country",countryDetail.countryName),
        insertedId: "",
        data: countryDetail,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: false,
      mesg: error.message,
    };
  }
};

/////////////////////////////  DeleteCountryQuery  /////////////////////////////////////////////////

export const DeleteCountryQuery = async (countryId) => {
  try {
    const { StateMaster, CountryMaster } = await getTenantDBModels();

    // const { countryId } = model;
    // console.log(countryId)

    // Check if the country is referenced in StateMaster
    const stateReference = await StateMaster.findOne({
      CountryId: countryId,
    }).exec();
    if (stateReference) {
      return {
        isSuccess: true,
        internalSuccess: false,
        mesg: `${countryId} is used in StateMaster of ${stateReference.StateName}, so it can't be deleted.`,
      };
    }

    // Find the country
    const country = await CountryMaster.findOne({
      CountryId: countryId,
    }).exec();
    if (country) {
      await CountryMaster.deleteOne({ CountryId: countryId });
      return {
        isSuccess: true,
        internalSuccess: true,
        mesg: SUCCESS.DELETE_WITH_NAME("country",country.CountryName),
      };
    } else {
      return {
        isSuccess: false,
        internalSuccess: false,
        mesg: ERROR.NOT_FOUND("country"),
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};
