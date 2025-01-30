// import {
//   getVehicleNotMovedQuery,
//   probWireTampQuery,
// } from "../utils/DBQueries/index.js";
import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import connectDB from "../db/connectDBSql.js";
import sql from "mssql";
// import encryptData from "../utils/crypto/crypto.js";


import {
  NTCurrentDay,
  NT,
  ItemMaster,
  VehicleTypeMaster,
  ZoneMaster,
  Department,
  Geofencing
} from "../modals/index.js";
import { GetNTDashboardPipeline, NTCurrentPipeline } from "../utils/DBQueries/NTReadControllerPipeline.js";

//----------- Sample ---------------->
async function sample(req, res) {
  try {
    const { devid } = req.query;
    if (!devid) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new ApiErrorResponse(StatusCodes.NOT_FOUND, "Devid is must needed.")
        );
    }

    const sixHoursAgo = new Date();
    // 6 hours back time
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
    const fourHoursBackTime =
      sixHoursAgo.toISOString().slice(0, -1).toString() + "+00:00";
    // console.log("sixHoursAgo",  sixHoursAgo.toString());
    console.log("tryeof: ", typeof fourHoursBackTime);
    console.log("fourHoursBackTime", fourHoursBackTime);
    const query = {
      ...(devid && { devid: devid }),

      TrackTime: {
        $gt: new Date(fourHoursBackTime),
        // $gt:  new Date("2024-11-12T00:05:00.343+00:00")
      },
    };

    const data = await NTCurrentDay.find(query).limit(300);

    if (data.length <= 0) {
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiSuccessResponse( StatusCodes.OK, "No data found")
        );
    }

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse(
          StatusCodes.OK,
          data
        )
      );
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
      );
  }
}

//-------------SmpCurr----------->
async function SmpCurr(req, res) {
  const { trackdate } = req.query;

  try {
    // Converting `currentDay` to a JavaScript Date object
    const currentDay = new Date(trackdate);
    currentDay.setHours(0, 0, 0, 0);
    // Check if the provided day is today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // doing it so that only time portion set to 0000, only date is needed

    if (currentDay.getTime() === today.getTime()) {
     
      const result = await NTCurrentDay.aggregate([
        {
          $sort: { TrackTime: -1 },
        },
        {
          $group: {
            _id: "$devid",
            latestRecord: { $first: "$$ROOT" }, // $$ROOT does point to whole docs
          },
        },
        {
          $replaceRoot: { newRoot: "$latestRecord" }, // Replace the root with the latest record
        },
      ]);

      const mappedResult = result.map((doc) => ({
        devid: doc.devid,
        TrackTime: doc.TrackTime,
        SecondsIdle: doc.SecondsIdle || 0,
        SecondsRun: doc.SecondsRun || 0,
        distance: doc.distance || 0,
        Lattitude: doc.Lattitude || null,
        Longitude: doc.Longitude || null,
        nearme: doc.nearme || null,
      }));

      return res
        .status(StatusCodes.OK)
        .json(
          new ApiSuccessResponse(
            StatusCodes.OK,
            mappedResult
          )
        );
    } else {
      // If `currDay` is not today, query NT collection
     
      const result = await NT.aggregate([
        {
          $match: {
            TrackTime: {
              $gte: new Date(new Date(currentDay).setHours(0, 0, 0, 0)),
              // Start of `currDay`
              $lt: new Date(new Date(currentDay).setHours(23, 59, 59, 999)), // End of `currDay`
            },
          },
        },
        {
          $sort: {
            TrackTime: -1,
          }, // Sort by `TrackTime` descending
        },
        {
          $group: {
            _id: "$devid",
            // Group by `devid`
            latestRecord: {
              $first: "$$ROOT",
            }, // Pick the latest record per group
          },
        },
        {
          $replaceRoot: {
            newRoot: "$latestRecord",
          }, // Replace the root with the latest record,
        },
        {
          $addFields: {
            Longitude: { $toDouble: "$Longitude" },
            Lattitude: { $toDouble: "$Lattitude" },
            distance: { $toDouble: "$distance" },
            speedDecimal: { $toDouble: "$speedDecimal" },
          },
        },
      ]);
      // Map the result to the desired structure
      const mappedResult = result.map((doc) => ({
        devid: doc.devid,
        TrackTime: doc.TrackTime,
        SecondsIdle: doc.SecondsIdle || 0,
        SecondsRun: doc.SecondsRun || 0,
        distance: doc.distance || 0,
        Lattitude: doc.Lattitude || null,
        Longitude: doc.Longitude || null,
        nearme: doc.nearme || null,
      }));

      // ret.Data = mappedResult;
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiSuccessResponse(
            StatusCodes.OK,
            mappedResult
          )
        );
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message))
  }
}

