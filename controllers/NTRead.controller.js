import {
  getVehicleNotMovedQuery,
  probWireTampQuery,
} from "../utils/DBQueries/index.js";
import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import connectDB from "../db/connectDB.js";
import sql from "mssql";
import encryptData from "../utils/crypto/crypto.js";
import {
  NTCurrentDay,
  NT,
  ItemMaster,
  VehicleTypeMaster,
  ZoneMaster,
  Department
} from "../modals/index.js";
import { GetNTDashboardPipeline } from "../utils/DBQueries/NTReadControllerPipeline.js";

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
    // ret.IsSuccess = false;
    // ret.Mesg = error.message;
  }

  // return ret;
}

//-------------Geofence----------->
async function Geofence(req, res) {}

//-------------NTCurrent----------->
async function NTCurrent(req, res) {
  // Problem Where is devid from swagger
  const devids = null;
  const pipeline = [
    {
      $match: {
        devid: { $in: devids?.length ? devids : [] },
      },
    },
    {
      $group: {
        _id: "$devid",
        latestRecord: { $first: { $sort: { TrackTime: -1 } } }, // Most recent record
      },
    },
    {
      $lookup: {
        from: "ItemMaster",
        localField: "latestRecord.devid", // Match based on `devid`
        foreignField: "Devid",
        as: "vehicleData",
      },
    },
    {
      $unwind: "$vehicleData", // Flatten the array from the lookup
    },
    {
      $lookup: {
        from: "EmpMaster",
        localField: "vehicleData.EmpId",
        foreignField: "Empid",
        as: "empData",
      },
    },

    {
      $unwind: "$empData", // Flatten the array from the lookup
    },

    {
      $lookup: {
        from: "Departmentmasters",
        localField: "empData.EmpDeptId",
        foreignField: "DepartmentId",
        as: "departmentData",
      },
    },
    {
      $unwind: "$departmentData", // Flatten the array from the lookup
    },
    {
      $project: {
        _id: 0,
        devid: "$latestRecord.devid",
        tracktime: "$latestRecord.TrackTime",
        trackdate: "$latestRecord.TrackDate",
        speed: "$latestRecord.speed",
        Lattitude: "$latestRecord.Lattitude",
        Longitude: "$latestRecord.Longitude",
        nearme: "$latestRecord.nearme",
        distance: "$latestRecord.distance",
        ignition: {
          $cond: [{ $eq: ["$latestRecord.acc", true] }, "On", "Off"],
        },
        flag: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    { $eq: ["$latestRecord.acc", true] },
                    { $gt: ["$latestRecord.speed", 0] },
                  ],
                },
                then: "Running",
              },
              {
                case: {
                  $and: [
                    { $eq: ["$latestRecord.acc", true] },
                    { $eq: ["$latestRecord.speed", 0] },
                  ],
                },
                then: "Idle",
              },
              {
                case: {
                  $and: [
                    { $eq: ["$latestRecord.acc", false] },
                    { $eq: ["$latestRecord.speed", 0] },
                  ],
                },
                then: "Stopped",
              },
            ],
            default: "Unknown",
          },
        },
        vehicleData: {
          VehicleNo: "$vehicleData.VehicleNo",
          DepartmentName: "$departmentData.DepartmentName",
          EmpName: "$empData.EmpName",
          KmPerLitre: "$vehicleData.KmPerLitre",
          LitrePerHr: "$vehicleData.LitrePerHr",
          VehicleTypeId: "$vehicleData.VehicleTypeId",
          VehicleTypename: "$vehicleData.VehicleTypename",
        },
      },
    },
  ];

  // Stage 1: Match documents with `devid` filter (if provided)
  pipeline.push({
    $match: {
      devid: { $in: devids.length ? devids : [] },
    },
  });

  // Stage 2: Group by `devid` and get the most recent document based on `TrackTime`
  pipeline.push({
    $group: {
      _id: "$devid",
      latestRecord: { $first: { $sort: { TrackTime: -1 } } }, // Most recent record
    },
  });

  // Stage 3: Perform a lookup to join with the `ItemMaster`, `EmpMaster`, and `Departmentmasters` collections
  pipeline.push({
    $lookup: {
      from: "ItemMaster",
      localField: "latestRecord.devid", // Match based on `devid`
      foreignField: "Devid",
      as: "vehicleData",
    },
  });

  pipeline.push({
    $unwind: "$vehicleData", // Flatten the array from the lookup
  });

  pipeline.push({
    $lookup: {
      from: "EmpMaster",
      localField: "vehicleData.EmpId",
      foreignField: "Empid",
      as: "empData",
    },
  });

  pipeline.push({
    $unwind: "$empData", // Flatten the array from the lookup
  });

  pipeline.push({
    $lookup: {
      from: "Departmentmasters",
      localField: "empData.EmpDeptId",
      foreignField: "DepartmentId",
      as: "departmentData",
    },
  });

  pipeline.push({
    $unwind: "$departmentData", // Flatten the array from the lookup
  });

  // Stage 4: Process the fields to form the final output
  pipeline.push({
    $project: {
      _id: 0,
      devid: "$latestRecord.devid",
      tracktime: "$latestRecord.TrackTime",
      trackdate: "$latestRecord.TrackDate",
      speed: "$latestRecord.speed",
      Lattitude: "$latestRecord.Lattitude",
      Longitude: "$latestRecord.Longitude",
      nearme: "$latestRecord.nearme",
      distance: "$latestRecord.distance",
      ignition: { $cond: [{ $eq: ["$latestRecord.acc", true] }, "On", "Off"] },
      flag: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  { $eq: ["$latestRecord.acc", true] },
                  { $gt: ["$latestRecord.speed", 0] },
                ],
              },
              then: "Running",
            },
            {
              case: {
                $and: [
                  { $eq: ["$latestRecord.acc", true] },
                  { $eq: ["$latestRecord.speed", 0] },
                ],
              },
              then: "Idle",
            },
            {
              case: {
                $and: [
                  { $eq: ["$latestRecord.acc", false] },
                  { $eq: ["$latestRecord.speed", 0] },
                ],
              },
              then: "Stopped",
            },
          ],
          default: "Unknown",
        },
      },
      vehicleData: {
        VehicleNo: "$vehicleData.VehicleNo",
        DepartmentName: "$departmentData.DepartmentName",
        EmpName: "$empData.EmpName",
        KmPerLitre: "$vehicleData.KmPerLitre",
        LitrePerHr: "$vehicleData.LitrePerHr",
        VehicleTypeId: "$vehicleData.VehicleTypeId",
        VehicleTypename: "$vehicleData.VehicleTypename",
      },
    },
  });

  // Stage 5: Execute the aggregation pipeline
  try {
    const result = await db
      .collection("NTCurrentDay")
      .aggregate(pipeline)
      .toArray();

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse(
          StatusCodes.OK,
         
          result
        )
      );
  } catch (ex) {
    return {
      IsSuccess: false,
      Mesg: ex.message,
    };
  }
}

