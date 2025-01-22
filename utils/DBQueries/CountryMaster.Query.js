import { StatusCodes } from "http-status-codes";
import { CountryMaster } from "../../modals/index.js";
import { StateMaster } from "../../modals/index.js";
/////////////////////////////// AddUpdateCountryMasterQuery ///////////////////////////////

export const AddUpdateCountryMasterQuery = async (model) => {
 

    try {
        if (!model.CountryName) {
            
      return{
                status: StatusCodes.BAD_REQUEST,
                message: 'Country Name Is Required'
            }
        }

        // Try to find an existing record by CountryId
        const existingCountry = await CountryMaster.findOne({ CountryId: model.CountryId });

        if (existingCountry) {
            // Country exists, so update it
            existingCountry.CountryName = model.CountryName || existingCountry.CountryName;
            existingCountry.CountryCode = model.CountryCode || existingCountry.CountryCode;
            existingCountry.CreatedBy = model.CreatedBy || existingCountry.CreatedBy;
            existingCountry.UpdatedBy = model.UpdatedBy || existingCountry.UpdatedBy;


            // Save the updated record
            await existingCountry.save();
            
            return{
                isSuccess:'success',
                statusCode: StatusCodes.OK,
                message: `${existingCountry.CountryName} Successfully Updated`,
                data: existingCountry
            }
        } else {
            // Country does not exist, so create a new record
            let newCountryId = model.CountryId;

            if (model.CountryId === -1 || !model.CountryId) {
                const lastCountry = await CountryMaster.findOne().sort({ CountryId: -1 }).limit(1);
                newCountryId = lastCountry ? lastCountry.CountryId + 1 : 1;
            }

            // Check for existing CountryName
            const countryNameExists = await CountryMaster.findOne({ CountryName: model.CountryName });
            if (countryNameExists) {
                
             return{
                    isSuccess:'failure',
                    statusCode: StatusCodes.CONFLICT,
                    message: `${countryNameExists.CountryName} Already Exists`,
                    data: countryNameExists
                }
            }

            const newCountry = new CountryMaster({
                CountryId: newCountryId,
                CountryName: model.CountryName,
                CountryCode: model.CountryCode,
                UpdatedBy: model.UpdatedBy || 'Admin',
                CreatedBy: model.CreatedBy || 'Admin',
                CreatedOn: model.CreatedOn || new Date(),
                UpdatedOn: model.UpdatedOn || new Date(),
            });

           const newCountryname = await newCountry.save()
            return {
                    isSuccess:'success',
                    statusCode:StatusCodes.CREATED,
                    message:`${newCountryname.CountryName} has been Added successfully`,
                    data:newCountryname
                }
        }
    } catch (error) {
        response.message = error.message || 'An error occurred';
    }

    return response;
}


//////////////////////////////  GetCountryMasterQuery //////////////////////////////////////////////////

export const GetCountryMasterQuery = async (model) => {
    const { CountryId } = model; 

    try {
        if (CountryId === -1) {
            // Fetch all countries
            const country = await CountryMaster.find({}).lean();
          
            return {
                   isSuccess:'success',
                   statusCode: StatusCodes.OK,
                   message:'Country Data has been fetched successfully',
                   data: country                 
                 };
        } else {
            // Fetch specific country by CountryId
            const country = await CountryMaster.findOne({ CountryId })
            return {
                isSuccess: 'Success',
                statusCode: StatusCodes.OK,
                message:`${country.CountryName} details has been fetched successfully`,
                data:country,

            }
        }
    } catch (error) {
        returnData.IsSuccess = false;
        returnData.Mesg = error.message || "An error occurred.";
    }


}

/////////////////////////////  DeleteCountryQuery  /////////////////////////////////////////////////

export const DeleteCountryQuery = async (model) => {

   
    
      try {
        const stateReference = await StateMaster.findOne({ countryId: model.countryId }).exec();
        if (stateReference) {
          return {
            isSuccess:'success',
            message :`${CountryId} is used in StateMaster of ${stateReference.StateName}, so it can't be deleted.`};
        }
    
        // Find and delete the country
        const countries = await CountryMaster.findOne({ countryId: model.countryId }).exec();
        if (countries && countries.length > 0) {
          await CountryMaster.deleteMany({ countryId: model.countryId });
          return{
            isSuccess:'success',
            message:`${countryId} deleted successfully` };
        } else {
          return{
            isSuccess:'failed',
            message:`"${countryId} not found!` };
        }
        
      } catch (error) {
        returnData.isSuccess = false;
        returnData.mesg = `${error.message}; ${error.stack}`;
      }
    
      return returnData;

}
