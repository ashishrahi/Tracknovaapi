import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";


//////////////////////////////////////////////// GetOverSpeedAlertQuery /////////////////////////////////////////////////////

export const GetOverSpeedAlertQuery = async (modal) => {

    try {
        const data = await VehicleTrackForOverSpeed.find();
        return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'List of Over Speed Alert fetched successfully',
            data:data
        }
      } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Error in GetOverSpeedAlertQuery: ${error.message}`,
        }
      }
}