//-------------VehCurrStat----------->
async function VehCurrStat(req, res) {
  // const vehAll  = NTCurrentDay.aggregate([
  //   {
  //     $sort: { TrackTime: -1 }
  //   },
  //   {
  //     $group: {
  //       _id: "$devid",
  //       veh: { $first: "$$ROOT" }
  //     }
  //   },
  //   {
  //     $facet: {
  //       run: [{ $match: { "veh.acc": true, "veh.speed": { $gt: 0 } } }],
  //       engon: [{ $match: { "veh.acc": true, "veh.speed": 0 } }],
  //       engff: [{ $match: { "veh.acc": false } }]
  //     }
  //   },
  // ])

  // const distCov = NTCurrentDay.aggregate([
  //   {
  //     $sort: { distance: -1 }
  //   },
  //   {
  //     $group: {
  //       _id: "$devid",
  //       dist: { $first: "$distance" }
  //     }
  //   },
  //   {
  //     $match: { dist: { $ne: null } }
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       totalDistance: { $sum: "$dist" }
  //     }
  //   }
  // ]);

  // const totVehGps = ItemMaster.aggregate([
  //   {
  //     $match: {
  //       ItemFlag: { $ne: null, $regex: /^V$/i },
  //       Devid: { $ne: null }
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: "$ZoneName",
  //       count: { $sum: 1 }
  //     }
  //   }
  // ]);

  // const totVehDeptGps = ItemMaster.aggregate([
  //   {
  //     $lookup: {
  //       from: "Departmentmasters",
  //       localField: "deptId",
  //       foreignField: "DepartmentId",
  //       as: "departmentInfo"
  //     }
  //   },
  //   {
  //     $unwind: { path: "$departmentInfo", preserveNullAndEmptyArrays: true }
  //   },
  //   {
  //     $match: {
  //       ItemFlag: { $ne: null, $regex: /^V$/i },
  //       Devid: { $ne: null }
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: "$departmentInfo.DepartmentName",
  //       count: { $sum: 1 }
  //     }
  //   }
  // ]);

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

  console.log("deptStats :", deptStats);

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
        "Successfully Fetched the data",
        stat
      )
    );
}

async function GetDashData(req, res) {}

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

// For VehCurrStat

