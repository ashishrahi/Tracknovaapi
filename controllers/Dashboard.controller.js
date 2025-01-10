import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import connectDB from "../db/connectDB.js";
import sql from "mssql";
import encryptData from "../utils/crypto/crypto.js";
import { getVehicleDistanceQuery } from "../utils/DBQueries/index.js";
import { client, connectDBMongo } from "../db/connectDBMongo.js";

//-------------- getVehicleDistance ------>

async function getVehicleDistance(req, res) {
  const { vehicleno, datef, datet } = req.body;
  console.log(vehicleno, datef, datet);
  if (
    [vehicleno, datef, datet].some(
      (fields) => fields?.trim() === undefined || ""
    )
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          "Please Provide all valid fields"
        )
      );
  }

  //  MSSQL
  // try {
  //   const pool = await connectDB();

  //   let resultDistance = await pool
  //     .request()
  //     .input("vehicleno", sql.VarChar, vehicleno)
  //     .input("datef", sql.Date, datef)
  //     .input("datet", sql.Date, datet)
  //     .query(getVehicleDistanceQuery.distanceQuery);

  //   let resultIdle = await pool
  //     .request()
  //     .input("vehicleno", sql.VarChar, vehicleno)
  //     .input("datef", sql.Date, datef)
  //     .input("datet", sql.Date, datet)
  //     .query(getVehicleDistanceQuery.idleQuery);

  //     if(!(resultIdle || resultDistance)){
  //       throw new Error(error.message);
  //     }

  //   await pool.close();

  //   if (!resultDistance) {
  //     resultDistance = "No data Found";
  //   }
  //   if (!resultIdle) {
  //     resultIdle = "No data Found";
  //   }
  //   const data = {
  //     resultDistance,
  //     resultIdle,
  //   };

  //   if (!data) {
  //     return res
  //       .status(StatusCodes.NOT_FOUND)
  //       .json(new ApiErrorResponse(StatusCodes.NOT_FOUND, "Data not Found"));
  //   }

  //   return res.status(StatusCodes.OK).json(
  //     new ApiSuccessResponse(
  //       StatusCodes.OK,
  //       "Successfully Fetched the data",
  //       encryptData(data)
  //     )
  //   );
  // }

  // FOR MONGODB
  try {
    // const input = {
    //   vehicleno: vehicleno,
    //   datef: datef,
    //   datet: datet,
    // };
    await connectDBMongo();
    const db = await client.db("inventory");

    const itemMasterData = await db
      .collection("ItemMaster")
      .find({
        VehicleNo: vehicleno,
      })
      .toArray();
      
     

    // console.log("ItemMasterData is: ", itemMasterData);
    // const validDevids = itemMasterData.map((item) => item.devid);
    const { devid, VehicleNo, VehicleTypeId } = itemMasterData[0]
    console.log(devid)
    // console.log("Valid dev ids : ", validDevids);
    

    const resultCursor = await db.collection("NT").aggregate([
      
        {
          $match: {
            TrackDate: {
              $gte: new Date(datef),
              $lte: new Date(datet)
            },
            devid: devid // Filter NT by the list of valid devids
          }
        },
        
        {
          $lookup: {
            from: "ItemMaster",
            localField: "devid",
            foreignField: "devid",
            as: "itemMaster"
          }
        },
      
        {
          $lookup: {
            from: "VehicleTypeMaster",
            localField: "itemMaster.VehicleTypeId",
            foreignField: "VehicleTypeId",
            as: "vehicleTypeMaster"
          }
        },
      
        {
          $group: {
            _id: {
              devid: "$devid",
              VehicleNo: {
                $arrayElemAt: [
                  "$itemMaster.VehicleNo",
                  0
                ]
              },
              // VehicleNo: VehicleNo ,
              VehicleTypeId: {
                $arrayElemAt: [
                  "$vehicleTypeMaster.VehicleTypeId",
                  0
                ]
              },
              // VehicleTypeId : VehicleTypeId,
              VehicleTypename: {
                $arrayElemAt: [
                  "$vehicleTypeMaster.VehicleTypename",
                  0
                ]
              },
              TrackDate: "$TrackDate"
            },
            Distance: { $max: "$distance" }
          }
        },
        {
          $project: {
            _id: 0, // Exclude _id field
            devid: "$_id.devid",
            VehicleNo: "$_id.VehicleNo",
            VehicleTypeId: "$_id.VehicleTypeId",
            VehicleTypename: "$_id.VehicleTypename",
            TrackDate: "$_id.TrackDate",
            Distance: { $toDouble: "$Distance" } // Convert Distance to double
          }
        },
        {
          $sort: { TrackDate: 1 } // Sort by TrackDate if needed
        }
      
      // {
      //   $match: {
      //     TrackDate: {
      //       $gte: new Date("2023-01-01"),
      //       $lte: new Date("2024-01-30"),
      //     },
      //     devid: devid, // Filter NT by the list of valid devids
      //   },
      // },
      // // {
      // //   $lookup: {
      // //     from: "ItemMaster",
      // //     localField: "devid",
      // //     foreignField: "devid",
      // //     as: "itemMaster"

      // //   }
      // // },


      // // {
      // //   $lookup: {
      // //     from: "VehicleTypeMaster",
      // //     localField: "itemMaster.VehicleTypeId",
      // //     foreignField: "VehicleTypeId",
      // //     as: "vehicleTypeMaster",
      // //   },
      // // },
      // {
      //   $group: {
      //     _id: {
      //       devid: "$devid",
      //       // VehicleNo: { $arrayElemAt: ["$itemMaster.VehicleNo", 0] },
      //       VehicleNo: VehicleNo ,
      //       // VehicleTypeId: {
      //       //   $arrayElemAt: ["$vehicleTypeMaster.VehicleTypeId", 0]},
      //       VehicleTypeId : VehicleTypeId,
      //       VehicleTypename: {
      //         $arrayElemAt: ["$vehicleTypeMaster.VehicleTypename", 0],
      //       },
      //       TrackDate: "$TrackDate",
      //     },
      //     Distance: { $max: "$distance" },
      //   },
      // },
      // {
      //   $project: {
      //     _id: 0, // Exclude _id field
      //     devid: "$_id.devid",
      //     VehicleNo: "$_id.VehicleNo",
      //     VehicleTypeId: VehicleTypeId,
      //     VehicleTypename: "$_id.VehicleTypename",
      //     TrackDate: "$_id.TrackDate",
      //     Distance: { $toDouble: "$Distance" }, // Convert Distance to double
      //   },
      // },
      // {
      //   $sort: { TrackDate: 1 }, // Sort by TrackDate if needed
      // },
      // {
      //   $count: "documentCount",
      // },
    ], {allowDiskUse: true});
   
    // const result = await db
    //   .collection("NT")
    //   .aggregate(getDynamicAggregation(vehicleno, datef, datet),  {allowDiskUse: true})
    //   .toArray();
    const result1 = await resultCursor.toArray();
    // console.log("result is : ",result1);
    return res.status(200).json({ data: result1 });
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
  }
}

