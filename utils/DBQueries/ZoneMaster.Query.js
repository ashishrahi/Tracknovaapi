import { BinLocation, AreaWardMaster } from "../../modals/index.js";
import ZoneMaster from "../../modals/ZoneMaster.model.js";
import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/connectMongoDB.js";
/////////////////////////////////////////// AddUpdateZoneMasterQuery //////////////////////////////////////////

export const AddUpdateZoneMasterQuery = async (modal) => {
  try {
    const { ZoneMaster } = await getTenantDBModels();
    if (modal.zoneID === 0) {
      const existingZone = await ZoneMaster.findOne({ ZoneName: modal.zoneName });
      if (existingZone) {
        return {
          status: 1,
          message: 'Zone with ZoneName already exists!',
        }
      }

      const lastZone = await ZoneMaster.findOne().sort({ ZoneID: -1 }).limit(1);
      modal.zoneID = lastZone ? lastZone.ZoneID + 1 : 1;

      const newZoneMaster = new ZoneMaster({
        ZoneID: modal.zoneID,
        ZoneName: modal.zoneName,
        ZoneAbbrevation: modal.zoneAbbrevation,
        CreatedBy: modal.createdBy,
        UpdatedBy: modal.updatedBy,
      });
      await newZoneMaster.save();
      const data = {
        zoneID: newZoneMaster.ZoneID,
        zoneName: newZoneMaster.ZoneName,
        zoneAbbrevation: newZoneMaster.ZoneAbbrevation,
        createdBy: newZoneMaster.CreatedBy,
        updatedBy: newZoneMaster.UpdatedBy,
      };
      return {
        status: 1,
        message: `Zone Name ${modal.ZoneName} Successfully Added`,
        data: data,
      }
    }
    else {
      const existingZone = await ZoneMaster.findOne({ ZoneID: modal.ZoneID });
      if (!existingZone) {
        return {
          status: 0,
          message: 'Zone not found!',
        }
      }
      await ZoneMaster.updateOne({ ZoneID: modal.ZoneID }, modal);
      return {
        status: 1,
        message: `Zone Name ${modal.ZoneName} Successfully Updated`,
        data: existingZone,
      }
    }

  } catch (error) {
    return {
      status: 0,
      message: error.message + ";" + (error.innerException ? error.innerException : error.message),
    }

  }
}

/////////////////////////////////////////// GetZoneMasterQuery //////////////////////////////////////////////////////////////////


export const GetZoneMasterQuery = async (modal) => {
  try {
    const { ZoneMaster } = await getTenantDBModels();
    let records = [];
    if (modal.zoneID === -1) {
      records = await ZoneMaster.find().lean();
      const transformedZoneMaster = records.map((item) => ({
        zoneID: item.ZoneID,
        zoneName: item.ZoneName,
        ZoneAbbrevation: item.ZoneAbbrevation,
        createdBy: item.CreatedBy,
        updatedBy: item.UpdatedBy,
      }));
      return {
        isSuccess: true,
        internalSuccess: true,
        mesg: `ZoneMaster Records has been fetched successfully`,
        insertedId: "",
        data: transformedZoneMaster,
      }
    } else {
      records = await ZoneMaster.findOne({ ZoneID: modal.zoneID }).lean();

      const transformedZoneMaster = {
        zoneID: records.ZoneID,
        zoneName: records.ZoneName,
        zoneAbbrevation: records.ZoneAbbrevation,
        createdBy: records.CreatedBy,
        updatedBy: records.UpdatedBy,
      };



      return {
        isSuccess: true,
        internalSuccess: true,
        mesg: `ZoneMaster Records has been fetched successfully`,
        insertedId: "",
        data: transformedZoneMaster,
      }
    }

  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: true,

      message: error.message + ";" + (error.innerException ? error.innerException : error.message),
    }
  }
}

/////////////////////////////////////////// DeleteZoneMasterQuery //////////////////////////////////////////////////////////////////


export const DeleteZoneMasterQuery = async (modal) => {
  try {
    // Check if the ZoneID is used in BinLocation
    const { BinLocation, AreaWardMaster, ZoneMaster } = await getTenantDBModels();

    const binLocation = await BinLocation.findOne({ ZoneID: modal.zoneID }).exec();
    if (binLocation) {
      return {
        isSuccess: 0,
        internalSuccess: false,
        mesg: "Zone Id is used in BinLocation so can't delete."

      }
    }

    // Check if the ZoneID is used in AreaWardMaster
    const areaWard = await AreaWardMaster.findOne({ ZoneID: modal.zoneID }).exec();
    if (areaWard) {
      return {
        isSuccess: 0,
        internalSuccess: false,
        mesg: "Zone Id is used in AreaWardMaster so can't delete."
      };
    }

    // Find the ZoneMaster document by ZoneID
    const zoneMaster = await ZoneMaster.find({ ZoneID: modal.zoneID }).exec();
    if (zoneMaster.length > 0) {
      // Delete the ZoneMaster documents
      await ZoneMaster.deleteMany({ ZoneID: modal.zoneID }).exec();
      return {
        isSuccess: 1,
        internalSuccess: true,
        mesg: `ZoneID ${modal.zoneID} Successfully deleted`
      };
    } else {
      return {
        isSuccess: 0,
        internalSuccess: false,
        mesg: "Zone Id Not Found!"
      };
    }

  } catch (error) {
    return {
      isSuccess: 0,
      internalSuccess: false,
      mesg: error.message + ";" + (error.innerException ? error.innerException : error.message)
    };
  }
}