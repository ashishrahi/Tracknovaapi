import { StatusCodes } from 'http-status-codes';
import {HandheldMaster} from '../../modals/index.js';


///////////////////////////////////////// AddUpdateHandheldMasterQuery //////////////////////////////////////////////////////////////////

export async function AddUpdateHandheldMasterQuery(model) {
  
    try {
        if (model.id === 0) {
            const existingRecord = await HandheldMaster.findOne({ HandheldName: model.handheldName });

            if (existingRecord) {
                return {
                    status: 0,
                    message: `HandheldName ${existingRecord.HandheldName} already exists!`
                };
            }

            const lastRecord = await HandheldMaster.findOne().sort({ ID: -1 }).exec();
            model.id = (lastRecord?.ID ?? 0) + 1;

            const newRecord = new HandheldMaster({
                ID: model.id,
                HandheldName: model.handheldName,
                HandheldCode: model.handheldCode,
                CreatedBy: model.createdBy,
                UpdatedBy: model.updatedBy,
            });

            await newRecord.save();

            return {
                status: 1,
                message: `HandheldName ${newRecord.HandheldName} successfully added.`,
                data: {
                    handheldId: newRecord.ID,
                    handheldName: newRecord.HandheldName,
                    handheldCode: newRecord.HandheldCode,
                    createdBy: newRecord.CreatedBy,
                    updatedBy: newRecord.UpdatedBy,
                }
            };
        } else {
            const existingRecord = await HandheldMaster.findOne({ ID: model.id });

            if (!existingRecord) {
                return {
                    status: 0,
                    message: `HandheldID ${model.id} not found!`
                };
            }

            const updatedRecord = await HandheldMaster.findOneAndUpdate(
                { ID: model.id },
                { $set: {
                    HandheldName: model.handheldName,
                    HandheldCode: model.handheldCode,
                    UpdatedBy: model.updatedBy,
                } },
                { new: true } // Returns updated document
            );

            return {
                status: 1,
                message: `HandheldID ${updatedRecord.ID} successfully updated.`,
                data: {
                    handheldId: updatedRecord.ID,
                    handheldName: updatedRecord.HandheldName,
                    handheldCode: updatedRecord.HandheldCode,
                    createdBy: updatedRecord.CreatedBy,
                    updatedBy: updatedRecord.UpdatedBy,
                }
            };
        }
    } catch (error) {
        return {
            status: 0,
            message: error.message
        };
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

        const newData = data.map((handheld)=>{
            return {
                id: handheld.ID,
                handheldName: handheld.HandheldName,
                handheldCode: handheld.HandheldCode,
                createdBy: handheld.CreatedBy,
                updatedBy: handheld.UpdatedBy,
            }
        })
        

        // Count documents in the collection
        const rowCount = await HandheldMaster.countDocuments();

        return {
            status:1,
            message: 'HandheldMaster data fetch successfully',
            data: newData,
            pageNo: model.pageNo,
            pageSize: model.pageSize,
            rowCount: rowCount
        };
    } catch (error) {
        return {
            status:0,
            message: error.message,
        };
    }}

////////////////////////////////////////// DeleteHandheldMasterQuery //////////////////////////////////////////////////////////////////

export async function DeleteHandheldMasterQuery(model) {
    
try {
        if (model.id !== 0) {
            const entity = await HandheldMaster.findOne({ID:model.id}); 
            if (entity) {
                await HandheldMaster.deleteOne({ID: model.id }); 
                
                return{
                    status:1,
                    message: `HandheldMaster with ID ${model.id} Successfully Deleted`,
                }
            } else {
                return{
                    status:0,
                    message: `HandheldMaster with ID ${model.id} not found`,
                }
            }
        } else {
            return{
                status:0,
                message: 'Invalid HandheldMasterID ${model.id}',
            }
        }
    } catch (err) {
        return{
            status:0,
            message: err.message,
        }
    }


}