export { getVehicleDistance };

function getDynamicAggregation(vehicleno, datef, datet) {
  return [
    {
      $match: {
        TrackDate: {
          $gte: new Date(datef),
          $lte: new Date(datet),
        },
      },
    },

    // Step 2: Join with ItemMaster
    {
      $lookup: {
        from: "ItemMaster",
        localField: "devid",
        foreignField: "devid",
        as: "itemMaster",
      },
    },

    // Step 3: Filter by VehicleNo within itemMaster
    {
      $match: {
        "itemMaster.VehicleNo": vehicleno,
      },
    },
    // Step 4: Unwind itemMaster
    // {
    //   $unwind: {
    //     path: "$itemMaster",
    //     preserveNullAndEmptyArrays: false, // Null values are irrelevant here
    //   },
    // },
    // Step 5: Join with VehicleTypeMaster
    {
      $lookup: {
        from: "VehicleTypeMaster",
        localField: "itemMaster.VehicleTypeId",
        foreignField: "VehicleTypeId",
        as: "vehicleTypeMaster",
      },
    },
    // Step 6: Unwind vehicleTypeMaster
    // {
    //   $unwind: {
    //     path: "$vehicleTypeMaster",
    //     preserveNullAndEmptyArrays: false,
    //   },
    // },
    // Step 7: Group by necessary fields
    {
      $group: {
        _id: {
          devid: "$devid",
          VehicleNo: "$itemMaster.VehicleNo",
          // VehicleTypeId: "$itemMaster.VehicleTypeId",
          // VehicleNo: { $arrayElemAt: ["$itemMaster.VehicleNo", 0] },
          // VehicleTypeId: { $arrayElemAt: ["$itemMaster.VehicleTypeId", 0] },
          VehicleTypename: {
            $arrayElemAt: ["$vehicleTypeMaster.VehicleTypename", 0],
          },
          TrackDate: "$TrackDate",
        },
        Distance: { $max: "$distance" },
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id field
        devid: "$_id.devid",
        VehicleNo: "$_id.VehicleNo",
        VehicleTypeId: "$_id.VehicleTypeId",
        VehicleTypename: "$_id.VehicleTypename",
        TrackDate: "$_id.TrackDate",
        Distance: { $toDouble: "$Distance" }, // Convert Distance to double
      },
    },
    {
      $sort: { TrackDate: 1 }, // Sort by TrackDate if needed
    },
  ];

  // return [
  //     {
  //       $match: {
  //         TrackDate: {
  //           $gte: new Date("2024-01-01"),
  //           $lte: new Date("2024-01-02")
  //         }
  //       }
  //     },

  //     // Step 2: Join with ItemMaster and VehicleTypeMaster in one lookup
  //     {
  //       $lookup: {
  //         from: "ItemMaster",
  //         let: { devid: "$devid" }, // Local field to join with ItemMaster
  //         pipeline: [
  //           {
  //             $match: { $expr: { $eq: ["$devid", "$$devid"] } } // Match the devid
  //           },
  //           {
  //             $lookup: {
  //               from: "VehicleTypeMaster",
  //               localField: "VehicleTypeId",
  //               foreignField: "VehicleTypeId",
  //               as: "vehicleTypeMaster"
  //             }
  //           },
  //           {
  //             $unwind: { path: "$vehicleTypeMaster", preserveNullAndEmptyArrays: true }
  //           },
  //         ],
  //         as: "itemMaster"
  //       }
  //     },

  //     // Step 3: Filter by VehicleNo within itemMaster
  //     {
  //       $match: {
  //         "itemMaster.VehicleNo": "UP78GT8446"
  //       }
  //     },

  //     // Step 4: Group by necessary fields
  //     {
  //       $group: {
  //         _id: {
  //           devid: "$devid",
  //           VehicleNo: { $arrayElemAt: ["$itemMaster.VehicleNo", 0] },
  //           VehicleTypeId: { $arrayElemAt: ["$itemMaster.VehicleTypeId", 0] },
  //           VehicleTypename: { $arrayElemAt: ["$itemMaster.vehicleTypeMaster.VehicleTypename", 0] },
  //           TrackDate: "$TrackDate"
  //         },
  //         Distance: { $max: "$distance" }
  //       }
  //     },

  //     // Step 5: Project the results
  //     {
  //       $project: {
  //         _id: 0, // Exclude _id field
  //         devid: "$_id.devid",
  //         VehicleNo: "$_id.VehicleNo",
  //         VehicleTypeId: "$_id.VehicleTypeId",
  //         VehicleTypename: "$_id.VehicleTypename",
  //         TrackDate: "$_id.TrackDate",
  //         Distance: { $toDouble: "$Distance" } // Convert Distance to double
  //       }
  //     },

  //     // Step 6: Sort by TrackDate
  //     {
  //       $sort: { TrackDate: 1 }
  //     }
  //   ]
}