//-------------Geofence----------->
async function Geofence(req, res) {

 try {
   const {FenceId, FenceName, dateSaveFr, dateSaveTo} = req.body;
 
   let filter = {};
 
         if (FenceId) {
             filter.FenceId = FenceId; // Exact match
         }
         if (FenceName) {
             filter.FenceName = { $regex: new RegExp(FenceName, "i") }; // Case-insensitive match
         }
         if (dateSaveFr) {
             filter.dateSaveFr = { ...filter.dateSaveFr, $gte: new Date(dateSaveFr) }; // Date >= DateSaveFr
         }
         if (dateSaveTo) {
             filter.dateSaveTo = { ...filter.dateSaveTo, $lte: new Date(dateSaveTo) }; // Date <= DateSaveTo
         }
 
         // Step 2: Query the Geofencing collection
         const geofencingData = await Geofencing.find(filter);
 
         // Step 3: Return response
         return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, geofencingData));
         
 } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message))
 }

}

//-------------NTCurrent----------->
async function NTCurrent(req, res) {
  // const { devids } = req.query;
  const devids = null; 
  const latestRecords = await NTCurrentDay.aggregate([
    {
        $match: devids ? { devid: { $in: devids } } : {} // Filter if devids provided
    },
    {
        $sort: { TrackTime: -1 } // Sort by TrackTime descending
    },
    {
        $group: {
            _id: "$devid",
            latest: { $first: "$$ROOT" } // Get the latest record per device
        }
    },
    {
        $replaceRoot: { newRoot: "$latest" } // Flatten the result
    }
  ])

    // Step 2: Extract Unique Device IDs
    const devidsNt = latestRecords.map(d => d.devid);
    
// return res.json({devidsNt : devidsNt});
     // Step 3: Perform Joins (Lookups)
     const result = await ItemMaster.aggregate([
      {
          $match: { devid: { $in: devidsNt } } // Match only relevant devices
      },
      {
          $lookup: {
              from: "VehicleTypeMaster",
              localField: "VehicleTypeId",
              foreignField: "VehicleTypeId",
              as: "vehicleType"
          }
      },
      { $unwind: { path: "$vehicleType", preserveNullAndEmptyArrays: true } },
      {
          $lookup: {
              from: "EmpMaster",
              // localField: "EmpDeptId",
              localField: "EmpId",
              foreignField: "Empid",
              as: "employee"
          }
      },
      { $unwind: { path: "$employee", preserveNullAndEmptyArrays: true } },
      {
          $lookup: {
              from: "Department",
              localField: "employee.EmpDeptId",
              foreignField: "DepartmentId",
              as: "department"
          }
      },
      { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
      {
          $project: {
              ItemMasterId: 1,
              ItemName: 1,
              KmPerLitre: 1,
              LitrePerHr: 1,
              VehicleNo: 1,
              DepartmentName: "$department.DepartmentName",
              EmpDeptId: "$employee.EmpDeptId",
              EmpName: "$employee.EmpName",
              devid: 1,
              VehicleTypeId: 1,
              VehicleTypename: "$vehicleType.VehicleTypename"
          }
      }
    ]);

    // Step 4: Map Latest Records to Vehicle Data
    const vehicleMap = new Map(result.map(v => [v.devid, v]));
    const ntSummary = latestRecords.map(d => {
        const vehicle = vehicleMap.get(d.devid) || {};
        return {
            id: d._id,
            tracktime: d.TrackTime,
            trackdate: d.TrackDate,
            speed: d.speed,
            Lattitude: d.Lattitude,
            Longitude: d.Longitude,
            nearme: d.nearme,
            devid: d.devid,
            distance: d.distance,
            Ignition: d.acc ? "On" : "Off",
            Flag: !d.acc && d.speed === 0 ? "Stopped" : d.acc && d.speed > 0 ? "Running" : "Idle",
            vehicleno: vehicle.VehicleNo || "",
            Departmentname: vehicle.DepartmentName || "",
            EmpName: vehicle.EmpName || "",
            KmPerLitre: vehicle.KmPerLitre || "",
            LitrePerHr: vehicle.LitrePerHr || "",
            VehicleTypeId: vehicle.VehicleTypeId || "",
            VehicleTypename: vehicle.VehicleTypename || ""
        };
    });

    return res.status(StatusCodes.OK).json(StatusCodes.OK, ntSummary);

    

}

//-------------VehCurrStat----------->
// Done
async function VehCurrStat(req, res) {
  const vehAll = await NTCurrentDay.aggregate([
    {
      $group: {
        _id: "$devid",
        veh: { $first: "$$ROOT" },
      },
    },
    // total got docs = 173
  ]);

  // Filter vehicles into categories
  const run = vehAll.filter((d) => d.veh.acc === true && d.veh.speed > 0);
  const engon = vehAll.filter((d) => d.veh.acc === true && d.veh.speed === 0);
  const engff = vehAll.filter((d) => d.veh.acc === false);
  const engonTot = vehAll.filter((d) => d.veh.acc === true);

  // Calculate total distance
  const distCov = await NTCurrentDay.aggregate([
    {
      $group: {
        _id: "$devid",
        dist: { $first: "$distance" },
      },
    },
  ]);
  const dist = distCov.reduce((sum, d) => sum + (d.dist || 0), 0);

  // Fetch total vehicles with GPS
  const totVehGps = await ItemMaster.find({
    ItemFlag: { $exists: true, $regex: /^V$/i },
    devid: { $ne: null },
  }).select("Devid VZoneID ZoneName");
  // console.log("totVehGps", totVehGps)

  // Zone statistics
  const zoneStats = totVehGps.reduce((acc, curr) => {
    const zone = curr.ZoneName || "Unknown";
    acc[zone] = (acc[zone] || 0) + 1;
    return acc;
  }, {});
  // console.log("zoneStats is ",zoneStats)

  // Department statistics
  const totVehDeptGps = await ItemMaster.aggregate([
    {
      $lookup: {
        from: "Department", // Replace with your actual department collection name
        localField: "deptId",
        foreignField: "DepartmentId",
        as: "DepartmentData",
      },
    },
    // total docs 1100
  ]);

  const deptStats = totVehDeptGps.reduce((acc, curr) => {
    const department = curr.DepartmentData?.[0]?.DepartmentName || "Unknown";
    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {});

  // console.log("deptStats :", deptStats);

  // Prepare response data
  const stat = {
    COT1: [engff.length, engonTot.length],
    labels1: [`${engff.length} - Off`, `${engonTot.length} - On`],
    COT3: Object.values(zoneStats),
    labels3: Object.keys(zoneStats),
    DEPT3: Object.values(deptStats),
    labeldept: Object.keys(deptStats),
    Runningveh: run.length,
    Idleveh: engon.length,
    Stopveh: engff.length,
    Totalveh: run.length + engon.length + engff.length,
    Vehtotal: totVehGps.length,
    Totalvehall: await ItemMaster.countDocuments({
      ItemFlag: { $exists: true, $regex: /^V$/i },
    }),
    TotDistance: Math.round(dist),
  };

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiSuccessResponse(
        StatusCodes.OK,
        stat
      )
    );
}

//-------------GetDashData----------->
async function GetDashData(req, res) {
 try {
   const {FenceId, FenceName, lsVehType, lsVehNos, dateSaveFr, dateSaveTo} = req.body;
  //  Step 1: Fetch Geofencing data
  
  let filter = {};
 
  if (FenceId) {
      filter.FenceId = FenceId; // Exact match
  }
  if (FenceName) {
      filter.FenceName = { $regex: new RegExp(FenceName, "i") }; // Case-insensitive match
  }
  // if (dateSaveFr) {
  //     filter.dateSaveFr = { ...filter.dateSaveFr, $gte: new Date(dateSaveFr) }; // Date >= DateSaveFr
  // }
  // if (dateSaveTo) {
  //     filter.dateSaveTo = { ...filter.dateSaveTo, $lte: new Date(dateSaveTo) }; // Date <= DateSaveTo
  // }

  // Step 2: Query the Geofencing collection
  const geofencingData = await Geofencing.find(filter);
 
   let devs = [];
   let dret = []
   // Step 2: Fetch Device IDs based on conditions
   if (lsVehType?.length === 0 && lsVehNos?.length === 0) {
       // Case 1: No vehicle type or numbers specified → Get all NTCurrent data
       dret = await NTCurrentPipeline();
   } else if (lsVehType?.length > 0 && lsVehNos?.length === 0) {
       // Case 2: Filter by vehicle type
       devs = await ItemMaster
           .find({ VehicleTypeId: { $in: lsVehType } }, { projection: { devid: 1 } })
       devs = devs.map(d => d.devid);
       dret = await NTCurrentPipeline(devs);
   } else {
       // Case 3: Filter by vehicle numbers
       devs = await ItemMaster
           .find({ VehicleNo: { $in: lsVehNos }  })
           
           // console.log("devs", devs)
       devs = devs.map(d => d.devid);
       dret = await NTCurrentPipeline(devs);
       console.log("dret", dret)
   }
 
   // Step 3: Handle NTCurrent response
   if (!dret) {
       return res.status(StatusCodes.NO_CONTENT).json(new ApiSuccessResponse(StatusCodes.NO_CONTENT, "No data found"));
   }
 
   // Step 4: Construct response
   return  res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, {lisGeofencing: geofencingData ,ListNTSumm: dret}))
  
   
 } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message))
 }

}

