import { StatusCodes } from 'http-status-codes';
import {Geofencing} from '../../modals/index.js'
////////////////////////////// AddUpdateGeoFencingQuery //////////////////////////////////

export async function AddUpdateGeoFencingQuery(model){
    try {
        model.DateSave = new Date();

        if (!model.FenceId || model.FenceId === 0) {
            // Check if the Fence Name already exists
            const existingFence = await Geofencing.findOne({
                FenceName: { $regex: new RegExp(`^${model.FenceName}$`, "i") },
            });

            if (existingFence) {
                
                return {
                    isSuccess:'success',
                    statusCode: StatusCodes.CONFLICT,
                    message: `${existingFence.FenceName} Already Exists!`,
                    data: model,
                };
            }

            // Assign a new FenceId
            const lastFence = await Geofencing.findOne().sort({ FenceId: -1 });
            model.FenceId = (lastFence?.FenceId || 0) + 1;

            // Save the new fence
            const newFence = new Geofencing(model);
            const savedFence = await newFence.save();

        return{
            isSuccess:true,
            statusCode: StatusCodes.CREATED,
            message: `${newFence.FenceName} Fence added successfully`,
            data: savedFence,
             }
        
    } else {
            // Find the existing fence by FenceId
            const existingFence = await Geofencing.findOne({ FenceId: model.FenceId });

            if (!existingFence) {
               
                return{
                    isSuccess:false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: `${model.FenceName} Fence not found!`,
                    data: model,
                }
            }

            // Update the existing fence
            const updatedFence = await Geofencing.findOneAndUpdate(
                { FenceId: model.FenceId },
                model,
                { new: true } // Return the updated document
            );

          
          return{
            isSuccess:true,
            statusCode: StatusCodes.OK,
            message: `${model.FenceName} Fence updated successfully`,
            data: updatedFence,
          }
        }
    } catch (error) {
        return{
            isSuccess:false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        }
    }

   
}

/////////////////////////////////// GetGeoFencingQuery  //////////////////////////////////////

export async function GetGeoFencingQuery(model){
    try {
        const { where, parameterValues, pageNo, pageSize } = model;

        // Check if 'where' and 'parameterValues' are already objects, if so, skip parsing
        const filter = typeof where === 'string' ? JSON.parse(where) : where;
        const parameters = typeof parameterValues === 'string' ? JSON.parse(parameterValues) : parameterValues;

        // Fetch geofencing data with pagination
        const geofencingData = await Geofencing.find(filter, parameters)
            .skip((pageNo - 1) * pageSize)
            .limit(Number(pageSize))
            .exec();

        // Get the total count of documents for pagination
        const rowCount = await Geofencing.countDocuments(filter);

        return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: "Geofencing fetched successfully",
            data: geofencingData,
            pageNo: Number(pageNo),
            pageSize: Number(pageSize),
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

////////////////////////////////////// DeleteGeoFencingQuery //////////////////////////////////  

export async function DeleteGeoFencingQuery(model){
   
    try {
        if (model.FenceId && model.FenceId !== 0) {
            const entity = await Geofencing.findOneAndDelete({FenceId:model.FenceId});

            if (entity) {
                 return {
                    isSuccess: true,
                    statusCode:StatusCodes.OK,
                    message: `FenceId ${entity.FenceId} Successfully Deleted `,
                }
            } else {
                
                return{
                    isSuccess: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: `${entity.FenceId} not found`,
                }
            }
        } else {
            return{
                isSuccess: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Fence ID is required',
            }
        }
    } catch (error) {
        
    return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        }
    }}