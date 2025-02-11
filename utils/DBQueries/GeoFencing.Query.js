import { StatusCodes } from 'http-status-codes';
import { Geofencing } from '../../modals/index.js'

////////////////////////////// AddUpdateGeoFencingQuery //////////////////////////////////

export async function AddUpdateGeoFencingQuery(model){
    try {
        model.DateSave = new Date();

        if (!model.fenceId || model.fenceId === 0) {
            // Check if the Fence Name already exists
            const existingFence = await Geofencing.findOne({
                FenceName: { $regex: new RegExp(`^${model.fenceName}$`, "i") },
            });

            if (existingFence) {
                
                return {
                    status:'success',
                    message: `${existingFence.FenceName} Already Exists!`,
                    data: model,
                };
            }

            // Assign a new FenceId
            const lastFence = await Geofencing.findOne().sort({ FenceId: -1 });
            model.fenceId = (lastFence?.FenceId || 0) + 1;

            // Save the new fence
            const newFence = new Geofencing({
                FenceId: model.fenceId,
                FenceName: model.fenceName,
                polycord: model.polycord,
                Lattitude:model.lattitude,
                Longitude:model.longitude,
                Radius:model.radius,
                DateSave:model.dateSave,
                CompanyId: model.companyId,
                flag: model.flag,
                AreaId:model.areaId
            });
            await newFence.save();

            const createdNew = {
                fenceId: newFence.FenceId,
                fenceName: newFence.FenceName,
                polycord: newFence.polycord,
                lattitude:newFence.Lattitude,
                longitude:newFence.Longitude,
                radius:newFence.Radius,
                dateSave:newFence.DateSave,
                companyId: newFence.CompanyId,
                flag: newFence.flag,
                areaId:newFence.AreaId
            }

        return{
            status:true,
            message: `${newFence.FenceName} Fence added successfully`,
            data: createdNew,
             }
        
    } else {
            // Find the existing fence by FenceId
            const existingFence = await Geofencing.findOne({ FenceId: model.FenceId });

            if (!existingFence) {
               
                return{
                    status:false,
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

            const updatedata = {
                fenceId: existingFence.FenceId,
                fenceName: existingFence.FenceName,
                polycord: existingFence.polycord,
                updatedBy: existingFence.updatedBy,
                lattitude: existingFence.Lattitude,
                longitude: existingFence.Longitude,
                radius: existingFence.Radius,
                dateSave: existingFence.DateSave,
                companyId: existingFence.CompanyId,
                flag: existingFence.flag,
                areaId:existingFence.AreaId
            }

            return{
            status:true,
            message: `${model.FenceName} Fence updated successfully`,
            data: updatedata,
          }
        }
    } catch (error) {
        return{
            status:false,
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


const getData = geofencingData.map((data)=>{
    return{
        fenceId: data.FenceId,
        fenceName: data.FenceName,
        polycord: data.polycord,
        updatedBy: data.updatedBy,
        lattitude: data.Lattitude,
        longitude: data.Longitude,
        radius: data.Radius,
        dateSave: data.DateSave,
        companyId: data.CompanyId,
        flag: data.flag,
        areaId:data.AreaId
    }
})


        // Get the total count of documents for pagination
        const rowCount = await Geofencing.countDocuments(filter);

        return {
            status: true,
            message: "Geofencing fetched successfully",
            data: getData,
       
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
        if (model.fenceId && model.fenceId !== 0) {
            const entity = await Geofencing.findOneAndDelete({FenceId:model.fenceId});

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