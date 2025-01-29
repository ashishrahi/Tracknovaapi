import { model } from "mongoose";
import { VehicleTypeMaster,ItemMaster,VehicleTypeChild,NT } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

//////////////////////////////////////////////// AddUpdateVtypeinfoQuery /////////////////////////////////////////////////////

export const AddUpdateVtypeinfoQuery = async (modal) => {

    try {
      

      if (modal.VehicleTypeId !== 0 && modal.id === 0) {
        const findUse = await ItemMaster.findOne({
          VehicleTypeId: modal.VehicleTypeId,
          NTRecord: 'y'
        });
        if (findUse) {
          return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: `VehicleType Id ${VehicleTypeId} Already In Use!`,
          }
        }
  
        const existingRecord = await VehicleTypeChild.find({ VehicleTypeId: modal.VehicleTypeId });
  
        if (existingRecord.length > 0) {
          return{
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
          EffectiveDate: modal.EffectiveDate,
          VehicleTypeId: modal.VehicleTypeId,
          PetroId: modal.PetroId,
          id: { $ne: modal.id }
        });
  
        if (duplicate) {
         return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: 'Duplicate Vehicle Type Date!',
 
         }
        }
  
        // Set new id for the model
        const lastRecord = await VehicleTypeChild.findOne().sort({ id: -1 }).exec();
        modal.id = (lastRecord?.id || 0) + 1;
  
        // Add new record
        const newVtypeInfo = new VehicleTypeChild(modal);
        await newVtypeInfo.save();
  
      return{
        isSuccess: true,
        statusCode: StatusCodes.CREATED,
        message: 'Vehicle Type Info Added Successfully!',
        data: newVtypeInfo,
      }
      } else {
        // Check if vehicle type is in use before updating
        const findUse = await ItemMaster.findOne({
          VehicleTypeId: modal.VehicleTypeId,
          NTRecord: 'y'
        });
  
        if (findUse) {
          return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: 'Vehicle Type Already In Use!',
            data:findUse
          }
        }
  
        // Find and update existing record
        const existingRecord = await VehicleTypeChild.findOne({id:modal.id}).lean();
  
        if (existingRecord) {
          await VehicleTypeChild.updateOne({ id: modal.id }, { $set: modal });
  
        return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'Vehicle Type Info Updated Successfully!',
            data: existingRecord,
  
        }
        } else {
         return{
            isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Vehicle Type Info Not Found!',
 
         }
        }
      }
    } catch (error) {
      return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
      }}}

//////////////////////////////////////////////// getVtypeinfoQuery /////////////////////////////////////////////////////

export const getVtypeinfoQuery = async (modal) => {
  
    try {
        // Create a filter for the Vtypeinfos model using the provided filter
        const vTypeInfo = await VehicleTypeChild.find(modal.where, modal.parameterValues).exec();

        // Extract distinct VehicleTypeIds from vTypeInfo
        const vtypes = [...new Set(vTypeInfo.map(s => s.VehicleTypeId.toString()))];

        // Query the ItemMasters collection
        const items = await ItemMaster.find({ VehicleTypeId: { $in: vtypes } })
            .select('ItemMasterId VehicleTypeId NTRecord')
            .exec();
        // Map the NTRecord to the corresponding vTypeInfo
        vTypeInfo.forEach(v => {
            const item = items.find(i => i.VehicleTypeId.toString() === v.VehicleTypeId.toString());

            if (item) {
                v.NTRecord = item.NTRecord;
            }
        });

       return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: 'Vehicle Type Info Retrieved Successfully!',
        data: vTypeInfo,
       }
    } catch (error) {
       return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
       }
    }
}

//////////////////////////////////////////////// DeleteVtypeinfoQuery /////////////////////////////////////////////////////

export const DeleteVtypeinfoQuery = async (modal) => {
   
   try {
        if (!modal.id) {
          throw new Error("Vehicle type ID is required.");
        }
    
        // Query to check if the vehicle type is in use
        const findUse = await ItemMaster.findOne({
          devid: modal.devid,
          ntrecord: "y",
          VehicleTypeId: modal.VehicleTypeId,
        }).exec();
    
        if (findUse) {
          if (findUse.NT && findUse.NT.toLowerCase() === "y") {
            throw new Error("Vehicle type in use cannot be deleted.");
          }
        }
    
        // Find and remove the Vtypeinfo document
        const entity = await Vtypeinfo.findById(modal.id).exec();
        if (!entity) {
          return{
            isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: "Vehicle type info not found.",
          }
        }
    
        await entity.remove();
    
        return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: "Vehicle Type Info deleted successfully",
        }
      } catch (error) {
      return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      }
      }
    
}
