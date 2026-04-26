import { StatusCodes } from "http-status-codes";
import formattedData from "../dotnet-like-format/dotnetLikeData.js";
import { getTenantDBModels } from "../../db/index.js";

//////////////////////////////////////////////// GetMapVehicleData /////////////
export async function GetMapVehicleDataQuery() {
  try {
    const { NT } = await getTenantDBModels();

    // Fetch data from MongoDB
    const result = await NT.find({ Id: { $gt: 42 } })
      .sort({ TrackTime: 1 }) // Sort by TrackTime
      .select({
        label: "", // Placeholder for label
        lng: { $convert: { input: "$Longitude", to: "decimal" } }, // Convert Longitude to decimal
        lat: { $convert: { input: "$Lattitude", to: "decimal" } }, // Convert Latitude to decimal
      });
    const response = formattedData(result);
    // Wrap the result in a response format
    return {
      status: 1,
      message: "Map vehicle data retrieved successfully",
      data: response,
      RowCount: response.length,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
}
