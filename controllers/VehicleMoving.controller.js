import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse, ReturnData } from "../utils/apiResponse/index.js";
import { ItemMaster, NT } from "../modals/index.js";
import { trackDetailsNT, VehicleMovingStatusdetnew } from "../utils/DBQueries/VehicleMovingControllerPipeline.js";
import { VehicleMovingControllerPipeline } from "../utils/DBQueries/index.js";
import formattedData from "../utils/dotnet-like-format/dotnetLikeData.js";

//-----------VehicleTrack-------->
async function VehicleTrack(req, res, next) {
  const response = { Status: "Failed", Message: "", Data: [] };

  try {
    const filter = req.body;

    // Convert dates to MongoDB-compatible format
    const startDate = new Date(filter.date1);
    const endDate = new Date(filter.date2);

    // Step 1: Filter vehicles based on input criteria
    let vehicleFilter = { ItemFlag: "v" }; // Assuming 'v' indicates vehicles
    if (filter.str1) {
      vehicleFilter.VehicleNo = filter.str1; // Filter by vehicle number
    }
    if (filter.intnotnullvalue1 > 0) {
      vehicleFilter.EmpId = filter.intnotnullvalue1; // Filter by employee ID
    }
    if (filter.intnotnullvalue2 > 0) {
      vehicleFilter.VehicleTypeId = filter.intnotnullvalue2; // Filter by vehicle type ID
    }

    // Fetch relevant vehicles
    const vehicles = await ItemMaster.find(vehicleFilter).lean();
    // return res.json({vehicles})
    const devIds = vehicles.map((v) => v.devid).filter((devid) => devid); // Extract DevIds
    // console.log("devIds", devIds);

    // Step 2: Fetch track details for the filtered vehicles within the date range
    const trackFilter = {
      DevID: { $in: devIds }, // Filter by DevIds
      TrackDate: { $gte: startDate, $lte: endDate },
    };
    // Add additional filters if provided
    if (filter.list1 && filter.list1.length > 0) {
      trackFilter.VehicleNo = { $in: filter.list1 }; // Filter by vehicle numbers
    }
    if (filter.listInt1 && filter.listInt1.length > 0) {
      trackFilter.VehicleTypeID = { $in: filter.listInt1 }; // Filter by vehicle type IDs
    }

    const trackDetails = await trackDetailsNT(trackFilter);
    // console.log("trackDetails", trackDetails)
    // Step 3: Transform track details into the desired format
    const transformedData = trackDetails.map((track) => {
      const runningTime = track.Running
        ? track.Running.split(/[\s:]+/)
        : [0, 0, 0];
      const runningInSec =
        parseInt(runningTime[0]) * 3600 +
        parseInt(runningTime[1]) * 60 +
        parseInt(runningTime[2]);

      return {
        TrackDate: track.TrackDate,
        VehicleNo: track.VehicleNo || "NA",
        DevId: track.DevID,
        DriverName: track.DriverName,
        MobileNo: track.MobileNo,
        Department: track.Department,
        VehicleType: track.VehicleType || "NA",
        DistanceKM: track.DistanceKM || 0,
        Running: track.Running,
        hr: parseInt(runningTime[0]),
        min: parseInt(runningTime[1]),
        sec: parseInt(runningTime[2]),
        runninginsec: runningInSec,
        Idle: track.Idle,
        StartTime: track.StartTime,
        EndTime: track.EndTime,
        StartLoc: track.StartLoc,
        EndLoc: track.EndLoc,
        FuelConsumption: track.FuelConsumption || "0.00",
        FuelAlloted: track.FuelAlloted || "0.00",
        OpeningBalance: track.OpeningBalance || "0",
        StopTime: track.StopTime,
        ModelNo: track.ModelNo || "NA",
        KmPerLitre: track.KmPerLitre || 0,
        LitrePerHr: track.LitrePerHr || 0,
        AvgSpeed: track.AvgSpeed || 0,
        MaxSpeed: track.MaxSpeed || 0,
        RunningIdleTime: track.RunningIdleTime,
        DriverMob: `${track.DriverName}\nMobile:[${track.MobileNo}]`,
        DepartVtype: `${track.Department}\nVehicleType:[${track.VehicleType}]`,
        VehicleDev: `${track.VehicleNo}\nDeviceId:[${track.DevId}]`,
      };
    });

    // Step 4: Apply additional filtering based on Condition2 and intvalue4
    if (filter.Condition2 && filter.intvalue4 > 0) {
      const vehicleCounts = {};
      transformedData.forEach((track) => {
        vehicleCounts[track.VehicleNo] =
          (vehicleCounts[track.VehicleNo] || 0) + 1;
      });

      const filteredData = transformedData.filter(
        (track) => vehicleCounts[track.VehicleNo] <= filter.intvalue4
      );
      response.Data = filteredData;
    } else {
      response.Data = transformedData;
    }
    response.Status = "Success";
    response.Message = "Data retrieved successfully";
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, response.Message, response.Data));
  } catch (ex) {
    const error = new Error(ex.message);
    error.status = StatusCodes.BAD_REQUEST;
    return next(error);
  }
}

//-----------VehicleMovingTrackStatusdetnew-------->
async function VehicleMovingTrackStatusdetnew(req, res, next) {
  try {
    const filter = req.body;
    // let retStat = "";

    const lsTrack = await VehicleMovingControllerPipeline.VehicleMovingStatusdetnew(filter);

    const data = formattedData(lsTrack?.Data)
    if (filter.Show) {
      return res.status(StatusCodes.OK).json(data);
    }
    return res.status(StatusCodes.OK).json(data);
    
  } catch (error) {
    error.StatusCode = StatusCodes.BAD_REQUEST;
    error.ErrorMessage = error.message;
    return next(error);
  }

  }