//-------------getVehicleNotMoved----------->
// Done
async function getVehicleNotMoved(req, res) {
  try {
    const pipeline = [
      // Step 1: Filter NT collection for the required date range and create flags for NTMV and NTREC
      {
        $match: {
          TrackTime: {
            $gte: new Date("2024-11-12"),
            $lte: new Date("2024-11-12"),
          },
        },
      },
      {
        $addFields: {
          isNTMV: { $eq: ["$acc", 1] }, // Flag for NTMV
        },
      },

      // Step 2: Group NT data by devid to get distinct devices for NTMV and NTREC
      {
        $group: {
          _id: "$devid",
          hasNTMV: { $max: { $cond: ["$isNTMV", 1, 0] } }, // Indicates if the device is in NTMV
        },
      },

      // Step 3: Lookup additional details from other collections
      {
        $lookup: {
          from: "ItemMaster",
          localField: "id",
          foreignField: "devid",
          as: "vehicleDetails",
        },
      },
      {
        $unwind: { path: "$vehicleDetails", preserveNullAndEmptyArrays: true },
      },

      // Step 4: Join with Employee, Department, VehicleType, and Zone collections
      {
        $lookup: {
          from: "EmpMaster",
          localField: "vehicleDetails.EmpId",
          foreignField: "Empid",
          as: "employeeDetails",
        },
      },
      {
        $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "Department",
          localField: "employeeDetails.EmpDeptId",
          foreignField: "DepartmentId",
          as: "departmentDetails",
        },
      },
      {
        $unwind: {
          path: "$departmentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "VehicleTypeMaster",
          localField: "vehicleDetails.VehicleTypeId",
          foreignField: "VehicleTypeId",
          as: "vehicleTypeDetails",
        },
      },
      {
        $unwind: {
          path: "$vehicleTypeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "ZoneMaster",
          localField: "vehicleDetails.VZoneID",
          foreignField: "ZoneID",
          as: "zoneDetails",
        },
      },
      { $unwind: { path: "$zoneDetails", preserveNullAndEmptyArrays: true } },

      // Step 5: Project final output
      {
        $project: {
          Devid: "$_id",
          VehicleNo: "$vehicleDetails.VehicleNo",
          VehicleTypename: "$vehicleTypeDetails.VehicleTypename",
          EmpName: "$employeeDetails.EmpName",
          EmpMobileNo: "$employeeDetails.EmpMobileNo",
          DepartmentName: "$departmentDetails.DepartmentName",
          ZoneName: "$zoneDetails.ZoneName",
          NTRecord: "$hasNTMV", // 1 if NTMV, 0 otherwise
        },
      },

      // Step 6: Filter out devices not in NTMV
      {
        $match: {
          NTRecord: 0, // Exclude records present in NTMV
        },
      },

      // Step 7: Sort and add row numbers
      { $sort: { Devid: 1 } },
      {
        $setWindowFields: {
          sortBy: { Devid: 1 },
          output: {
            SrNo: { $rank: {} },
          },
        },
      },
    ];

    // Execute the pipeline
    const results = await NT.aggregate(pipeline);
    return res.json({ data: results });
  } catch (error) {
    console.log(error);
  }
  // const ntRecPipeline = [
  //   {
  //     $match: {
  //       TrackTime: { $gte: new Date("2024-01-14"), $lte: new Date("2024-01-15") },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: "$devid",
  //     },
  //   },
  //   {
  //     $project: {
  //       devid: "$_id",
  //       _id: 0,
  //     },
  //   },
  //   { $out: "NTREC" },
  // ];

  // const vehsPipeline = [
  //   {
  //     $lookup: {
  //       from: "EmpMaster",
  //       localField: "EmpId",
  //       foreignField: "Empid",
  //       as: "employeeDetails",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "Department",
  //       localField: "employeeDetails.EmpDeptId",
  //       foreignField: "DepartmentId",
  //       as: "departmentDetails",
  //     },
  //   },
  //   {
  //     $match: {
  //       $expr: { $eq: [{ $toUpper: "$ItemFlag" }, "V"] },
  //       Devid: { $ne: null },
  //     },
  //   },
  //   {
  //     $project: {
  //       Devid: 1,
  //       VehicleNo: 1,
  //       ItemName: 1,
  //       VehicleTypeId: 1,
  //       VZoneID: 1,
  //       EmpName: { $arrayElemAt: ["$employeeDetails.EmpName", 0] },
  //       EmpMobileNo: { $arrayElemAt: ["$employeeDetails.EmpMobileNo", 0] },
  //       DepartmentName: { $arrayElemAt: ["$departmentDetails.DepartmentName", 0] },
  //     },
  //   },
  //   { $out: "VEHS" },
  // ];

  // Aggregation for the final stage

  // Execute each pipeline

  // try {
  //   const { dateFrom, dateTo } = req.body;
  //   if ([dateFrom, dateTo].some((date) => date?.trim() === undefined || "")) {
  //     return res
  //       .status(StatusCodes.BAD_REQUEST)
  //       .json(
  //         new ApiErrorResponse(
  //           StatusCodes.BAD_REQUEST,
  //           "Please Provide Valid Dates"
  //         )
  //       );
  //   }
  //   const query = getVehicleNotMovedQuery;
  //   const pool = await connectDB();
  //   const result = await pool
  //     .request()
  //     .input("dateFrom", sql.Date, dateFrom)
  //     .input("dateTo", sql.Date, dateTo)
  //     .query(query);

  //   await pool.close();

  //   if (!result) {
  //     return res
  //       .status(StatusCodes.NOT_FOUND)
  //       .json(new ApiErrorResponse(StatusCodes.NOT_FOUND, "Data not Found"));
  //   }
  //   return res
  //     .status(StatusCodes.OK)
  //     .json(
  //       new ApiSuccessResponse(
  //         StatusCodes.OK,
  //         "Successfully Fetched the data",
  //         encryptData(result)
  //       )
  //     );
  // } catch (error) {
  //   console.log(error);
  // }
}

