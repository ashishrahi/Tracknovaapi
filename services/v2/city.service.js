import { StatusCodes } from "http-status-codes";
import { getCentralDBModels } from "../../db/index.js";

// AddCity

export const addCity = async (model) => {
     try {
        const { CityMaster } = await getCentralDBModels();
        console.log('model:',model)
    
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
            message: `${existingCity.CityName} City Updated Successfully `,
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
            message: `${newCityList.cityName} City Created Successfully `,
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
}

// GetCityByState
export const getCitybyState = async (stateId) => {
  try {
    const { CityMaster } = await getCentralDBModels();


    const stateList = await CityMaster.find({StateId: stateId})
    //  const newList = stateList.map((statename)=>statename.StateName)
    return {
      isSuccess: true,
      internalSuccess: "",
      mesg: "City fetched successfully",
      insertedId: "",
      data: stateList,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};

// cityList
export const cityList = async (model) => {
  try {
      const { CityMaster, StateMaster } = await getCentralDBModels();
  
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

} 

// deleteCity
export const deleteCity = async (model) => {
   try {
      const { CityMaster } = await getCentralDBModels();
  
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
}
 