//-----------GetVechicleMileageSummary-------->
async function GetVechicleMileageSummary(req, res, next) {
  try {
    const filter = req.body;
    const { Data } = await VehicleMovingStatusdetnew(filter);
    const vehicleData = Data;
   

    // Filter drivers with "jit" in their name
    const filteredData = vehicleData.filter((v) =>
      v.DriverName?.toLowerCase().includes("jit")
    );

    if (filter.show) {
      return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, "default", filteredData));
    }

    // Handle Export (PDF/XLS)
    
  } catch (error) {
    const err = new Error(error.message);
    err.status = StatusCodes.BAD_REQUEST;
    return next(err);
}


}

//-----------VehicleDetailSummarynew-------->
async function VehicleDetailSummarynew(req, res, next){
  try {
    const filter = req.body;
    const { Data } = await VehicleMovingStatusdetnew(filter);
    const data = formattedData(Data);
    
    return res.status(StatusCodes.OK).json(data);

  } catch (error) {
    error.StatusCode = StatusCodes.BAD_REQUEST;
    error.ErrorMessage = error.message;
    return next(error);
  }
}

//-----------GetDevTamp-------->

async function GetDevTamp(req, res, next) {
  try {
    const model = req.body;
    // Ensure date range is provided
    if (!model.date1 || !model.date2) {
      throw new ApiErrorResponse("date1 and date2 are required.", StatusCodes.BAD_REQUEST);
    }
    let startDate;
    let endDate;
    if(model.date1) startDate = model.date1;
    if(model.date2) endDate = model.date2;
   

     const fromDate = new Date(model.date1 )
     const toDate = new Date(model.date2)
    // Construct filter conditions
    const matchQuery = {
      "TrackTime": {
          $gte: fromDate,
          $lte: toDate,
      }
    };

    // Handle Department filtering
    if (model.listInt1?.length) {
        matchQuery.DeptId = { $in: model.listInt1 };
    }

    // Handle Vehicle Number filtering
    if (model.list1?.length > 0) {
        matchQuery.VehicleNo = { $in: model.list1 };
    }




    const matchConditions = {
        "ntData.TrackTime": { $gte: fromDate, $lte: toDate },
        "ItemFlag": "V"
    };

    // if (vehicleNos?.length > 0) {
    //     matchConditions["ItemMaster.VehicleNo"] = { $in: vehicleNos };
    // }

    // if (deptIds.length > 0) {
    //     matchConditions["EmpMaster.EmpDeptId"] = { $in: deptIds };
    // }

    const results = await NT.aggregate([
      {
        $match: {
          TrackTime: {
            $gte: fromDate,
            // Replace with @FuelDateFrom
            $lte: toDate // Replace with @FuelDateTo
          },
          speed: {
            $gt: 12
          },
          acc: false
        }
      },
      {
        $lookup: {
          from: "ItemMaster",
          localField: "devid",
          foreignField: "devid",
          as: "item"
        }
      },
      {
        $unwind: "$item"
      },
      {
        $match: {
          "item.ItemFlag": "V"
        }
      },
      {
        $lookup: {
          from: "EmpMaster",
          localField: "item.EmpId",
          foreignField: "Empid",
          as: "emp"
        }
      },
      {
        $unwind: {
          path: "$emp",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "Department",
          localField: "emp.EmpDeptId",
          foreignField: "DepartmentId",
          as: "dept"
        }
      },
      {
        $unwind: {
          path: "$dept",
          preserveNullAndEmptyArrays: true
        }
      },
     
      // {
      //   $match: {
      //     $or: [
      //       {
      //         "item.VehicleNo": {
      //           $in: ["Vehicle1", "Vehicle2"]
      //         }
      //       },
      // Replace with @VehicleNos
      //       {
      //         "emp.EmpDeptId": {
      //           $in: [101, 102]
      //         }
      //       } // Replace with @DeptIds
      //     ]
      //   }
      // }

      {
        $sort: {
          trackTime: -1,
          vehicleNo: 1
        }
      },
      {
        $group: {
          _id: {
            trackTime: "$TrackTime",
            devid: "$devid"
          },
          trackTime: {
            $first: "$TrackTime"
          },
          devid: {
            $first: "$devid"
          },
          vehicleNo: {
            $first: "$item.VehicleNo"
          },
          deptId: {
            $first: "$emp.EmpDeptId"
          },
          departmentName: {
            $first: "$dept.DepartmentName"
          }
        }
      },
      
      {
        $project: {
        _id: 0,
        // trackTime: 1,
        // devid: 1,
        // vehicleNo: 1,
        // deptId: 1,
        // departmentName: 1,

      }
    }
    ])
    return res.status(StatusCodes.OK).json(new ReturnData(true, true, "Data Fetched Successfully", null, results));
} catch (error) {
  console.error("Error in getFuelWireTamp:", error);
  return next(new ApiErrorResponse(error.message, error.StatusCode || StatusCodes.BAD_REQUEST));
}
}

//-----------VehicleFuelConsumenew-------->

async function VehicleFuelConsumenew(req, res, next) {

  try {
    
const filter = req.body;
const fuelComsumed = await VehicleMovingControllerPipeline.VehicleMovingStatusdetnew(filter)
const data = formattedData(fuelComsumed?.Data)

if (filter.Show) {
  return res.status(StatusCodes.OK).json(data)
}
return res.status(StatusCodes.OK).json(data)
  } catch (error) {
    error.StatusCode = StatusCodes.BAD_REQUEST
    error.ErrorMessage = error.message
    return next(error)
  }


}






export {
  VehicleTrack,
  VehicleMovingTrackStatusdetnew,
  GetVechicleMileageSummary,
  GetDevTamp,
  VehicleFuelConsumenew,
  VehicleDetailSummarynew
};
