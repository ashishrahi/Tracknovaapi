import { StatusCodes } from "http-status-codes";
import { AspNetRoles,NT } from "../../modals/index.js";
//////////////////////////////////////////////// GetMapVehicleData /////////////
export async function GetMapVehicleDataQuery(){
    try {
        // Fetch data from MongoDB
        const result = await NT.find({ Id: { $gt: 42 } })
          .sort({ TrackTime: 1 }) // Sort by TrackTime
          .select({
            label: '', // Placeholder for label
            lng: { $convert: { input: '$Longitude', to: 'decimal' } }, // Convert Longitude to decimal
            lat: { $convert: { input: '$Lattitude', to: 'decimal' } }, // Convert Latitude to decimal
          });
    
        // Wrap the result in a response format
        return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'Map vehicle data retrieved successfully',
            data: result,
            RowCount: result.length,
        };
      } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        }
       
      }
}