// This APi is ready
//--------------GetNTDashboard------>
async function GetNTDashboard(req, res) {
  try {
    // Filter out records without VehicleNo
    const ntList = await GetNTDashboardPipeline()
    const data = ntList.filter((nt) => nt.VehicleNo);
    return res.status(200).json(new ApiSuccessResponse(200, data));
  } catch (error) {
    return res.status(StatusCodes.NOT_FOUND).json(new ApiErrorResponse(StatusCodes.NOT_FOUND, error.message))
  }
  
}

//--------------GetTopFuelCons------>
async function GetTopFuelCons(req, res) {
  let { pos } = req.query;
  if(!pos) pos = 1;
  try {
    const ntList = await GetNTDashboardPipeline()
    const fuelData = ntList.filter((nt) => nt.VehicleNo).slice(0, pos);
    const result = fuelData.map((fu, index) => ({
      SrNo: index + 1,
      ConsDate: fu.TrackTime ? fu.TrackTime.toISOString().split("T")[0] : null,
      TrackTime: fu.TrackTime,
      Devid: fu.devid,
      Departmentname: fu.DepartmentName,
      VehicleNo: fu.VehicleNo,
      Ignition: fu.Ignition,
      EmpName: fu.EmpName,
      EmpMobileNo: fu.EmpMobileNo,
      ZoneName: fu.ZoneName,
      speed: fu.speed,
      SecondsIdle: fu.SecondsIdle || 0,
      SecondsRun: fu.SecondsRun || 0,
      VehicleTypename: fu.VehicleTypename,
      IdleTime: fu.IdleTime,
      FuelConsumed: fu.Fuel,
      KmPerlitre: fu.KmPerLitre,
      LitrePerhr: fu.LitrePerHr,
      Flag: fu.flag,
      PurchaseYear: fu.PurchaseYear,
      ModelNo: fu.ModelNo,
      SerialNo: fu.SerialNo,
      ChesisNo: fu.ChesisNo,
      HSNCode: fu.HSNCode,
      VehicleWeight: fu.VehicleWeight,
      Mileage: fu.Mileage,
      FuelTankCapacity: "", // Add default value
    }));
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, result))
  } catch (error) {
    return res.status(StatusCodes.OK).json(new ApiErrorResponse(StatusCodes.NOT_FOUND, error.message))
  }
}

