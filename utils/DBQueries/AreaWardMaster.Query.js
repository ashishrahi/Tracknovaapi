import { AreaWardMaster,ZoneMaster,RouteAreaDetail,RouteAreaBinDetail,BinLocation } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

//////////////////////////////////////////////// AddUpdateAreaWardMasterQuery /////////////////////////////////////////////////////

export const AddUpdateAreaWardMasterQuery = async (modal) => {

  try {
    if (modal.areaID === 0) {
      // Check if the record already exists
      const existingRecord = await AreaWardMaster.findOne({
        areaName: modal.areaName,
        wardNumber: modal.wardNumber
      });

      if (existingRecord) {
        return {
          status: 0,
          message: `Area Name ${modal.areaName} and Ward Number ${modal.wardNumber} combination already exists`,
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
          checked: modal.zoneMaster.checked
        }
      });

      await newRecord.save();
      return {
        status: 1,
        message: `Area ${newRecord.AreaName} and Ward ${newRecord.WardNumber} Successfully Added`,
        data: newRecord,
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
            checked: modal.zoneMaster.checked
          }
        });

        await entity.save();
        return {
          status: 1,
          message: `Area ${entity.AreaName} and Ward ${entity.WardNumber} Successfully Updated`,
          data: entity,
        };
      } else {
        return {
          status:0,
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
}

//////////////////////////////////////////////// GetAreaWardMasterQuery /////////////////////////////////////////////////////

export const GetAreaWardMasterQuery = async (modal) => {
    const { pageNo, pageSize } = modal;  // Assuming filter is passed via query params
    try {
      const skip = (pageNo - 1) * pageSize; // Pagination logic
      const limit = parseInt(pageSize);
  
      // Aggregation pipeline
      const pipeline = [
        {
          $lookup: {
            from: 'ZoneMaster', // The collection name for ZoneMaster
            localField: 'ZoneID', // Local field that references the ZoneMaster collection
            foreignField: 'ZoneID', // The foreign field in the ZoneMaster collection
            as: 'ZoneMaster',
          }
        },
        {
          $unwind: {
            path: '$ZoneMaster',
            preserveNullAndEmptyArrays: true, // Ensures that if ZoneMaster is not found, it doesn't fail the query
          }
        },
        {
          $project: {
            AreaID: 1,
            AreaName: { $ifNull: ['$AreaName', ''] },
            WardNumber: { $ifNull: ['$WardNumber', ''] },
            ZoneID: 1,
            CreatedBy: { $ifNull: ['$CreatedBy', ''] },
            UpdatedBy: { $ifNull: ['$UpdatedBy', ''] },
            CreatedOn: { $ifNull: ['$CreatedOn', new Date(0)] }, // Default to Unix Epoch date if null
            UpdatedOn: { $ifNull: ['$UpdatedOn', new Date(0)] }, // Default to Unix Epoch date if null
            ZoneMaster: {
              ZoneID: { $ifNull: ['$ZoneMaster.ZoneID', ''] },
              ZoneName: { $ifNull: ['$ZoneMaster.ZoneName', ''] },
              ZoneAbbrevation: { $ifNull: ['$ZoneMaster.ZoneAbbrevation', ''] },
              CreatedBy: { $ifNull: ['$ZoneMaster.CreatedBy', ''] },
              UpdatedBy: { $ifNull: ['$ZoneMaster.UpdatedBy', ''] },
              CreatedOn: { $ifNull: ['$ZoneMaster.CreatedOn', new Date(0)] },
              UpdatedOn: { $ifNull: ['$ZoneMaster.UpdatedOn', new Date(0)] },
            }
          }
        },
        {
          $skip: skip, // Pagination
        },
        {
          $limit: limit, // Pagination
        }
      ];
  
      // Query the database using aggregation
      const data = await AreaWardMaster.aggregate(pipeline);
      const totalCount = await AreaWardMaster.countDocuments();
  
      return {
        status: true,
        message: 'AreaWardMaster fetch Successfully !',
        data: data,
        RowCount: totalCount,
        pageNo:pageNo,
        pageSize:pageSize,
      };
    } catch (error) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
}

//////////////////////////////////////////////// DeleteAreaWardMasterQuery /////////////////////////////////////////////////////

export const DeleteAreaWardMasterQuery = async (modal) => {
    

    try {
     
      const area = await RouteAreaDetail.findOne({ AreaID: modal.areaID }).exec();
      if (area) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: `Area ID ${area.AreaID} is used in RouteAreaDetail so can\'t delete.`,
        }
      }
  
      // Check if AreaID is used in RouteAreaBinDetail
      const rut = await RouteAreaBinDetail.findOne({ AreaID: modal.areaID }).exec();
      if (rut) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: `Area ID ${rut.AreaID} is used in RouteAreaBinDetail so can\'t delete.`,
        }
      }
  
      // Check if AreaID is used in BinLocation
      const dward = await BinLocation.findOne({ AreaID: modal.areaID }).exec();
      if (dward) {
       return{
             isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: `Area ID ${dward.AreaID}is used in BinLocation so can\'t delete.`,
 
       }
      }
  
      // If no references found, proceed to delete the AreaWardMaster entry
      if (modal.areaID !== 0) {
        const enity = await AreaWardMaster.findOne({AreaID:modal.areaID}).exec();
        if(enity){
        return{
          isSuccess: true,
          statusCode: StatusCodes.OK,
          message: "Deleted successfully",
        }}
        else {
        return{
            isSuccess: false,
            statusCode: StatusCodes.OK,
            message: `AreaId not found`,
        }
        }
  
        // Remove the AreaWardMaster
        await AreaWardMaster.findOneAndDelete({AreaID:modal.areaID}).exec();
      }
  
     return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `AreaId ${entity.AreaID} of AreaWardMaster deleted Successfully`,
      
     }
    } catch (ex) {
     return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ex.message,
     }
    }
  
}