/**
 * const mongoose = require("mongoose");

// MongoDB Schema Setup
const NTCurrentDay = mongoose.model("NTCurrentDay", new mongoose.Schema({}));
const ItemMaster = mongoose.model("ItemMaster", new mongoose.Schema({}));
const Department = mongoose.model("Department", new mongoose.Schema({}));
const OnRoadZonewise = mongoose.model("OnRoadZonewise", new mongoose.Schema({}));
const OnRoadDeptwise = mongoose.model("OnRoadDeptwise", new mongoose.Schema({}));

// Main function
async function VehCurrStat() {
  try {
    // Fetch the latest vehicle data by devid
    const vehAll = await NTCurrentDay.aggregate([
      {
        $sort: { TrackTime: -1 }, // Sort by TrackTime in descending order
      },
      {
        $group: {
          _id: "$devid",
          veh: { $first: "$$ROOT" }, // Take the first document after sorting
        },
      },
    ]);

    // Categorize vehicles
    const run = vehAll.filter((d) => d.veh.acc === true && d.veh.speed > 0);
    const engon = vehAll.filter((d) => d.veh.acc === true && d.veh.speed === 0);
    const engff = vehAll.filter((d) => d.veh.acc === false);
    const engonTot = vehAll.filter((d) => d.veh.acc === true);

    // Calculate total distance covered
    const distCov = await NTCurrentDay.aggregate([
      {
        $sort: { distance: -1 }, // Sort by distance in descending order
      },
      {
        $group: {
          _id: "$devid",
          dist: { $first: "$distance" }, // Take the first document after sorting
        },
      },
    ]);
    const dist = distCov.reduce((sum, d) => sum + (d.dist || 0), 0);

    // Fetch all vehicles with GPS and zone data
    const totVehGps = await ItemMaster.find({
      ItemFlag: { $exists: true, $regex: /^V$/i },
      Devid: { $ne: null },
    }).select("Devid VZoneID ZoneName");

    // Zone statistics
    const zoneStats = totVehGps.reduce((acc, curr) => {
      const zone = curr.ZoneName || "Unknown";
      acc[zone] = (acc[zone] || 0) + 1;
      return acc;
    }, {});

    // Department statistics
    const totVehDeptGps = await ItemMaster.aggregate([
      {
        $lookup: {
          from: "departments", // Department collection
          localField: "deptId",
          foreignField: "DepartmentId",
          as: "DepartmentData",
        },
      },
    ]);

    const deptStats = totVehDeptGps.reduce((acc, curr) => {
      const department =
        curr.DepartmentData?.[0]?.DepartmentName || "Unknown";
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {});

    // Zonewise on-road statistics
    const onRoadZonewise = await NTCurrentDay.aggregate([
      {
        $lookup: {
          from: "itemmaster",
          localField: "devid",
          foreignField: "devid",
          as: "ZoneData",
        },
      },
      {
        $unwind: "$ZoneData",
      },
      {
        $group: {
          _id: { ZoneName: "$ZoneData.ZoneName", ZoneID: "$ZoneData.VZoneID" },
          zoneCount: { $sum: 1 },
        },
      },
    ]);

    // Department-wise on-road statistics
    const onRoadDeptwise = await NTCurrentDay.aggregate([
      {
        $lookup: {
          from: "itemmaster",
          localField: "devid",
          foreignField: "devid",
          as: "DeptData",
        },
      },
      {
        $unwind: "$DeptData",
      },
      {
        $lookup: {
          from: "departments",
          localField: "DeptData.deptId",
          foreignField: "DepartmentId",
          as: "DepartmentInfo",
        },
      },
      {
        $unwind: "$DepartmentInfo",
      },
      {
        $group: {
          _id: { DepartmentName: "$DepartmentInfo.DepartmentName" },
          deptCount: { $sum: 1 },
        },
      },
    ]);

    // Build the response
    const stat = {
      // Categories
      COT1: [engff.length, engonTot.length],
      labels1: [`${engff.length} - Off`, `${engonTot.length} - On`],

      // Zones
      COT3: Object.values(zoneStats),
      labels3: Object.keys(zoneStats),

      // Departments
      DEPT3: Object.values(deptStats),
      labeldept: Object.keys(deptStats),

      // On-road Zone Stats
      OnRoadZone: onRoadZonewise.map((z) => z.zoneCount),
      labelOnRoadZone: onRoadZonewise.map((z) => z._id.ZoneName || ""),

      // On-road Department Stats
      OnRoadDept: onRoadDeptwise.map((d) => d.deptCount),
      labelOnRoaddept: onRoadDeptwise.map((d) => d._id.DepartmentName || ""),

      // Vehicle counts
      Runningveh: run.length,
      Idleveh: engon.length,
      Stopveh: engff.length,
      Totalveh: run.length + engon.length + engff.length,
      Vehtotal: totVehGps.length,
      Totalvehall: await ItemMaster.countDocuments({
        ItemFlag: { $exists: true, $regex: /^V$/i },
      }),

      // Distance
      TotDistance: Math.round(dist),
    };

    return { isSuccess: true, data: stat };
  } catch (error) {
    console.error("Error in VehCurrStat:", error);
    return { isSuccess: false, error: error.message };
  }
}

// Example usage
VehCurrStat().then((result) => console.log(result));

 */