//--------------GetTopFuelConsNT------>
async function GetTopFuelConsNT(req, res){
  try {
    const { zoneid } = req.query;
    if(!zoneid){
      return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please provide zone id"))
    }
  
    const ntList = await GetNTDashboardPipeline();
    const fuelData = ntList.filter((nt)=> nt.ZoneName === `Zone ${zoneid}`);
  
     // Map the data to the required structure
     const result = fuelData.map((fu, index) => ({
      Srno: index + 1,
      TrackTime: fu.TrackTime,
      devid: fu.devid,
      DepartmentName: fu.DepartmentName,
      VehicleNo: fu.VehicleNo,
      Ignition: fu.Ignition,
      EmpName: fu.EmpName,
      EmpMobileNo: fu.EmpMobileNo,
      ZoneName: fu.ZoneName,
      speed: fu.speed,
      SecondsIdle: fu.SecondsIdle,
      SecondsRun: fu.SecondsRun,
      VehicleTypename: fu.VehicleTypename,
      IdleTime: fu.IdleTime,
      Fuel: fu.Fuel,
      flag: fu.flag,
    }));
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, result));
  } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message))
  }
}

//--------------GetTopFuelConsNTOnOff------>
async function GetTopFuelConsNTOnOff(req, res){
  try {
  const { onoff } = req.query;
  if(!onoff){
    return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please provide ignition type in true or false"))
  }
   const ntList = await GetNTDashboardPipeline();
   let fuelData;
   if(onoff === "true"){
     fuelData = ntList.filter((nt)=> nt.Ignition === "On");
   } else {
    fuelData = ntList.filter((nt)=> nt.Ignition === "Off")
   }

   const result = fuelData.map((fu, index) => ({
    Srno: index + 1,
    TrackTime: fu.TrackTime,
    devid: fu.devid,
    DepartmentName: fu.DepartmentName,
    VehicleNo: fu.VehicleNo,
    Ignition: fu.Ignition,
    EmpName: fu.EmpName,
    EmpMobileNo: fu.EmpMobileNo,
    ZoneName: fu.ZoneName,
    speed: fu.speed,
    SecondsIdle: fu.SecondsIdle,
    SecondsRun: fu.SecondsRun,
    VehicleTypename: fu.VehicleTypename,
    IdleTime: fu.IdleTime,
    Fuel: fu.Fuel,
    PurchaseYear: fu.PurchaseYear,
    ModelNo: fu.ModelNo,
    SerialNo: fu.SerialNo,
    ChesisNo: fu.ChesisNo,
    HSNCode: fu.HSNCode,
    VehicleWeight: fu.VehicleWeight,
    Mileage: fu.Mileage,
    flag: fu.flag, 
  }));
   
  return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, result));

 } catch (error) {
  return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message))
 }

}

