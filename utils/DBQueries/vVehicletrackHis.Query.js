import { ZoneMaster,BinLocation,AreaWardMaster,ItemMaster, NT } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

/////////////////////////////////////////// GetvVehicletrackHisQuery //////////////////////////////////////////

export const GetvVehicletrackHisQuery = async (modal) => {
   try {
      const { VehicleNo, dats } = modal;
      
      // Find deviceNo based on vehicleNo
      const device = await ItemMaster.findOne({ VehicleNo: VehicleNo });
      const deviceNo = device ? device.devid.toString() : '';
      console.log('deviceNo',deviceNo)
  
      // Check if deviceNo is valid
      if (!deviceNo) {
        return {
          isSuccess: false,
          status: StatusCodes.NOT_FOUND,
          message: 'Device not found for the given vehicle',
        };
      }
  
// GetVehicleDataFromMultipleDatabases Procedure



      // View of vVehicleHistory
      const vehicleHistory = await NT.aggregate([
        { $match: { deviceNo: deviceNo, dats: dats } },
        {
          $lookup: {
            from: 'ItemMaster',
            localField: 'devid',
            foreignField: 'devid',
            as: 'itemData',
          },
        },
        {
          $unwind: {
            path: '$itemData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'EmpMaster',
            localField: 'itemData.EmpId',
            foreignField: 'Empid',
            as: 'empData',
          },
        },
        {
          $unwind: {
            path: '$empData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            VehicleNo: '$itemData.VehicleNo',
            Lattitude: '$Lattitude',
            Longitude: '$Longitude',
            TrackTime: '$TrackTime',
            Speed: '$speed',
            devid: '$devid',
            id: '$Id',
            EmpName: '$empData.EmpName',
            EmpMobileNo: '$empData.EmpMobileNo',
          },
        },
      ]);
  
      return {
        isSuccess: true,
        status: StatusCodes.OK,
        message: 'Vehicle history data fetched successfully',
        data: vehicleHistory,
      };
    } catch (error) {
      return {
        isSuccess: false,
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
      };
    }
   }