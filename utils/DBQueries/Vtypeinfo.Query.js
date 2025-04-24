import { model } from "mongoose";
import { VehicleTypeMaster, ItemMaster, VehicleTypeChild, NT } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";

//////////////////////////////////////////////// AddUpdateVtypeinfoQuery /////////////////////////////////////////////////////

export const AddUpdateVtypeinfoQuery = async (modal) => {

  try {
    const { ItemMaster, VehicleTypeChild } = await getTenantDBModels();
    if (modal.vehicleTypeId !== 0 && modal.id === 0) {
      const findUse = await ItemMaster.findOne({
        VehicleTypeId: modal.vehicleTypeId,
        NTRecord: 'y'
      });
      if (findUse) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.CONFLICT,
          message: `VehicleType Id ${findUse.VehicleTypeId} Already In Use!`,
        }
      }

      const existingRecord = await VehicleTypeChild.find({ VehicleTypeId: modal.vehicleTypeId });

      if (existingRecord.length > 0) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.CONFLICT,
          message: 'Vehicle Type Already Exist!',
          data: existingRecord,
        }
      }
    }

    // Check for duplicate records when id is 0
    if (modal.id === 0) {
      const duplicate = await VehicleTypeChild.findOne({
        EffectiveDate: modal.effectiveDate,
        VehicleTypeId: modal.vehicleTypeId,
        PetroId: modal.petroId,
        id: { $ne: modal.id }
      });

      if (duplicate) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.CONFLICT,
          message: 'Duplicate Vehicle Type Date!',

        }
      }

      // Set new id for the model
      const lastRecord = await VehicleTypeChild.findOne().sort({ id: -1 }).exec();
      modal.id = (lastRecord?.id || 0) + 1;

      const modalToSave = {
        ...modal,
        EffectiveDate: modal.effectiveDate,
        PetroName: modal.petroName,
        PetroId: modal.petroId,
        SessionD1: modal.sessionD1,
        SessionD2: modal.sessionD2,
        VehicleTypeId: modal.vehicleTypeId,
        VehicleTypeName: modal.vehicleTypeName,
      };

      // Add new record
      const newVtypeInfo = new VehicleTypeChild(modalToSave);
      await newVtypeInfo.save();

      return {
        isSuccess: true,
        statusCode: StatusCodes.CREATED,
        message: 'Vehicle Type Info Added Successfully!',
        data: newVtypeInfo,
      }
    } else {
      const modalToSave = {
        ...modal,
        EffectiveDate: modal.effectiveDate,
        PetroName: modal.petroName,
        PetroId: modal.petroId,
        SessionD1: modal.sessionD1,
        SessionD2: modal.sessionD2,
        VehicleTypeId: modal.vehicleTypeId,
        VehicleTypeName: modal.vehicleTypeName,
      };
      // Check if vehicle type is in use before updating
      const findUse = await ItemMaster.findOne({
        VehicleTypeId: modal.vehicleTypeId,
        NTRecord: 'y'
      });

      if (findUse) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.CONFLICT,
          message: 'Vehicle Type Already In Use!',
          data: findUse
        }
      }

      // Find and update existing record
      const existingRecord = await VehicleTypeChild.findOne({ id: modal.id }).lean();
  

      if (existingRecord) {
        
        await VehicleTypeChild.updateOne({ id: modal.id }, { $set: modalToSave });

        return {
          isSuccess: true,
          statusCode: StatusCodes.OK,
          message: 'Vehicle Type Info Updated Successfully!',
          data: existingRecord,

        }
      } else {
        return {
          isSuccess: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Vehicle Type Info Not Found!',

        }
      }
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }
}

//////////////////////////////////////////////// getVtypeinfoQuery /////////////////////////////////////////////////////

export const getVtypeinfoQuery = async (modal) => {

  try {
    const { ItemMaster, VehicleTypeChild } = await getTenantDBModels();

    // Create a filter for the Vtypeinfos model using the provided filter
    const vTypeInfo = await VehicleTypeChild.find(modal.where, modal.parameterValues).select({
      id: 1,
      VehicleTypeId: 1,
      SessionD1: { $convert: { input: "$SessionD1", to: "double" } },
      SessionD2: { $convert: { input: "$SessionD2", to: "double" } },
      FuelAlloted: { $convert: { input: "$FuelAlloted", to: "double" } },
      PetroId: 1,
      PetroName: 1,
      EffectiveDate: 1,
      CreatedBy: 1,
      UpdatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    })
      .lean();

    // Extract distinct VehicleTypeIds from vTypeInfo
    const vtypes = [...new Set(vTypeInfo.map(s => s.VehicleTypeId.toString()))];

    // Query the ItemMasters collection
    const items = await ItemMaster.find({ VehicleTypeId: { $in: vtypes } })
      .select('ItemMasterId VehicleTypeId NTRecord').lean();
    // Map the NTRecord to the corresponding vTypeInfo
    vTypeInfo.forEach(v => {
      const item = items.find(i => i.VehicleTypeId.toString() === v.VehicleTypeId.toString());
      if (item) {
        v.NTRecord = item.NTRecord;
      }
    });

    const response = vTypeInfo.map((obj) => {
      let newObj = {};
      Object.keys(obj).forEach((key) => {
        let newKey = key.charAt(0).toLowerCase() + key.slice(1);
        if (newKey === "nTRecord") {
          newObj["ntRecord"] = obj[key];
        } else {
          newObj[newKey] = obj[key];
        }
      });
      return newObj;
    });

    return {
      message: 'Vehicle Type Info Retrieved Successfully!',
      data: response,
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }
}

//////////////////////////////////////////////// DeleteVtypeinfoQuery /////////////////////////////////////////////////////

export const DeleteVtypeinfoQuery = async (modal) => {

  try {
    const { ItemMaster, VehicleTypeChild, VehicleTypeMaster} = await getTenantDBModels();

    const { id } = modal;

    // Check if VehicleTypeId exists in ItemMaster
    const itemExists = await ItemMaster.findOne({ VehicleTypeId: id });
    if (itemExists) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.CONFLICT,
        message: "Vehicle Type cannot be deleted as it exists in ItemMaster.",
      }
    }

    // Check if VehicleTypeId exists in VehicleTypeChild
    const childExists = await VehicleTypeChild.findOne({ VehicleTypeId: id });
    if (childExists) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.CONFLICT,
        message: "Vehicle Type cannot be deleted as it exists in Vehicle Type Child.",
      }
    }

    // Delete from VehicleTypeMaster
    const deletedVehicle = await VehicleTypeMaster.findOneAndDelete({ VehicleTypeId: id });

    if (!deletedVehicle) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Vehicle Type not found.",
      }
    }

    return res.status(200).json({
      isSuccess: true,
      statusCode: StatusCodes.ACCEPTED,
      message: "Vehicle Type deleted.",
    });

  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}