//-------------ProbWireTamp----------->
async function probWireTamp(req, res) {
  const { date } = req.query;
  console.log("date is", date);
  if (!date) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          "Please Provide Valid Date"
        )
      );
  }
  try {
    // const pool = await connectDB();
    // const result = await pool
    //   .request()
    //   .input("date", sql.Date, date)
    //   .query(probWireTampQuery);

    // await pool.close();
    const result = await NT.aggregate([
      {
        $match: {
          TrackTime: {
            $gte: new Date(
              new Date(date).setHours(
                0,
                0,
                0,
                0
              )
            ),
            $lt: new Date(
              new Date(date).setHours(
                23,
                59,
                59,
                999
              )
            )
          },
          acc: false,
          speed: { $gt: 10 }
        }
      },
      // Stage 2: Group by `devid` to find the latest `TrackTime`
      {
        $group: {
          _id: "$devid",
          LatestTrackTime: { $max: "$TrackTime" }
        }
      },
      // Stage 3: Lookup `ItemMaster` to join data
      {
        $lookup: {
          from: "ItemMaster",
          localField: "_id",
          foreignField: "devid",
          as: "itemData"
        }
      },
      // Stage 4: Unwind the joined `itemData` array
      {
        $unwind: {
          path: "$itemData",
          preserveNullAndEmptyArrays: false
        }
      },
      // Stage 5: Lookup `EmpMaster` for employee details
      {
        $lookup: {
          from: "EmpMaster",
          localField: "itemData.EmpId",
          foreignField: "Empid",
          as: "empData"
        }
      },
      // Stage 6: Unwind the joined `empData` array
      {
        $unwind: {
          path: "$empData",
          preserveNullAndEmptyArrays: true
        }
      },
      // Stage 7: Lookup `Department` for department details
      {
        $lookup: {
          from: "Department",
          localField: "empData.EmpDeptId",
          foreignField: "DepartmentId",
          as: "departmentData"
        }
      },
      // Stage 8: Unwind the joined `departmentData` array
      {
        $unwind: {
          path: "$departmentData",
          preserveNullAndEmptyArrays: true
        }
      },
      // Stage 9: Add fields for projections and calculated values
      {
        $addFields: {
          Devid: "$_id",
          ItemMasterId: "$itemData.ItemMasterId",
          VehicleNo: {
            $ifNull: ["$itemData.VehicleNo", ""]
          },
          EmpDeptId: {
            $ifNull: ["$empData.EmpDeptId", 0]
          },
          DepartmentName: {
            $ifNull: [
              "$departmentData.DepartmentName",
              ""
            ]
          }
        }
      },
      // Stage 10: Project the final structure
      {
        $project: {
          _id: 0,
          srno: { $literal: null }, // Placeholder for sorting later
          date: "$LatestTrackTime",
          ItemMasterId: 1,
          VehicleNo: 1,
          Devid: 1,
          DeptId: "$EmpDeptId",
          DepartmentName: 1
        }
      },
      // Stage 11: Sort by `Devid`
      {
        $sort: {
          Devid: 1
        }
      },
      // Stage 12: Add a sequential `srno` field
      {
        $setWindowFields: {
          sortBy: { Devid: 1 },
          output: {
            srno: {
              $documentNumber: {}
            }
          }
        }
      }
    ])

    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new ApiErrorResponse(StatusCodes.NOT_FOUND, "Data not Found"));
    }
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse(
          StatusCodes.OK,
          result
          // encryptData(result)
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
      );
  }
}

