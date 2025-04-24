import { StatusCodes } from "http-status-codes";
import { CityMaster, StateMaster } from "../../modals/index.js";
import { getTenantDBModels } from "../../db/index.js";

///////////////////////////////////// AddUpdateCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////

export const AddUpdateCityMasterQuery = async (model) => {
  try {
    const { CityMaster } = await getTenantDBModels();

    // Validate CityName
    if (!model.cityName || model.cityName.trim() === "") {
      return {
        isSuccess: false,
        internalSuccess: "",
        mesg: "City Name is required",
      };
    }
    // Validate CityId
    if (!model.cityId || model.cityId == 0) {
      return {
        isSuccess: false,
        internalSuccess: "",
        mesg: "City Id is required",
      };
    }

    // Check if the city already exists
    const existingCity = await CityMaster.findOne({ CityId: model.cityId });

    if (existingCity) {
      // Update the existing city
      existingCity.CityName = model.cityName || existingCity.CityName;
      existingCity.StateId = model.stateId || existingCity.StateId;
      existingCity.UpdatedBy = model.updatedBy;

      await existingCity.save();

      return {
        isSuccess: true,
        internalSuccess: "",
        mesg: `${existingCity.CityName} City Updated Successfully `,
        data: existingCity,
      };
    } else {
      let tempID = model.cityId;
      if (tempID === -1 || tempID === null || tempID === 0) {
        const maxIdCity = await CityMaster.findOne().sort({ CityId: -1 });
        tempID = maxIdCity ? maxIdCity.CityId + 1 : 1;
      }

      // Create a new city document
      const newCity = new CityMaster({
        CityId: tempID,
        CityName: model.cityName,
        StateId: model.stateId,
        CreatedBy: model.createdBy,
        UpdatedBy: model.updatedBy,
        CreatedOn: model.createdAt,
        UpdatedOn: model.updatedAt,
      });

      await newCity.save();

      const newCityList = {
        cityId: newCity.CityId,
        cityName: newCity.CityName,
        stateId: newCity.StateId,
        createdBy: newCity.CreatedBy,
        updatedBy: newCity.UpdatedBy,
        createdOn: newCity.createdAt,
        updatedOn: newCity.updatedAt,
      };

      return {
        isSuccess: true,
        internalSuccess: "",
        mesg: `${newCityList.cityName} City Created Successfully `,
        insertedId: "",
        data: newCityList,
      };
    }
  } catch (error) {
    // Handle specific error cases
    if (error.code === 11000) {
      return {
        isSuccess: false,
        internalSuccess: "",
        mesg: `City Name ${CityName} already exists`,
      };
    }

    // Handle general server errors
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR, // 500 for other errors
      mesg: error.message,
    };
  }
};

///////////////////////////////////// AddUpdateCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////


export const ImportCitiesQuery = async (model) => {
  try {
    const { StateMaster,CityMaster } = await getTenantDBModels();
    let inserted = 0;
    let skipped = 0;

    if (!Array.isArray(model) || model.length === 0) {
      throw new Error("Invalid input: model must be a non-empty array.");
    }

    for (const city of model) {
      const { cityName, stateName, createdBy, updatedBy } = city;

      if (!cityName || !stateName) {
        skipped++;
        continue;
      }

      // Check for existing state
      const existing = await CityMaster.findOne({ CityName: cityName });
      if (existing) {
        skipped++;
        continue;
      }

        // Find State ID
        const state = await StateMaster.findOne({ StateName: stateName });
        if (!state) {
          skipped++;
          continue;
        }

      // Get next StateId
      const lastCity = await CityMaster.findOne().sort({ StateId: -1 }).limit(1);
      const nextCityId = lastCity ? lastCity.CityId + 1 : 1;

      await CityMaster.create({
        CityId: nextCityId,
        CityName:city.cityName,
        StateId: state.StateId,
        CreatedBy: createdBy || null,
        UpdatedBy: updatedBy || null,
      });

      inserted++;
    }

    return {
      isSuccess: true,
      mesg: `CSV import successful`,
      inserted,
      skipped,
    };
  } catch (error) {
    console.error("CSV Import Failed:", error);
    return {
      isSuccess: false,
      statusCode: 500,
      mesg: error.message,
    };
  }
}


///////////////////////////////////// AddUpdateCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////

export const GetCitiesByStateQuery = async (model) => {
  try {
    const { CityMaster } = await getTenantDBModels();

    const { StateId } = model;
    // console.log("StateId",StateId)
    const cityList = await CityMaster.find({ StateId: StateId });
    // const newCityList = cityList.map((city)=>city.CityName)

    return {
      isSuccess: true,
      internalSuccess: "",
      mesg: "States fetched successfully",
      insertedId: "",
      data: cityList,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};

////////////////////////////////////////////  GetCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////

export const GetCityMasterQuery = async (model) => {
  try {
    const { CityMaster, StateMaster } = await getTenantDBModels();

    const filter = {};

    if (model.cityId && model.cityId !== -1) {
      filter.CityId = model.cityId;
    }

    if (model.stateId && model.stateId !== -1) {
      filter.StateId = model.stateId;
    }

    const cities = await CityMaster.find(filter).lean();

    const enrichedCities = await Promise.all(
      cities.map(async (city) => {
        const state = await StateMaster.findOne({
          StateId: city.StateId,
        }).lean();
        // console.log('state:',state)
        return {
          ...city,
          StateName: state ? state.StateName : null,
        };
      })
    );
    // console.log('enrichedCities:',enrichedCities)
    const listCities = enrichedCities.map((city) => {
      return {
        cityId: city.CityId,
        cityName: city.CityName,
        stateName: city.StateName,
        createdBy: city.CreatedBy,
        updatedBy: city.UpdatedBy,
        createdOn: city.createdAt,
        updatedOn: city.updatedAt,
      };
    });

    return {
      isSuccess: true,
      internalSuccess: "",
      mesg: `Details of CityId ${model.cityId} and StateId ${model.stateId} retrieved successfully`,
      insertedId: "",
      data: listCities,
    };
  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: "",
      mesg: error.message,
    };
  }
};

////////////////////////////////////////////// DeleteCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////

export const DeleteCityMasterQuery = async (model) => {
  try {
    const { CityMaster } = await getTenantDBModels();

    // Find districts by CityId
    const districts = await CityMaster.find({ CityId: model.cityId }).lean();

    if (districts.length > 0) {
      // Delete districts
      await CityMaster.deleteMany({ CityId: model.cityId });

      return {
        isSuccess: true,
        internalSuccess: "",
        mesg: `CityId ${model.cityId} Of Cities successfully deleted`,
      };
    } else {
      return {
        isSuccess: false,
        internalSuccess: "",
        mesg: `No Citiess found for CityId ${model.cityId}`,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg:
        error.message +
        ";" +
        (error.innerException ? error.innerException : error.message),
    };
  }
};
