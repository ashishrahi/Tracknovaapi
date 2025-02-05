import { StatusCodes } from 'http-status-codes';
import {FuelType} from '../../modals/index.js'

/////////////////////////// AddUpdateFuelTypeQuery //////////////////////////////////////////////////////////////////

export const AddUpdateFuelTypeQuery = async (model) => {
    try {
      let fuelType;
      
      if (model.fuelTypeId === 0) {
        const maxIdFuelType = await FuelType.findOne().sort({ FuelTypeId: -1 });
        const newFuelTypeId = maxIdFuelType ? maxIdFuelType.FuelTypeId + 1 : 1; // Increment the max fuelTypeId
  
        fuelType = new FuelType({
            FuelTypeId: newFuelTypeId, // Use the incremented value
            FuelTypename: model.fuelTypename || '',
            ShortName: model.shortName || '',
            FuelCode: model.fuelCode || '',
            CreatedBy: model.createdBy || '',
            UpdatedBy: model.updatedBy || '',
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
          { FuelTypeId: model.fuelTypeId },
          {
            FuelTypename: model.fuelTypename || '',
            ShortName: model.shortName || '',
            FuelCode: model.fuelCode || '',
            CreatedBy: model.createdBy || '',
            UpdatedBy: model.updatedBy || '',
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
    if (!model || typeof model !== 'object') {
      throw new Error('Invalid input: model should be an object');
    }

    const filter = {};
    if (model.fuelTypeId && model.fuelTypeId !== 0) {
      filter.FuelTypeId = model.fuelTypeId;
    }
    if (model.fuelTypename) {
      filter.FuelTypename = new RegExp(model.fuelTypename, 'i'); // Case-insensitive search
    }

    // Query MongoDB
    const fuelTypes = await FuelType.find(filter);

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: `Fuel type details have been fetched successfully.`,
      data: fuelTypes,
    };
  } catch (e) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: e.message,
    };
  }
};

/////////////////////////// DeleteFuelTypeQuery //////////////////////////////////////////////////////////////////

export const DeleteFuelTypeQuery = async (model) => {

    try {
        // Check FuelTypeId value, if it is 0, set it to -1
        const fuelTypeId = model.fuelTypeId === 0 ? -1 : model.fuelTypeId;

        // Find and delete the fuel type document based on FuelTypeId
        const result = await FuelType.findOneAndDelete({ FuelTypeId: fuelTypeId });

        if (!result) {
            return {
              isSuccess:false,
              statusCode:StatusCodes.NOT_FOUND,
              message:`fuel type ${fuelTypeId} not found`,
            }
        } else {
             return {
              isSuccess:true,
              statusCode:StatusCodes.OK,
              message:`fuelTypeId ${result.FuelTypename} has been deleted successfully`,
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