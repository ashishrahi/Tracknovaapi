import { StatusCodes } from "http-status-codes";
import { CityMaster,StateMaster } from "../../modals/index.js";


///////////////////////////////////// AddUpdateCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////

export const AddUpdateCityMasterQuery = async (model) => {
   
  try {


    // Validate CityName
    if (!model.cityName || model.cityName.trim() === '') {
      return {
        isSuccess: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'City Name is required',
      };
    }
    // Validate CityId
    if (!model.cityId || model.cityId == 0) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.BAD_REQUEST, // 400 for invalid input
        message: 'City Id is required',
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
        statusCode: StatusCodes.CREATED,
        message: `${existingCity.CityName} City Successfully Updated`,
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
      });

      await newCity.save();

      return {
        isSuccess: true,
        statusCode: StatusCodes.CREATED, 
        message: `${newCity.CityName} City Successfully Created`,
        data: newCity,
      };
    }
  } catch (error) {
    // Handle specific error cases
    if (error.code === 11000) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.CONFLICT, // 409 for duplicate key
        message: `City Name ${CityName} already exists`,
      };
    }

    // Handle general server errors
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR, // 500 for other errors
      message: error.message,
    };
  }
    
}
////////////////////////////////////////////  GetCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////
    export const GetCityMasterQuery = async (model) =>{
        
          try {
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
                const state = await StateMaster.findOne({ StateID: city.StateId }).lean();
                return {
                  ...city,
                  // StateName: state ? state.StateName : null,
                  
                };
              })
            );
        
        
            return{
                isSuccess:true,
                statusCode: StatusCodes.OK,
                message: `Details of CityId ${model.cityId} and StateId ${model.stateId} retrieved successfully`,
                data: enrichedCities,
  
            }
          } catch (error) {
         return{
          isSuccess: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message,
         }
          }
        
    }

////////////////////////////////////////////// DeleteCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////

export const DeleteCityMasterQuery = async (model) => {

try {
    // Find districts by CityId
    const districts = await CityMaster.find({ CityId: model.cityId }).lean();

    if (districts.length > 0) {
        // Delete districts
        await CityMaster.deleteMany({ CityId: model.cityId });

      return{
          isSuccess: true,
          statusCode: StatusCodes.OK,
          message: `Cities of CityId ${model.cityId} successfully deleted`,
        }
    } else {
        
        return{
          isSuccess: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: `No Citiess found for CityId ${model.cityId}`,
        }
    }
} catch (error) {
  
    return{
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message + ";" + (error.innerException? error.innerException : error.message)
    }
}

      }
    
    