/**
 *  const resultCursor = await db.collection("NT").aggregate([
      {
        $match: {
          TrackDate: {
            $gte: new Date("2023-01-01"),
            $lte: new Date("2024-01-30"),
          },
          devid: devid, // Filter NT by the list of valid devids
        },
      },

      {
        $lookup: {
          from: "VehicleTypeMaster",
          localField: "itemMaster.VehicleTypeId",
          foreignField: "VehicleTypeId",
          as: "vehicleTypeMaster",
        },
      },
      {
        $group: {
          _id: {
            devid: "$devid",
            VehicleNo: { $arrayElemAt: ["$itemMaster.VehicleNo", 0] },
            VehicleNo: VehicleNo,
            // VehicleTypeId: VehicleNo,
            VehicleTypename: {
              $arrayElemAt: ["$vehicleTypeMaster.VehicleTypename", 0],
            },
            TrackDate: "$TrackDate",
          },
          Distance: { $max: "$distance" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          devid: "$_id.devid",
          VehicleNo: "$_id.VehicleNo",
          VehicleTypeId: "$_id.VehicleTypeId",
          VehicleTypename: "$_id.VehicleTypename",
          TrackDate: "$_id.TrackDate",
          Distance: { $toDouble: "$Distance" }, // Convert Distance to double
        },
      },
      {
        $sort: { TrackDate: 1 }, // Sort by TrackDate if needed
      },
      // {
      //   $count: "documentCount",
      // },
    ], {allowDiskUse: true});
 */