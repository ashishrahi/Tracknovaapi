import { StatusCodes } from "http-status-codes";
import { CountryMaster } from "../../modals/index.js";
import { StateMaster } from "../../modals/index.js";
/////////////////////////////// AddUpdateCountryMasterQuery ///////////////////////////////

export const AddUpdateCountryMasterQuery = async (model) => {
 

    try {
        if (!model.countryName) {
            
      return{
                isSuccess: true,
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Country Name Is Required'
            }
        }

        // Try to find an existing record by CountryId
        const existingCountry = await CountryMaster.findOne({ CountryId: model.countryId });

        if (existingCountry) {
            // Country exists, so update it
            existingCountry.CountryName = model.countryName || existingCountry.CountryName;
            existingCountry.CountryCode = model.countryCode || existingCountry.CountryCode;
            existingCountry.CreatedBy = model.createdBy || existingCountry.CreatedBy;
            existingCountry.UpdatedBy = model.updatedBy || existingCountry.UpdatedBy;


            // Save the updated record
            await existingCountry.save();
            
            return{
                isSuccess:true,
                statusCode: StatusCodes.OK,
                message: `${existingCountry.CountryName} Successfully Updated`,
                data: existingCountry
            }
        } else {
            // Country does not exist, so create a new record
            let newCountryId = model.countryId;

            if (model.countryId === -1 || !model.countryId) {
                const lastCountry = await CountryMaster.findOne().sort({ CountryId: -1 }).limit(1);
                newCountryId = lastCountry ? lastCountry.CountryId + 1 : 1;
            }

            // Check for existing CountryName
            const countryNameExists = await CountryMaster.findOne({ CountryName: model.countryName });
            if (countryNameExists) {
                
             return{
                    isSuccess:false,
                    statusCode: StatusCodes.CONFLICT,
                    message: `${countryNameExists.CountryName} Already Exists`,
                    data: countryNameExists
                }
            }

            const newCountry = new CountryMaster({
                CountryId: newCountryId,
                CountryName: model.countryName,
                CountryCode: model.countryCode,
                UpdatedBy: model.updatedBy || 'Admin',
                CreatedBy: model.createdBy || 'Admin',
            });

           const newCountryname = await newCountry.save()
            return {
                    isSuccess:true,
                    statusCode:StatusCodes.CREATED,
                    message:`${newCountryname.CountryName} has been Added successfully`,
                    data:newCountryname
                }
        }
    } catch (error) {
        return{
            isSuccess:false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        }
    }

}


//////////////////////////////  GetCountryMasterQuery //////////////////////////////////////////////////

export const GetCountryMasterQuery = async (model) => {
    const { countryId } = model; 

    try {
        if (countryId === -1) {
            // Fetch all countries
            const country = await CountryMaster.find({}).lean();
          
            return {
                   isSuccess:true,
                   statusCode: StatusCodes.OK,
                   message:'Country Data has been fetched successfully',
                   data: country                 
                 };
        } else {
            // Fetch specific country by CountryId
            const country = await CountryMaster.findOne({ CountryId:countryId })
            return {
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message:`${country.CountryName} details has been fetched successfully`,
                data:country,

            }
        }
    } catch (error) {
        return{
            isSuccess:false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        }
    }}

/////////////////////////////  DeleteCountryQuery  /////////////////////////////////////////////////

export const DeleteCountryQuery = async (model) => {

   
    
      try {
        const stateReference = await StateMaster.findOne({ CountryId: model.countryId }).exec();
        if (stateReference) {
          return {
            isSuccess:true,
            statusCode: StatusCodes.CONFLICT,
            message : `${CountryId} is used in StateMaster of ${stateReference.StateName}, so it can't be deleted.`};
        }
    
        // Find and delete the country
        const countries = await CountryMaster.findOne({ CountryId: model.countryId }).exec();
        if (countries && countries.length > 0) {
          await CountryMaster.deleteMany({ CountryId: model.countryId });
          return{
            isSuccess:true,
            statusCode:StatusCodes.OK,
            message:`${countryId} deleted successfully` };
        } else {
          return{
            isSuccess:false,
            statusCode: StatusCodes.NOT_FOUND,
            message:`"${countryId} not found!` };
        }
        
      } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
            data: error.stack,
        }
      }
    

}
