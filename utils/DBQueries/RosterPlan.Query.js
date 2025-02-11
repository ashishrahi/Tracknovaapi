import {RosterPlan,RosterPlanDetail,EmpMaster,ItemMaster,HandheldMaster,Route } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

///////////////////////////////////////////// AddUpdateRosterPlanQuery //////////////////////////////////////////////////////////////////

export const AddUpdateRosterPlanQuery = async (model) => {
    try {
        if (model.rosterID === 0) {
          // Check if RosterNo already exists
          const existingRecord = await RosterPlan.findOne({ RosterNo: model.rosterNo }).lean();
          if (existingRecord) {
            return {
                status: 0,
                message: `Roster No ${existingRecord.RosterNo} already exists`,
            };
          }
    
          // Get the last RosterID and increment by 1
          const lastRecord = await RosterPlan.findOne().sort({ RosterID: -1 }).lean();
          model.rosterID = (lastRecord?.RosterID ?? 0) + 1;
    
          // Save new record
          const newRosterPlan = await RosterPlan.create({
            RosterID: model.rosterID,
            RosterNo: model.rosterNo,
            RosterDate: model.rosterDate,
            FromDate: model.fromDate,
            ToDate: model.toDate,
            CreatedBy: model.createdBy,
            UpdatedBy: model.updatedBy,
          });

          const newData = {
            rosterID: newRosterPlan.RosterID,
            rosterNo: newRosterPlan.RosterNo,
            rosterDate: newRosterPlan.RosterDate,
            fromDate: newRosterPlan.FromDate,
            todate: newRosterPlan.ToDate,
            createdBy: newRosterPlan.CreatedBy,
            updatedBy: newRosterPlan.UpdatedBy,
            createdOn:newRosterPlan.createdAt,
            updatedOn: newRosterPlan.updatedAt,
          }
    
          return {
            status: 1,
            message: `Roster Plan ${model.RosterID} created successfully`,
            data: newData,
          };
        } else {
          // Update existing record
          const existingEntity = await RosterPlan.findOne({ RosterID: model.rosterID });
          if (!existingEntity) {
            return {
                status: 0,
                message: `Roster ID ${model.rosterID} not found`,
            };
          }
    
          // Update fields
          Object.assign(existingEntity,{
            RosterNo: model.rosterNo,
            RosterDate: model.rosterDate,
            FromDate: model.fromDate,
            ToDate: model.toDate,
            UpdatedBy: model.updatedBy,
            UpdatedOn: new Date(),
          });
          await existingEntity.save();
    
          // Remove existing RosterPlanDetail and add new ones
          await RosterPlanDetail.deleteMany({ RosterID: model.RosterID });
    
          if (Array.isArray(model.RosterPlanDetails) && model.RosterPlanDetails.length > 0) {
            model.RosterPlanDetails.forEach(detail => detail.RosterID = model.RosterID);
            await RosterPlanDetail.insertMany(model.RosterPlanDetails);
          }
    
          const updatedData = {
            rosterID: existingEntity.RosterID,
            rosterNo: existingEntity.RosterNo,
            rosterDate: existingEntity.RosterDate,
            fromDate: existingEntity.FromDate,
            todate: existingEntity.Todate,
            createdBy: existingEntity.CreatedBy,
            updatedBy: existingEntity.UpdatedBy,
            createdOn:existingEntity.createdAt,
            updatedOn: existingEntity.updatedAt,
          }



          return {
            status: 1,
            message: `Roster Plan ${model.RosterID} updated successfully`,
            data: updatedData,
          };
        }
      } catch (ex) {
        return {
          status: 0,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: ex.message,
        };
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
                    from: 'RosterPlanDetail',
                    localField: 'RosterID',
                    foreignField: 'RosterID',
                    as: 'RosterPlanDetail',
                },
            },
            { $unwind: { path: '$RosterPlanDetail', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'EmpMaster',
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
                    from: 'HandheldMaster',
                    localField: 'RosterPlanDetail.HandheldID',
                    foreignField: 'ID',
                    as: 'RosterPlanDetail.HandheldMaster',
                },
            },
            {
                $lookup: {
                    from: 'Route',
                    localField: 'RosterPlanDetail.RouteID',
                    foreignField: 'RouteID',
                    as: 'RosterPlanDetail.Route',
                },
            },
        ];
    
        // Pagination stages (only applied when pageNo and pageSize are valid)
        const paginationStages = [];
        if (pageNo > 0 && pageSize > 0) {
            paginationStages.push({ $skip: (pageNo - 1) * pageSize });
            paginationStages.push({ $limit: pageSize });
        }
    
        // Count total documents stage
        const countStage = [{ $count: 'total' }];
    
        // Aggregation pipeline for data
        const dataPipeline = [...lookupStages, ...paginationStages];
    
        // Aggregation pipeline for total count
        const countPipeline = [...countStage];
    
        // Execute both pipelines concurrently
        const [data, countResult] = await Promise.all([
            RosterPlan.aggregate(dataPipeline),
            RosterPlan.aggregate(countPipeline),
        ]);
    
        // Extract total count
        const rowCount = countResult[0]?.total || 0;
    
        // Function to transform `_id`, dates, and buffer values
        const transformData = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(transformData);
            } else if (obj !== null && typeof obj === 'object') {
                return Object.fromEntries(
                    Object.entries(obj).map(([key, value]) => [
                        key.charAt(0).toLowerCase() + key.slice(1), // Convert key to lowercase
                        value instanceof Date
                            ? value.toISOString() // Convert date to ISO format
                            : Buffer.isBuffer(value)
                            ? value.toString('hex') // Convert buffer to hex string
                            : transformData(value),
                    ])
                );
            }
            return obj;
        };
    
        const transformedData = data.map(transformData);
    
        return {
            status: 1,
            message: 'Roster Plan data fetched successfully',
            data: transformedData,
            rowCount,
            pageNo,
            pageSize: pageSize || "All", // Ensure pageSize is not null
            error: rowCount === 0 ? { ErrorMessage: "No records found", StatusCode: 404 } : null,
        };
    } catch (error) {
        return {
            status: 0,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
            error: {
                ErrorMessage: error.message,
                StackTrace: error.stack,
                StatusCode: 500,
            },
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
            internalSuccess:"",
            mesg: `Roster ID ${model.rosterID} is used in RosterPlanDetail, delete related records first.`,
            insertedId:"",
 
           }
        }

        if (model.rosterID) {
            const entity = await RosterPlan.findOne({RosterID:model.rosterID});
            if (!entity) {
              return{
                isSuccess: false,
                internalSuccess:"",
                mesg: `Roster ${entity.RosterID} not found`,
                insertedId:"",
 
              }
            }

            await RosterPlan.findOneAndDelete({RosterID:model.rosterID});
        }

        return{
            isSuccess: true,
            internalSuccess:"",
            mesg: `Roster ${model.rosterID} deleted successfully`,
            insertedId:""
        }
    } catch (error) {
        return{
            isSuccess: false,
            internalSuccess: "",
            mesg: error.message,
        }
    }

}