//-------------GetRunningStatus----------->
async function GetRunningStatus(req, res){
  try {
    const { stat } = req.query;
    if(!stat){
      return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please provide valid running status"))
    }
    const ntList = await GetNTDashboardPipeline();
    const flatNtList = ntList.flat();

    let filter = {};

    switch (stat.toLowerCase()) {
      case "running":
        filter = flatNtList.filter((ac) => ac.acc === true && ac.speed > 0);
        break;
      case "idle":
        filter = flatNtList.filter((ac) => ac.acc === true && ac.speed === 0);
        break;
      case "stop":
        filter = flatNtList.filter((ac) => ac.acc === false && ac.speed === 0);
        break;
      default:
        throw new Error("Invalid status provided");
    }

    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, filter));
  } catch (error) {
    return res.status(StatusCodes.OK).json(new ApiErrorResponse(StatusCodes.NOT_FOUND, error.message))
  }
}

//-------------GetLongIdleVeh----------->
async function GetLongIdleVeh(req, res){
  let { nos } = req.query;
  if(!nos) nos = 1 

  const ntList = await GetNTDashboardPipeline();

  // Flatten the array of arrays into a single array
  // const flatNtList = ntList.flat();

  // Sort by SecondsIdle in descending order and take the top 'nos' records
  const fuelNos = ntList
    .sort((a, b) => b.SecondsIdle - a.SecondsIdle)
    .slice(0, nos);

  // Map the data to match the expected structure
  const formattedData = fuelNos.map((fu, index) => ({
    SrNo: index + 1,
    ConsDate: fu.TrackTime, // MongoDB stores dates as ISO strings
    TrackTime: fu.TrackTime,
    Devid: fu.devid,
    Departmentname: fu.DepartmentName,
    VehicleNo: fu.VehicleNo,
    Ignition: fu.Ignition,
    EmpName: fu.EmpName,
    EmpMobileNo: fu.EmpMobileNo,
    ZoneName: fu.ZoneName,
    speed: fu.speed,
    SecondsIdle: fu.SecondsIdle,
    SecondsRun: fu.SecondsRun,
    VehicleTypename: fu.VehicleTypename,
    IdleTime: fu.IdleTime,
    FuelConsumed: fu.Fuel,
    KmPerlitre: fu.KmPerLitre,
    LitrePerhr: fu.LitrePerHr,
    Flag: fu.flag,
    PurchaseYear: fu.PurchaseYear,
    ModelNo: fu.ModelNo,
    SerialNo: fu.SerialNo,
    ChesisNo: fu.ChesisNo,
    HSNCode: fu.HSNCode,
    VehicleWeight: fu.VehicleWeight,
    Mileage: fu.Mileage,
    FuelTankCapacity: "", // Same as in C# code
  }));

  return res.json( {
    Data: formattedData,
    IsSuccess: true,
  });
}

