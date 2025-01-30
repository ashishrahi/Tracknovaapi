import {BinLocation,AreaWardMaster } from "../../modals/index.js";
import ZoneMaster from "../../modals/ZoneMaster.model.js";
import { StatusCodes } from "http-status-codes";

/////////////////////////////////////////// AddUpdateZoneMasterQuery //////////////////////////////////////////

export const AddUpdateZoneMasterQuery = async (modal) => {
    try {
        if (modal.ZoneID === 0) {
            const existingZone = await ZoneMaster.findOne({ ZoneName: modal.ZoneName });
            if (existingZone) {
                return{
                    isSuccess: true,
                    statusCode: StatusCodes.CONFLICT,
                    message: 'Zone already exists!',
                } }

                const lastZone = await ZoneMaster.findOne().sort({ ZoneID: -1 }).limit(1);
                modal.ZoneID = lastZone ? lastZone.ZoneID + 1 : 1; 
                const newZoneMaster = new ZoneMaster(modal);
                await newZoneMaster.save();
                return{
                    isSuccess: true,
                    statusCode: StatusCodes.CREATED,
                    message: `Zone Name ${modal.ZoneName} Successfully Added`,
                    data: newZoneMaster,
                } }
                else{
                    const existingZone = await ZoneMaster.findOne({ZoneID:modal.ZoneID});
                    if (!existingZone) {
                        return{
                            isSuccess: false,
                            statusCode: StatusCodes.NOT_FOUND,
                            message: 'Zone not found!',
                        }}
                        await ZoneMaster.updateOne({ ZoneID: modal.ZoneID }, modal);
                        return{
                            isSuccess: true,
                            statusCode: StatusCodes.OK,
                            message: `Zone Name ${modal.ZoneName} Successfully Updated`,
                            data: existingZone,
                        }
                    }
        
    } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: error.message + ";" + (error.innerException? error.innerException : error.message),
        }
        
    }
}

/////////////////////////////////////////// GetZoneMasterQuery //////////////////////////////////////////////////////////////////


export const GetZoneMasterQuery = async (modal) => {
    try {
        console.log('modal',modal)
        let records = [];
if (modal.ZoneID === -1) {
    records = await ZoneMaster.find().lean();
    return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `ZoneMaster Records has been fetched successfully`,
        data: records,
    }
}else{
    records = await ZoneMaster.findOne({ ZoneID: modal.ZoneID }).lean();
    return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `ZoneMaster Records has been fetched successfully`,
        data: records,
    }
}
if (records && records.length > 0) {
    return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `ZoneMaster Records has been fetched successfully`,
        data: records,
    }
} else {
    return{
        isSuccess: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: `No ZoneMaster Records found`,
    }
}

    } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message + ";" + (error.innerException? error.innerException : error.message),
        }
    }
}

/////////////////////////////////////////// DeleteZoneMasterQuery //////////////////////////////////////////////////////////////////


export const DeleteZoneMasterQuery = async (modal) => {
    try {
        // Check if the ZoneID is used in BinLocation
        
        const binLocation = await BinLocation.findOne({ ZoneID: modal.ZoneID }).exec();
        if (binLocation) {
         return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: "Zone Id is used in BinLocation so can't delete."
          
         }
        }
    
        // Check if the ZoneID is used in AreaWardMaster
        const areaWard = await AreaWardMaster.findOne({ ZoneID: modal.ZoneID }).exec();
        if (areaWard) {
          return {
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: "Zone Id is used in AreaWardMaster so can't delete."
          };
        }
    
        // Find the ZoneMaster document by ZoneID
        const zoneMaster = await ZoneMaster.find({ ZoneID: modal.ZoneID }).exec();
        if (zoneMaster.length > 0) {
          // Delete the ZoneMaster documents
          await ZoneMaster.deleteMany({ ZoneID: modal.ZoneID }).exec();
          return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: "Successfully deleted"
          };
        } else {
          return {
            isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: "Zone Id Not Found!"
          };
        }
    
      } catch (error) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message + ";" + (error.innerException? error.innerException : error.message)
        };
      }
}