import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";

/////////////////////////// AddUpdateFuelTypeQuery //////////////////////////////////////////////////////////////////

export const AddUpdateFuelTypeQuery = async (model) => {
  try {
    const { FuelType } = await getTenantDBModels();
    let fuelType;
    let data;

    if (!model.fuelTypeId || model.fuelTypeId === 0) {
      // Get the highest FuelTypeId
      const maxIdFuelType = await FuelType.findOne().sort({ FuelTypeId: -1 });
      const newFuelTypeId = maxIdFuelType ? maxIdFuelType.FuelTypeId + 1 : 1;

      fuelType = new FuelType({
        FuelTypeId: newFuelTypeId,
        FuelTypename: model.fuelTypename,
        ShortName: model.shortName,
        FuelCode: model.fuelCode,
        CreatedBy: model.createdBy,
        UpdatedBy: model.updatedBy,
      });

      const newData = await fuelType.save();

      data = {
        fuelTypeId: newData.FuelTypeId,
        fuelTypename: newData.FuelTypename,
        shortName: newData.ShortName,
        fuelCode: newData.FuelCode,
        createdBy: newData.CreatedBy,
        updatedBy: newData.UpdatedBy,
      };

      return {
        isSuccess: 1,
        id: data.fuelTypeId,
        createUpdate: "Created",
        msg: `Fuel type '${newData.FuelTypename}' created successfully.`,
        data,
      };
    } else {
      // Update existing record
      fuelType = await FuelType.findOneAndUpdate(
        { FuelTypeId: model.fuelTypeId },
        {
          FuelTypename: model.fuelTypename,
          ShortName: model.shortName,
          FuelCode: model.fuelCode,
          UpdatedBy: model.updatedBy, // `CreatedBy` should not change on update
        },
        { new: true }
      );

      if (!fuelType) {
        return {
          isSuccess: 0,
          message: `Fuel type with ID ${model.fuelTypeId} not found.`,
        };
      }

      data = {
        fuelTypeId: fuelType.FuelTypeId,
        fuelTypename: fuelType.FuelTypename,
        shortName: fuelType.ShortName,
        fuelCode: fuelType.FuelCode,
        createdBy: fuelType.CreatedBy,
        updatedBy: fuelType.UpdatedBy,
      };

      return {
        isSuccess: 1,
        statusCode: StatusCodes.OK,
        msg: `Fuel type '${fuelType.FuelTypename}' updated successfully.`,
        data,
      };
    }
  } catch (error) {
    return {
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: error.message,
    };
  }
};

/////////////////////////// ImportFuelTypeQuery //////////////////////////////////////////////////////////////////

export const ImportFuelTypeQuery = async (model) => {

  try {
    const { FuelType } = await getTenantDBModels();
    let inserted = 0;
    let skipped = 0;
    for (const fueltype of model) {
      const {fueltypeName, fuelCode, fuelShortname,} = fueltype
      const existing = await FuelType.findOne({FuelTypename:fueltypeName})
      if (existing) {
        skipped++;
        continue;
      }
      const lastFuelId = await FuelType.findOne().sort({FuelTypeId:-1}).limit(1)
      const nextFuelId = lastFuelId ? lastFuelId.FuelTypeId + 1 : 1
      await FuelType.create({
        FuelTypeId:nextFuelId,
        FuelTypename:fueltypeName,
        ShortName:fuelShortname,
        FuelCode:fuelCode,
      })
      inserted++
    }
    return {
      isSuccess: true,
      mesg: `CSV ${inserted} data import successfully`,
      inserted,
      skipped,
    };
  
  
  } catch (error) {
    console.error('error:',error)
    return {
      isSuccess: false,
      statusCode: 500,
      msg: error.message,
    };
  }
}

//////////////////////////  GetFuelTypeQuery  //////////////////////////////////////////////////////////////////

export const GetFuelTypeQuery = async (model) => {
  try {
    const { FuelType } = await getTenantDBModels();

    if (!model || typeof model !== "object") {
      throw new Error("Invalid input: model should be an object");
    }

    const filter = {};
    if (model.fuelTypeId !== -1) {
      filter.FuelTypeId = model.fuelTypeId;
    }
    if (model.fuelTypename) {
      filter.FuelTypename = new RegExp(model.fuelTypename, "i"); // Case-insensitive search
    }

    // Query MongoDB
    const fuelTypes = await FuelType.find(filter);

    // Transform data to expected format
    const transformedFuelTypes = fuelTypes.map((item) => ({
      fuelTypeId: item.FuelTypeId,
      fuelTypename: item.FuelTypename,
      shortName: item.ShortName,
      fuelCode: item.FuelCode,
      createdBy: item.CreatedBy,
      updatedBy: item.UpdatedBy,
    }));

    return {
      status: 1,
      message: `Fuel type details have been fetched successfully.`,
      data: transformedFuelTypes,
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

export const DeleteFuelTypeQuery = async (fuelTypeId) => {
  try {
    const { FuelType } = await getTenantDBModels();
    console.log("fuelTypeId",fuelTypeId)
    // Check FuelTypeId value, if it is 0, set it to -1
    // const fuelTypeId = model.fuelTypeId === 0 ? -1 : model.fuelTypeId;

    // Find and delete the fuel type document based on FuelTypeId
    const result = await FuelType.findOneAndDelete({ FuelTypeId: fuelTypeId });
    console.log('result:',result)

    if (!result) {
      return {
        isSuccess: 0,
        id,
        msg: `fuel type ${fuelTypeId} not found`,
      };
    } else {
      return {
        isSuccess: 1,
        id: fuelTypeId,
        msg: `fuelTypeId ${result.FuelTypename} has been deleted successfully`,
      };
    }
  } catch (error) {
    return {
      isSuccess: 0,
      msg: error.message,
    };
  }
};