//-------------GetVehicleMovement----------->
async function GetVehicleMovement(req, res){
  try {
    const {dateFrom, dateTo, deptId, zoneId, lisVehicleNos} = req.body;
  
    if (!deptId && !zoneId && (!lisVehicleNos || lisVehicleNos.length === 0)) {
     return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Provide at least one of DeptId, ZoneId, or lisVehicleNos. Data is too large."));
    }

    const dateDiff = Math.floor((new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24));
    if (dateDiff > 30 || dateDiff < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Date range should be less than a month."));
    }

    // **Step 1: Get List of Relevant Vehicles (ItemMaster + EmpMaster)**
    const vehicles = await ItemMaster.aggregate([
      {
        $lookup: {
          from: "EmpMaster",
          localField: "EmpId",
          foreignField: "Empid",
          as: "empData",
        },
      },
      { $unwind: { path: "$empData", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          ItemFlag: "V",
          ...(deptId ? { "empData.EmpDeptId": request.deptId } : {}),
          ...(zoneId ? { VZoneID: request.zoneId } : {}),
        },
      },
      {
        $project: {
          devid: "$devid",
          ItemMasterId: 1,
          ZoneId: "$VZoneID",
          DeptId: "$empData.EmpDeptId",
          Vehno: "$VehicleNo",
        },
      },
    ])

    if (!vehicles.length) {
      return { IsSuccess: true, Data: [] };
    }
    // console.log("vehicles", vehicles)

     // **Step 2: Filter by Vehicle Numbers (if provided)**
     let filteredVehicles = vehicles;
     if (lisVehicleNos && lisVehicleNos.length > 0) {
       const vehicleSet = new Set(lisVehicleNos.map((v) => v.toUpperCase()));
       filteredVehicles = vehicles.filter((v) => vehicleSet.has(v.Vehno.toUpperCase()));
     }
    //  console.log("filteredVehicles", filteredVehicles)
     const deviceIds = filteredVehicles.map((v) => v.devid);
     console.log("deviceIds", deviceIds)

     const ntData = await NT.aggregate([
      {
        $match: {
          devid: { $in: deviceIds },
          TrackTime: {
            $gte: new Date(dateFrom),
            $lte: new Date(dateTo),
          },
        },
      },
      { $sort: { VehicleNo: 1, TrackTime: 1 } },
    ])

    if (!ntData.length) {
      return res.status(StatusCodes.NO_CONTENT).json(new ApiSuccessResponse(StatusCodes.NO_CONTENT, []));
    }

     // **Step 4: Fetch Departments & Zones in One Query**
     const deptIds = [...new Set(filteredVehicles.map((v) => v.DeptId))].filter(Boolean);
     const zoneIds = [...new Set(filteredVehicles.map((v) => v.ZoneId))].filter(Boolean);

     console.log("deptIds", deptIds)
     console.log("zoneIds", zoneIds)
    
     const departments = await Department.find(
      { DepartmentId: { $in: deptIds } },
    //  { collationto: { locale: "en", strength: 2 } }
      ).collation({ locale: "en", strength: 2 })

      const zones = await ZoneMaster.find(
        { ZoneID: { $in: zoneIds } }
      //  , { collationto: { locale: "en", strength: 2 } }
      ).collation({ locale: "en", strength: 2 })

     const deptMap = new Map(departments.map((d) => [d.DepartmentId, d.DepartmentName]));
     const zoneMap = new Map(zones.map((z) => [z.ZoneID, z.ZoneName]));
     const vehicleMap = new Map(filteredVehicles.map((v) => [v.devid, v]));

     for (const nt of ntData) {
      const vehicle = vehicleMap.get(nt.devid) || "";
      nt.DepartmentName = deptMap.get(vehicle?.DeptId) || "";
      nt.ZoneName = zoneMap.get(vehicle?.ZoneId) || "";
      nt.VehicleNo = vehicle?.Vehno || "";
    }

    return res.status(200).json(new ApiSuccessResponse(200, ntData))

  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(error.status, error.message))
  }
}


export {
  probWireTamp,
  getVehicleNotMoved,
  sample,
  SmpCurr,
  Geofence,
  NTCurrent,
  VehCurrStat,
  GetDashData,
  GetNTDashboard,
  GetTopFuelCons,
  GetTopFuelConsNT,
  GetTopFuelConsNTOnOff,
  GetRunningStatus,
  GetLongIdleVeh,
  GetVehicleMovement
  
};

