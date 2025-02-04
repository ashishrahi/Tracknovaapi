import {RosterPlan,RosterPlanDetail,EmpMaster,ItemMaster,HandheldMaster,Route } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

///////////////////////////////////////////// AddUpdateRosterPlanQuery //////////////////////////////////////////////////////////////////

export const AddUpdateRosterPlanQuery = async (model) => {
  try {
    if (model.RosterID === 0) {
      // Check if record already exists
      const existingRecord = await RosterPlan.findOne({ RosterNo: model.RosterNo });
      if (existingRecord) {
       return{
        isSuccess: false,
        statusCode: StatusCodes.CONFLICT,
        message: `Roster No ${existingRecord.RosterNo} already exists`,
       }
      }

      // Get the last RosterID and increment by 1
      const lastRecord = await RosterPlan.findOne().sort({ RosterID: -1 });
      model.RosterID = (lastRecord?.RosterID ?? 0) + 1;

      // Save new record
      const newRosterPlan = new RosterPlan(model);
      await newRosterPlan.save();

    } else {
      // Update existing record
      const existingEntity = await RosterPlan.findOne({RosterID:model.RosterID});
      if (!existingEntity) {
        return{
          isSuccess: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: `Roster ID ${existingEntity.rosterID} not found`,
        };
      }

      // Update the values
      Object.assign(existingEntity, model);
      await existingEntity.save();

      // Remove existing RosterPlanDetail and add new ones
      await RosterPlanDetail.deleteMany({ RosterID: model.RosterID });
      // Add any new details here, assuming they are in the `model` object
      if (model.RosterPlanDetails && model.RosterPlanDetails.length > 0) {
        await RosterPlanDetail.insertMany(model.RosterPlanDetails);
      }

      return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `Roster Plan ${model.RosterID} updated successfully`,
        data: existingEntity,
      }
    }

    return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `Roster Plan ${model.RosterID} Created successfully`,
        data: model,
  
    }
  } catch (ex) {
  return{
    isSuccess: false,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: ex.message,
  }
  }

}

///////////////////////////////////////////////  GetRosterPlanQuery //////////////////////////////////////////////////////////////////

export const GetRosterPlanQuery = async (model) => {
    try {
        const { pageNo, pageSize } = model;
    
        // Lookup stages to join related collections
        const lookupStages = [
            {
                $lookup: {
                    from: 'RosterPlanDetail', // Collection name of RosterPlanDetail
                    localField: 'RosterID', // Field in RosterPlan
                    foreignField: 'RosterID', // Field in RosterPlanDetail
                    as: 'RosterPlanDetail',
                },
            },
            {
                $unwind: {
                    path: '$RosterPlanDetail',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'EmpMaster', // Collection name of EmpMaster
                    localField: 'RosterPlanDetail.EmpId',
                    foreignField: 'Empid',
                    as: 'RosterPlanDetail.EmpMaster',
                },
            },
            {
                $lookup: {
                    from: 'ItemMaster', 
                    localField: 'RosterPlanDetail.VehicleID',
                    foreignField: 'ItemMasterId',
                    as: 'RosterPlanDetail.ItemMaster',
                },
            },
            {
                $lookup: {
                    from: 'HandheldMaster', // Collection name of HandheldMaster
                    localField: 'RosterPlanDetail.HandheldID',
                    foreignField: 'ID',
                    as: 'RosterPlanDetail.HandheldMaster',
                },
            },
            {
                $lookup: {
                    from: 'Route', // Collection name of Route
                    localField: 'RosterPlanDetail.RouteID',
                    foreignField: 'RouteID',
                    as: 'RosterPlanDetail.Route',
                },
            },
        ];
    
        // Pagination stages
        const skipStage = { $skip: (pageNo - 1) * pageSize };
        const limitStage = { $limit: pageSize };
    
        // Count total documents stage
        const countStage = {
            $count: 'total',
        };
    
        // Aggregation pipeline for data
        const dataPipeline = [...lookupStages, skipStage, limitStage];
    
        // Aggregation pipeline for total count
        const countPipeline = [countStage];
    
        // Execute both pipelines concurrently
        const [data, countResult] = await Promise.all([
            RosterPlan.aggregate(dataPipeline),
            RosterPlan.aggregate(countPipeline),
        ]);
    
        // Extract total count
        const rowCount = countResult[0]?.total || 0;
    
        return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'Roster Plan data fetched successfully',
            data,
            pageNo,
            pageSize,
            rowCount,
        };
    } catch (error) {
        return {
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        };
    }
    
}

////////////////////////////////////////////////// DeleteRosterPlanQuery //////////////////////////////////////////////////////////////////

export const DeleteRosterPlanQuery = async (model) => {
    try {
        const cam = await RosterPlanDetail.findOne({ rosterID: model.rosterID }).lean();
        if (cam) {
           return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: `Roster ID ${cam.rosterID} is used in RosterPlanDetail, delete related records first.`,
 
           }
        }

        if (model.rosterID) {
            const entity = await RosterPlan.findOne({RosterID:model.rosterID});
            if (!entity) {
              return{
                isSuccess: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: `Roster ${entity.RosterID} not found`,
              }
            }

            await RosterPlan.findOneAndDelete({RosterID:model.rosterID});
        }

        return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: `Roster ${model.rosterID} deleted successfully`,
        }
    } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        }
    }

}
