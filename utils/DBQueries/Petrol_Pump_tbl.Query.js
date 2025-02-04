import { StatusCodes } from "http-status-codes"
import { Petrol_Pump_tbl,ItemMaster } from "../../modals/index.js"

/////////////////////////////////////// AddUpdatePetrolPumpQuery //////////////////////////////////////////////////////////////////

export const AddUpdatePetrolPumpQuery = async (model) => {

    try {
      // Check for blank Petrol Pump name
      if (!model.PetroPump || model.PetroPump.trim() === '') {
     return{
        isSuccess: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Petrol Pump Name is required',
 
     }
      }
  
      if (model.id === 0) {
        // Check if record already exists
        const existingPump = await Petrol_Pump_tbl.findOne({ PetroPump: model.PetroPump });
        if (existingPump) {
         return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: `Petrol Pump Name ${existingPump.PetroPump} already exists`,
            
 
         }
        }
  
        // Generate new ID if needed (Auto-increment logic is optional based on your DB structure)
        const lastPump = await Petrol_Pump_tbl.findOne().sort({ id: -1 });
        model.id = (lastPump?.id || 0) + 1;
  
        // Create a new Petrol Pump
        const newPump = new Petrol_Pump_tbl(model);
        await newPump.save();
  
        return{
            isSuccess:true,
            statusCode: StatusCodes.CREATED,
            message: `Petrol Pump ${newPump.PetroPump} Added Successfully`,
            data: newPump,
        }
      } else {
        // Update existing Petrol Pump
        const updatedPump = await Petrol_Pump_tbl.findOneAndUpdate(
          { id: model.id },
          model,
          { new: true, runValidators: true }
        );
  
        if (!updatedPump) {
          return{
            isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: `Petrol Pump ${updatedPump.PetroPump} not found`,
          }
        }
  return{
     isSuccess: true,
     statusCode: StatusCodes.OK,
     message: `Petrol Pump ${updatedPump.PetroPump} Updated Successfully`,
     data: updatedPump,
 
  }
    
      }
    } catch (error) {
   return{
     isSuccess: false,
     statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
     message: error.message + ';' + (error.innerException? error.innerException : error.message),
   }
    }
  
}

////////////////////////////////////////  GetPetrolPumpVehicleQuery //////////////////////////////////////////////////////////////////

export const GetPetrolPumpVehicleQuery = async (model) => {

    try {
      

        // Mongoose query equivalent of the SQL query
        const vehicles = await ItemMaster.aggregate([
            {
                $match: {
                    ItemFlag: 'V',
                    devid: { $ne: null }, // Filter for non-null 'devid'
                },
            },
            {
                $lookup: {
                    from: 'FuelCorrection', // Replace with the actual collection name
                    localField: 'itemmasterid',
                    foreignField: 'itemmasterid',
                    as: 'FuelCorrections',
                },
            },
            {
                $addFields: {
                    LastFuelCorrDate: {
                        $ifNull: [
                            {
                                $max: '$FuelCorrections.CorrectionDate',
                            },
                            new Date('1900-01-01'), // Default value
                        ],
                    },
                    LatestNTTrackDate: new Date('1900-01-01'), // Default value
                },
            },
            {
                $project: {
                    ItemMasterId: 1,
                    VehicleNo: 1,
                    ItemName: 1,
                    Devid: 1,
                    LastFuelCorrDate: 1,
                    LatestNTTrackDate: 1,
                },
            },
            { $sort: { VehicleNo: 1 } }, // Sort by 'VehicleNo'
        ]);

        return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'Vehicle data fetched successfully',
            data: vehicles,
        };
    } catch (error) {
       return{
         isSuccess: false,
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
         message: error.message + ';' + (error.innerException? error.innerException : error.message),
       }
    }

}


//////////////////////////////////////////////  GetPetrolPumpQuery //////////////////////////////////////////////////////////////////

export const GetPetrolPumpQuery = async (model) => {
   
       try {

        if (model.id === -1) {
          const data = await Petrol_Pump_tbl.find({}).lean(); 
          return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'List of Petrol Pump Data fetched successfully',
            data: data,
          }
        } else {
          // Fetch a specific petrol pump by id
          const result = await Petrol_Pump_tbl.find({ id: model.id }).lean();
          if (result.length > 0) {
           return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: `Details of Petrol Pump ${model.PetroPump} fetched successfully`,
            data: result,
           }
            
           
          } else {
            return{
                isSuccess: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: 'No data found for the given id.',
 
            }
          }
        }
      } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message + ";" + (error.innerException? error.innerException : error.message),
        }
      }
    
}


/////////////////////////////////////////////// DeletePetrolPumpQuery //////////////////////////////////////////////////////////////////

export const DeletePetrolPumpQuery = async (model) => {

    try {
        if (model.id) {
            // Assuming `PetrolPump` is the Mongoose model
            const entity = await Petrol_Pump_tbl.findOne({id:model.id});

            if (entity) {
                await Petrol_Pump_tbl.findOneAndDelete({id:model.id});
                return{
                    isSuccess: true,
                    statusCode: StatusCodes.OK,
                    message: `Petrol Pump ${entity.PetroPump} deleted successfully`,
                }
            } else {
                return{
                    isSuccess: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: `Petrol Pump ${entity.PetroPump} not found`,
                }
            }
        } else {
            return{
                isSuccess: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: `Invalid Petrol Pump ${entity.PetroPump}`,
            }
        }
    } catch (error) {
        return{
            isSuccess: false,
            statusCode:StatusCodes.ERROR,
           message: error.message,
        }
    }

}
