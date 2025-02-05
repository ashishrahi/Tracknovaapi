import { StatusCodes } from 'http-status-codes';
import {HandheldMaster} from '../../modals/index.js';


///////////////////////////////////////// AddUpdateHandheldMasterQuery //////////////////////////////////////////////////////////////////

export async function AddUpdateHandheldMasterQuery(model) {
  
  try {
        if (model.id === 0) {
            const existingRecord = await HandheldMaster.findOne({ HandheldName: model.handheldName });

            if (existingRecord) {
        
        return{
                isSuccess:false,
                statusCode: StatusCodes.CONFLICT,
                message: `HandheldName ${existingRecord.HandheldName} Already Exist!`
               }
            }

            const lastRecord = await HandheldMaster.findOne().sort({ ID: -1 }).limit(1);
            model.id = (lastRecord?.ID ?? 0) + 1;

            const newRecord = new HandheldMaster({
                ID: model.id,
                HandheldName: model.handheldName,
                HandheldCode: model.handheldCode,
                CreatedBy: model.createdBy,
                UpdatedBy: model.updatedBy,
 
            });
            await newRecord.save();
            return{
                    isSuccess:true,
                    statusCode: StatusCodes.CREATED,
                     message: `HandheldName ${newRecord.HandheldName} Successfully Added `,
                     data: newRecord,
                  }
        } else {
            const existingRecord = await HandheldMaster.findOne({ ID: model.id });
            if (existingRecord) {
                await HandheldMaster.updateOne({ ID: model.id }, { $set: model });
              
                return{
                    isSuccess:true,
                    statusCode: StatusCodes.OK,
                    message: `HandheldID ${existingRecord.ID} Successfully Updated `,
                    data: existingRecord,
                }
            } else {
                 return{
                    isSuccess:false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: `HandheldID ${existingRecord.ID} Not Found!`,
                }
            }
        }
    } catch (error) {
        return{
            isSuccess:false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        }
    }}


////////////////////////////////////////// GetHandheldMasterQuery //////////////////////////////////////////////////////////////////

export async function GetHandheldMasterQuery(model) {
    try {
        const queryOptions = {};
        if (model.pageNo && model.pageSize) {
            queryOptions.skip = (model.pageNo - 1) * model.pageSize;
            queryOptions.limit = model.pageSize;
        }

        // No WHERE condition included
        const data = await HandheldMaster.find({}).skip(queryOptions.skip).limit(queryOptions.limit);
        

        // Count documents in the collection
        const rowCount = await HandheldMaster.countDocuments();

        return {
            isSuccess:true,
            statusCode:StatusCodes.OK,
            message: 'HandheldMaster data fetch successfully',
            data: data,
            pageNo: model.pageNo,
            pageSize: model.pageSize,
            rowCount: rowCount
        };
    } catch (error) {
        return {
            isSuccess:false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        };
    }


}

////////////////////////////////////////// DeleteHandheldMasterQuery //////////////////////////////////////////////////////////////////

export async function DeleteHandheldMasterQuery(model) {
    
try {
        if (model.id !== 0) {
            const entity = await HandheldMaster.findOne({ID:model.id}); 
            if (entity) {
                await HandheldMaster.deleteOne({ID: model.id }); 
                
                return{
                    isSuccess:true,
                    statusCode: StatusCodes.OK,
                    message: `HandheldMaster with ID ${model.id} Successfully Deleted`,
                }
            } else {
                return{
                    isSuccess:false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: `HandheldMaster with ID ${model.id} not found`,
                }
            }
        } else {
            return{
                isSuccess:false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Invalid HandheldMasterID ${model.id}',
            }
        }
    } catch (err) {
        return{
            isSuccess:false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message,
        }
    }


}