import { StatusCodes } from 'http-status-codes';
import {HandheldMaster} from '../../modals/index.js';


///////////////////////////////////////// AddUpdateHandheldMasterQuery //////////////////////////////////////////////////////////////////

export async function AddUpdateHandheldMasterQuery(model) {
  
  try {
        if (model.ID === 0) {
            const existingRecord = await HandheldMaster.findOne({ HandheldName: model.HandheldName });

            if (existingRecord) {
        
        return{
                isSuccess:'failed',
                statusCode: StatusCodes.CONFLICT,
                message: 'Record Already Exist!'
               }
            }

            const lastRecord = await HandheldMaster.findOne().sort({ ID: -1 }).limit(1);
            model.ID = (lastRecord?.ID ?? 0) + 1;

            const newRecord = new HandheldMaster(model);
            await newRecord.save();
            return{
                    isSuccess:'success',
                    statusCode: StatusCodes.CREATED,
                     message: `HandheldName ${newRecord.HandheldName} Successfully Added `,
                     data: newRecord,
                  }
        } else {
            const existingRecord = await HandheldMaster.findOne({ ID: model.ID });
            if (existingRecord) {
                await HandheldMaster.updateOne({ ID: model.ID }, { $set: model });
              
                return{
                    isSuccess:'success',
                    statusCode: StatusCodes.OK,
                    message: `HandheldName ${existingRecord.ID} Successfully Updated `,
                    data: existingRecord,
                }
            } else {
                 return{
                    isSuccess:'failed',
                    statusCode: StatusCodes.NOT_FOUND,
                    message: 'Record Not Found!',
                }
            }
        }
    } catch (error) {
        return{
            isSuccess:'failed',
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred',
        }
    }

    return {
        isSuccess:'failed',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
    };
}


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
            isSuccess:'success',
            statusCode:StatusCodes.OK,
            message:' HandheldMaster data fetch successfully',
            data: data,
            pageNo: model.pageNo,
            pageSize: model.pageSize,
            rowCount: rowCount
        };
    } catch (ex) {
        return {
            Status: 'Failed',
            Message: ex.message
        };
    }


}

////////////////////////////////////////// DeleteHandheldMasterQuery //////////////////////////////////////////////////////////////////

export async function DeleteHandheldMasterQuery(model) {
    
try {
        if (model.ID !== 0) {
            const entity = await HandheldMaster.findOne({ID:model.ID}); 
            if (entity) {
                await HandheldMaster.deleteOne({ID: model.ID }); 
                
                return{
                    isSuccess:'success',
                    statusCode: StatusCodes.OK,
                    message: `HandheldMaster with ID ${model.ID} Successfully Deleted`,
                }
            } else {
                return{
                    isSuccess:'failed',
                    statusCode: StatusCodes.NOT_FOUND,
                    message: `HandheldMaster with ID ${model.ID} not found`,
                }
            }
        } else {
            return{
                isSuccess:'failed',
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Invalid ID',
            }
        }
    } catch (err) {
        return{
            isSuccess:'failed',
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred',
        }
    }

    return response;

}