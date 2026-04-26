import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";

const OVERSPEED_VIEW_COLLECTION =
  process.env.VEHICLE_OVERSPEED_COLLECTION || "VehicleTrackForOverSpeed";

//////////////////////////////////////////////// GetOverSpeedAlertQuery /////////////////////////////////////////////////////

export const GetOverSpeedAlertQuery = async (modal) => {

    try {
        const { tenant_db } = await getTenantDBModels();
        const data = await tenant_db.db
            .collection(OVERSPEED_VIEW_COLLECTION)
            .find({})
            .toArray();
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
