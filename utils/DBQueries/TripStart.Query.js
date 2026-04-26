import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";

// # RouteVehicleMapping #TripMaster

/////////////////////////////////////////////// TripStartEndQuery //////////////////////////////////////////////////////////////

export const TripStartEndQuery = async (model) => {
  try {
    const { ItemMaster } = await getTenantDBModels();

    if (model.isStart) {
      // Get item ID based on vehicle number
      const item = await ItemMaster.findOne({
        VehicleNo: model.VehicleNo.trim(),
      });
      if (!item) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "Vehicle not found",
        };
      }

      // Check if route is assigned to the vehicle
      const routemap = await RouteVehicleMapping.findOne({
        ItemId: item.ItemMasterId,
      });
      if (!routemap) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "No route assigned to this vehicle",
        };
      }

      // Get the next available trip ID
      const tripIds = await TripMaster.find({}, { TripId: 1 });
      let tripId =
        tripIds.length > 0
          ? Math.max(...tripIds.map((trip) => trip.TripId)) + 1
          : 1;

      // Create the trip record
      const trip = new TripMaster({
        TripId: tripId,
        EndTime: null,
        RouteVehicleMappingId: routemap.RouteVehicleId,
        StartTime: new Date(),
        VehicleNo: model.VehicleNo,
      });

      await trip.save();

      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Trip started successfully",
        data: trip,
      };
    } else {
      // If the trip has started, we update it to mark the end time
      const trip = await TripMaster.findOneAndUpdate(
        { VehicleNo: model.VehicleNo, EndTime: null },
        { EndTime: new Date() },
        { new: true }
      );

      if (!trip) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "No trip started for this vehicle",
        };
      }

      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Trip ended successfully",
        data: trip,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};
