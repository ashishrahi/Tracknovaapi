import { AreaWardMaster,ZoneMaster,RouteAreaDetail,RouteAreaBinDetail,BinLocation } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

//////////////////////////////////////////////// AddUpdateAreaWardMasterQuery /////////////////////////////////////////////////////

export const AddUpdateAreaWardMasterQuery = async (modal) => {

  
    try {
      if (modal.AreaID === 0) {
        // Check if the record already exists
        const existingRecord = await AreaWardMaster.findOne({
          AreaName: modal.AreaName,
          WardNumber: modal.WardNumber
        });
  
        if (existingRecord) {
         return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: 'Area Name and Ward Number combination already exists',
         }
        }
  
        // Find the last record to set the new AreaID
        const lastRecord = await AreaWardMaster.findOne().sort({ AreaID: -1 });
        modal.AreaID = lastRecord ? lastRecord.AreaID + 1 : 1; 
  
        const newRecord = new AreaWardMaster(modal);
        await newRecord.save();
        return{
            isSuccess: true,
            statusCode: StatusCodes.CREATED,
            message: `Area ${newRecord.AreaName} and Ward ${newRecord.WardNumber} Successfully Added`,
            data: newRecord,
        }
      } else {
        // Update existing record
        const entity = await AreaWardMaster.findOne({ AreaID: modal.AreaID });
  
        if (entity) {
          Object.assign(entity, modal);
          await entity.save();
          return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: `Area ${entity.AreaName} and Ward ${entity.WardNumber} Successfully Updated`,
            data: entity,
          }
        } else {
         return{
            isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Area Ward not found',
 
         }
        }
      }
    } catch (error) {
      return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      }
    }
  
}

//////////////////////////////////////////////// GetAreaWardMasterQuery /////////////////////////////////////////////////////

export const GetAreaWardMasterQuery = async (modal) => {
    const { pageNo, pageSize } = modal;  // Assuming filter is passed via query params
console.log('modal:',modal)
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
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: 'AreaWardMaster fetch Successfully !',
        data: data,
        pageNo:pageNo,
        pageSize:pageSize,
        RowCount: totalCount,
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
     
      const area = await RouteAreaDetail.findOne({ AreaID: modal.AreaID }).exec();
      if (area) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: 'Area ID is used in RouteAreaDetail so can\'t delete.',
        }
      }
  
      // Check if AreaID is used in RouteAreaBinDetail
      const rut = await RouteAreaBinDetail.findOne({ AreaID: modal.AreaID }).exec();
      if (rut) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: 'Area ID is used in RouteAreaBinDetail so can\'t delete.',
        }
      }
  
      // Check if AreaID is used in BinLocation
      const dward = await BinLocation.findOne({ AreaID: modal.AreaID }).exec();
      if (dward) {
       return{
             isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: 'Area ID is used in BinLocation so can\'t delete.',
 
       }
      }
  
      // If no references found, proceed to delete the AreaWardMaster entry
      if (modal.AreaID !== 0) {
        const enity = await AreaWardMaster.findOne({AreaID:modal.AreaID}).exec();
        if (!enity) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'AreaWardMaster not found',
        }
        }
  
        // Remove the AreaWardMaster
        await AreaWardMaster.findOneAndDelete({AreaID:modal.AreaID}).exec();
      }
  
     return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: 'AreaWardMaster deleted Successfully',
      
     }
    } catch (ex) {
     return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ex.message,
     }
    }
  
}