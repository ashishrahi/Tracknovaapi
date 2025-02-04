import { StatusCodes } from 'http-status-codes';
import {FuelType} from '../../modals/index.js'

/////////////////////////// AddUpdateFuelTypeQuery //////////////////////////////////////////////////////////////////

export const AddUpdateFuelTypeQuery = async (model) => {
    try {
      let fuelType;
      
      if (model.FuelTypeId === 0) {
        const maxIdFuelType = await FuelType.findOne().sort({ FuelTypeId: -1 });
        const newFuelTypeId = maxIdFuelType ? maxIdFuelType.FuelTypeId + 1 : 1; // Increment the max fuelTypeId
  
        fuelType = new FuelType({
            FuelTypeId: newFuelTypeId, // Use the incremented value
            FuelTypename: model.FuelTypename || '',
            ShortName: model.ShortName || '',
            FuelCode: model.FuelCode || '',
            CreatedBy: model.CreatedBy || '',
            UpdatedBy: model.UpdatedBy || '',
            CreatedOn: model.CreatedOn || new Date(),
            UpdatedOn: model.UpdatedOn || new Date(),
        });
  
        await fuelType.save();
        return{
          isSuccess:true,
          statusCode: StatusCodes.CREATED,
          message: `FuelTypename ${fuelType.FuelTypename} created successfully`,
          data: fuelType,
        }
      } else {
        fuelType = await FuelType.findOneAndUpdate(
          { FuelTypeId: model.FuelTypeId },
          {
            FuelTypename: model.FuelTypename || '',
            ShortName: model.ShortName || '',
            FuelCode: model.FuelCode || '',
            CreatedBy: model.CreatedBy || '',
            UpdatedBy: model.UpdatedBy || '',
          },
          { new: true, upsert: true } // 'upsert' creates a new document if no match is found
        );
      }
        return {
        isSuccess:true,
        statusCode:StatusCodes.CREATED,
        message: `Fueltype ${fuelType.FuelTypename} saved successfully`,
        data: fuelType,
      };
    } catch (error) {
   
      return{
        isSuccess:false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      }
    }


}

//////////////////////////  GetFuelTypeQuery  //////////////////////////////////////////////////////////////////

export const GetFuelTypeQuery = async (model) => {

  try {

    const filter = {};
    if (model.FuelTypeId && model.FuelTypeId !== 0) {
      filter.FuelTypeId = model.FuelTypeId;
    }
    if (model.FuelTypename) {
      filter.FuelTypename = new RegExp(model.FuelTypename, 'i'); // case insensitive search
    }

    // Query MongoDB
    const fuelTypes = await FuelType.find(filter);

    // Return the result
   
    return {
            isSuccess:true,
            statusCode:StatusCodes.OK,
            message:`fuel type ${filter.FuelTypename} details have been fetched successfully"`,
            data: fuelTypes
  };

  } catch (e) {
 
    return{
      isSuccess:'error',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: e.message,
    }
  }
};

/////////////////////////// DeleteFuelTypeQuery //////////////////////////////////////////////////////////////////

export const DeleteFuelTypeQuery = async (model) => {

    try {
        // Check FuelTypeId value, if it is 0, set it to -1
        const fuelTypeId = model.FuelTypeId === 0 ? -1 : model.FuelTypeId;

        // Find and delete the fuel type document based on FuelTypeId
        const result = await FuelType.findOneAndDelete({ FuelTypeId: fuelTypeId });

        if (!result) {
            return {
              isSuccess:false,
              statusCode:StatusCodes.NOT_FOUND,
              message:`fuel type ${fuelTypeId} not found`,
              data: result
            }
        } else {
             return {
              isSuccess:true,
              statusCode:StatusCodes.OK,
              message:`fuel type ${result.FuelTypename} has been deleted successfully`,
              data: result
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