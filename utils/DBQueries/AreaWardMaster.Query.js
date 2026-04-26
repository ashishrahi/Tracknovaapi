import { StatusCodes } from "http-status-codes";

import { getTenantDBModels } from "../../db/index.js";
import {SUCCESS,ERROR} from '../../utils/messages/message.js'
//////////////////////////////////////////////// AddUpdateAreaWardMasterQuery /////////////////////////////////////////////////////

export const AddUpdateAreaWardMasterQuery = async (modal) => {
  try {
    const { AreaWardMaster } = await getTenantDBModels();

    if (modal.areaID === 0) {
      // Check if the record already exists
      const existingRecord = await AreaWardMaster.findOne({
        areaName: modal.areaName,
        wardNumber: modal.wardNumber,
      });

      if (existingRecord) {
        return {
          isSuccess:false,
          statusCode:StatusCodes.CONFLICT,
          message:ERROR.ALREADY_EXISTS("wardnumber",modal.wardNumber)
        };
      }

      // Find the last record to set the new areaID
      const lastRecord = await AreaWardMaster.findOne().sort({ AreaID: -1 });
      modal.areaID = lastRecord ? lastRecord.AreaID + 1 : 1;

      const newRecord = new AreaWardMaster({
        AreaID: modal.areaID,
        AreaName: modal.areaName,
        WardNumber: modal.wardNumber,
        ZoneID: modal.zoneID,
        CreatedBy: modal.createdBy,
        UpdatedBy: modal.updatedBy,
        zoneMaster: {
          zoneID: modal.zoneMaster.zoneID,
          zoneName: modal.zoneMaster.zoneName,
          zoneAbbrevation: modal.zoneMaster.zoneAbbrevation,
          createdBy: modal.zoneMaster.createdBy,
          updatedBy: modal.zoneMaster.updatedBy,
          srno: modal.zoneMaster.srno,
          checked: modal.zoneMaster.checked,
        },
      });

      await newRecord.save();

      const newData = {
        areaID: newRecord.AreaID,
        areaName: newRecord.AreaName,
        wardNumber: newRecord.WardNumber,
        zoneID: newRecord.ZoneID,
        createdBy: newRecord.CreatedBy,
        updatedBy: newRecord.UpdatedBy,
      };

      return {
        isSuccess: true,
        statusCode: StatusCodes.CREATED,
        message: `Area ${newRecord.AreaName} and Ward ${newRecord.WardNumber} Successfully Added`,
        data: newData,
      };
    } else {
      // Update existing record
      const entity = await AreaWardMaster.findOne({ areaID: modal.areaID });

      if (entity) {
        Object.assign(entity, {
          areaName: modal.areaName,
          wardNumber: modal.wardNumber,
          zoneID: modal.zoneID,
          updatedBy: modal.updatedBy,
          zoneMaster: {
            zoneID: modal.zoneMaster.zoneID,
            zoneName: modal.zoneMaster.zoneName,
            zoneAbbrevation: modal.zoneMaster.zoneAbbrevation,
            updatedBy: modal.zoneMaster.updatedBy,
            srno: modal.zoneMaster.srno,
            checked: modal.zoneMaster.checked,
          },
        });

        await entity.save();
        return {
          status: 1,
          message: `Area ${entity.AreaName} and Ward ${entity.WardNumber} Successfully Updated`,
          data: entity,
        };
      } else {
        return {
          status: 0,
          message: "Area Ward not found",
        };
      }
    }
  } catch (error) {
    return {
      status: 0,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////// GetAreaWardMasterQuery /////////////////////////////////////////////////////

export const GetAreaWardMasterQuery = async (modal) => {
  const { AreaWardMaster } = await getTenantDBModels();

  const { pageNo, pageSize } = modal; // Assuming filter is passed via query params

  try {
    let pipeline = [
      {
        $lookup: {
          from: "ZoneMaster", // The collection name for ZoneMaster
          localField: "ZoneID", // Local field that references the ZoneMaster collection
          foreignField: "ZoneID", // The foreign field in the ZoneMaster collection
          as: "ZoneMaster",
        },
      },
      {
        $unwind: {
          path: "$ZoneMaster",
          preserveNullAndEmptyArrays: true, // Ensures that if ZoneMaster is not found, it doesn't fail the query
        },
      },
      {
        $project: {
          AreaID: 1,
          AreaName: { $ifNull: ["$AreaName", ""] },
          WardNumber: { $ifNull: ["$WardNumber", ""] },
          ZoneID: 1,
          CreatedBy: { $ifNull: ["$CreatedBy", ""] },
          UpdatedBy: { $ifNull: ["$UpdatedBy", ""] },
          CreatedOn: { $ifNull: ["$CreatedOn", new Date(0)] }, // Default to Unix Epoch date if null
          UpdatedOn: { $ifNull: ["$UpdatedOn", new Date(0)] }, // Default to Unix Epoch date if null
          ZoneMaster: {
            ZoneID: { $ifNull: ["$ZoneMaster.ZoneID", ""] },
            ZoneName: { $ifNull: ["$ZoneMaster.ZoneName", ""] },
            ZoneAbbrevation: { $ifNull: ["$ZoneMaster.ZoneAbbrevation", ""] },
            CreatedBy: { $ifNull: ["$ZoneMaster.CreatedBy", ""] },
            UpdatedBy: { $ifNull: ["$ZoneMaster.UpdatedBy", ""] },
            CreatedOn: { $ifNull: ["$ZoneMaster.CreatedOn", new Date(0)] },
            UpdatedOn: { $ifNull: ["$ZoneMaster.UpdatedOn", new Date(0)] },
          },
        },
      },
    ];

    if (!(pageNo === 0 && pageSize === 0)) {
      const skip = (pageNo - 1) * pageSize;
      const limit = parseInt(pageSize);
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    // Query the database using aggregation
    const data = await AreaWardMaster.aggregate(pipeline);

    const newData = data.map((doc) => ({
      areaID: doc.AreaID,
      areaName: doc.AreaName,
      wardNumber: doc.WardNumber,
      zoneID: doc.ZoneID,
      createdBy: doc.CreatedBy,
      updatedBy: doc.UpdatedBy,
      createdOn: doc.CreatedOn,
      updatedOn: doc.UpdatedOn,
      zoneMaster: {
        zoneID: doc.ZoneMaster.ZoneID,
        zoneName: doc.ZoneMaster.ZoneName,
        zoneAbbreviation: doc.ZoneMaster.ZoneAbbreviation,
        createdBy: doc.ZoneMaster.CreatedBy,
        updatedBy: doc.ZoneMaster.UpdatedBy,
        createdOn: doc.ZoneMaster.CreatedOn,
        updatedOn: doc.ZoneMaster.UpdatedOn,
      },
    }));

    const totalCount = await AreaWardMaster.countDocuments();

    return {
      status: 1,
      message: "AreaWardMaster fetch Successfully!",
      data: newData,
      RowCount: totalCount,
      pageNo: pageNo,
      pageSize: pageSize,
    };
  } catch (error) {
    return {
      status: 0,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////// DeleteAreaWardMasterQuery /////////////////////////////////////////////////////

export const DeleteAreaWardMasterQuery = async (modal) => {
  try {
    const { RouteAreaDetail, RouteAreaBinDetail, BinLocation, AreaWardMaster } =
      await getTenantDBModels();

    const area = await RouteAreaDetail.findOne({ AreaID: modal.areaID }).exec();
    if (area) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.CONFLICT,
        message: `Area ID ${area.AreaID} is used in RouteAreaDetail so can\'t delete.`,
      };
    }

    // Check if AreaID is used in RouteAreaBinDetail
    const rut = await RouteAreaBinDetail.findOne({
      AreaID: modal.areaID,
    }).exec();
    if (rut) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.CONFLICT,
        message: `Area ID ${rut.AreaID} is used in RouteAreaBinDetail so can\'t delete.`,
      };
    }

    // Check if AreaID is used in BinLocation
    const dward = await BinLocation.findOne({ AreaID: modal.areaID }).exec();
    if (dward) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.CONFLICT,
        message: `Area ID ${dward.AreaID}is used in BinLocation so can\'t delete.`,
      };
    }

    // If no references found, proceed to delete the AreaWardMaster entry
    if (modal.areaID !== 0) {
      const enity = await AreaWardMaster.findOne({
        AreaID: modal.areaID,
      }).exec();
      if (enity) {
        return {
          isSuccess: true,
          statusCode: StatusCodes.OK,
          message: "Deleted successfully",
        };
      } else {
        return {
          isSuccess: false,
          statusCode: StatusCodes.OK,
          message: `AreaId not found`,
        };
      }

      // Remove the AreaWardMaster
      await AreaWardMaster.findOneAndDelete({ AreaID: modal.areaID }).exec();
    }

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: `AreaId ${entity.AreaID} of AreaWardMaster deleted Successfully`,
    };
  } catch (ex) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ex.message,
    };
  }
};
