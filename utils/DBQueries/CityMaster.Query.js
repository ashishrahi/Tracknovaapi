import { StatusCodes } from "http-status-codes";
import { CityMaster,StateMaster } from "../../modals/index.js";


///////////////////////////////////// AddUpdateCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////

export const AddUpdateCityMasterQuery = async (model) => {
   
    const response = {
        isSuccess: false,
        message: '',
        statusCode: 200,
        data: [],
      };
    
      try {
        if (!model.CityName || model.CityName.trim() === '') {
          response.message = 'City Name is Required';
          return response;
        }
    
        if (!model.CityId || model.CityId === 0) {
          response.message = 'City Id is Required';
          return response;
        }
    
        const existingCity = await CityMaster.findOne({ CityId: model.CityId });
    
        if (existingCity) {
          // Update the existing district
          existingCity.CityName = model.CityName || existingCity.CityName;
          existingCity.StateId = model.StateId || existingCity.StateId;
    
          await existingCity.save();
    
          response.isSuccess = true;
          response.message = 'Successfully Updated';
        } else {
          // Generate a new CityId if not provided or invalid
          let tempID = model.CityId;
          if (tempID === -1 || tempID === null || tempID === 0) {
            const maxIdCity = await CityMaster.findOne().sort({ CityId: -1 });
            tempID = maxIdCity ? maxIdCity.CityId + 1 : 1;
          }
    
          // Create a new city document
          const newCity = new CityMaster({
            CityId: tempID,
            CityName: model.CityName,
            StateId: model.StateId,
            CreatedBy: model.CreatedBy,
            UpdatedBy: model.UpdatedBy,
            CreatedOn: model.CreatedOn,
            UpdatedOn: model.UpdatedOn,
          });
    console.log('Newcity',newCity);
          await newCity.save();
    
          response.isSuccess = true;
          response.message = 'Successfully Added';
        }
      } catch (error) {
        if (error.code === 11000) {
          response.message = 'District Name Already Exists';
        } else {
          response.message = error.message || 'An unexpected error occurred';
        }
      }
    
      return response;
    
}
////////////////////////////////////////////  GetCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////
    export const GetCityMasterQuery = async (model) =>{
        
          try {
            const filter = {};
        
            if (model.CityId && model.CityId !== -1) {
              filter.CityId = model.CityId;
            }
        
            if (model.StateId && model.StateId !== -1) {
              filter.StateId = model.StateId;
            }
        
            const cities = await CityMaster.find(filter).lean();
        
            const enrichedCities = await Promise.all(
              cities.map(async (city) => {
                const state = await StateMaster.findOne({ StateID: city.StateId }).lean();
                return {
                  ...city,
                  StateName: state ? state.StateName : null,
                };
              })
            );
        
        
            return{
                isSuccess:'success',
                statusCode: StatusCodes.OK,
                message: `City Details retrieved successfully`,
                data: enrichedCities,
  
            }
          } catch (error) {
            response.message = `${error.message}${error.innerException ? `; ${error.innerException.message}` : ''}`;
          }
        
          return response;
    }

////////////////////////////////////////////// DeleteCityMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////

export const DeleteCityMasterQuery = async (model) => {

          try {
        const districts = await CityMaster.find({ cityId: model.cityId });
    
        if (districts && districts.length > 0) {
          await CityMaster.deleteMany({ cityId: model.cityId });

          return{
            isSuccess:'success',
            statusCode: StatusCodes.OK,
            message: `CityId "${model.cityId}" deleted successfully` };
          }
        else {
          
          return{
            isSuccess:'failed',
            statusCode: StatusCodes.NOT_FOUND,
            message:`City "${model.cityId}" not found!` };
          }
        
      } catch (error) {
        returnData.isSuccess = false;
        returnData.message = error.message || "An unexpected error occurred.";
        return{
            isSuccess:'failed',
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "An unexpected error occurred." };
            
        }
        return returnData;
      }
    
    
