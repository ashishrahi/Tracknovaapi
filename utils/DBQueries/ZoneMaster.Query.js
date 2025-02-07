import {BinLocation,AreaWardMaster } from "../../modals/index.js";
import ZoneMaster from "../../modals/ZoneMaster.model.js";
import { StatusCodes } from "http-status-codes";

/////////////////////////////////////////// AddUpdateZoneMasterQuery //////////////////////////////////////////

export const AddUpdateZoneMasterQuery = async (modal) => {
    try {
        if (modal.zoneID === 0) {
            const existingZone = await ZoneMaster.findOne({ ZoneName: modal.zoneName });
            if (existingZone) {
                return{
                    status: 1,
                    message: 'Zone with ZoneName already exists!',
                } }

                const lastZone = await ZoneMaster.findOne().sort({ ZoneID: -1 }).limit(1);
                modal.zoneID = lastZone ? lastZone.ZoneID + 1 : 1; 

                const newZoneMaster = new ZoneMaster({
                    ZoneID: modal.zoneID,
                    ZoneName: modal.zoneName,
                    ZoneAbbreviation:modal.zoneAbbreviation,
                    CreatedBy: modal.createdBy,
                    UpdatedBy: modal.updatedBy,
                });
                const newData = await newZoneMaster.save();

                data = {
                    zoneID: newData.ZoneID,
                    zoneName: newData.ZoneName,
                    zoneAbbrevation: newData.ZoneAbbreviation,
                    createdBy: newData.CreatedBy,
                    updatedBy: newData.UpdatedBy,
                  };
                return{
                    status: 1,
                    message: `Zone Name ${modal.ZoneName} Successfully Added`,
                    data,
                } }
                else{
                    const existingZone = await ZoneMaster.findOne({ZoneID:modal.ZoneID});
                    if (!existingZone) {
                        return{
                            status: 0,
                            message: 'Zone not found!',
                        }}
                        await ZoneMaster.updateOne({ ZoneID: modal.ZoneID }, modal);
                        return{
                            status: 1,
                            message: `Zone Name ${modal.ZoneName} Successfully Updated`,
                            data: existingZone,
                        }
                    }
        
    } catch (error) {
        return{
            status: 0,
            message: error.message + ";" + (error.innerException? error.innerException : error.message),
        }
        
    }
}

/////////////////////////////////////////// GetZoneMasterQuery //////////////////////////////////////////////////////////////////


export const GetZoneMasterQuery = async (modal) => {
    try {
        let records = [];
if (modal.ZoneID === -1) {
    records = await ZoneMaster.find().lean();
    const transformedZoneMaster = records.map((item) => ({
        zoneID: item.ZoneID,
        zoneName: item.ZoneName,
        zoneAbbrevation: item.ZoneAbbrevation,
        createdBy: item.CreatedBy,
        updatedBy: item.UpdatedBy,
      }));
    return{
        isSuccess: true,
        internalSuccess: true,
        mesg: `ZoneMaster Records has been fetched successfully`,
        insertedId:"",
        data: transformedZoneMaster,
    }
}else{
    records = await ZoneMaster.findOne({ ZoneID: modal.ZoneID }).lean();
    return{
        isSuccess: true,
        internalSuccess: true,
        mesg: `ZoneMaster Records has been fetched successfully`,
        insertedId:"",
        data: records,
    }
}

    } catch (error) {
        return{
            isSuccess: false,
            internalSuccess: true,

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
            message: `ZoneID ${modal.ZoneID } Successfully deleted`
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