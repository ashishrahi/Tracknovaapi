
import { StatusCodes } from "http-status-codes";
import {ApiErrorResponse,ApiSuccessResponse} from "../utils/apiResponse/index.js";
import connectDB from "../db/connectDBSql.js";
import { getDashboardQuery,getVehicleQuery,BinLocationQuery } from "../utils/DBQueries/index.js";
import { client, connectDBMongo } from "../db/connectDBMongo.js";
import { BinLocation } from "../modals/BinLocation.modal.js";


//-------------- getDashboard ------>

export async function getDashboard(req, res) {
  try {
    const CurDate = new Date();
    CurDate.setHours(0, 0, 0, 0);
    const summaryNTDash = await getDashboardQuery(CurDate);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      'Dashboard data fetched successfully',
      summaryNTDash
    );
    res.status(successResponse.statusCode).json(successResponse);
  } 
  catch (error) {
    const errorResponse = new ApiErrorResponse(false, StatusCodes.NOT_FOUND, 'Failed to fetch Dashboard');
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//-----------------getVehicleCurrentDay --------------->

export async function getVehicleCurrentDay (req,res){
  const vehicleNo = req.body.vehicleno;

  try {
    const retDat = await getVehicleQuery(vehicleNo);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      'VehicleCurrentDay data fetched successfully',
      retDat
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(false, StatusCodes.NOT_FOUND, 'Failed to fetch vehicle current day');
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
//-------------- getVehicleDistance ------>

export async function getVehicleDistance(req, res) {
  const { vehicleno, datef, datet } = req.body;
  // console.log(vehicleno, datef, datet);
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


  
  try {
    
    await connectDBMongo();
    const db = await client.db("inventory");

    const itemMasterData = await db
      .collection("ItemMaster")
      .find({
        VehicleNo: vehicleno,
      })
      .toArray();
      
     

  
    const { devid, VehicleNo, VehicleTypeId } = itemMasterData[0]
    // console.log(devid)
    

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
      
    ], {allowDiskUse: true});
   
    const result1 = await resultCursor.toArray();
    return res.status(200).json({ data: result1 });
  } catch (error) {
    // console.log(error)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
  }
}
//-------------- getAllBins ------>
export async function getAllBins(req,res) {
  try {
    const { flag } = req.query; 
    const result = await BinLocationQuery(flag);

    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      'AllBins data fetched successfully',
      result
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(false, StatusCodes.NOT_FOUND, 'Failed to fetch All Bins');
    res.status(errorResponse.statusCode).json(errorResponse);
  }
};


export async function getMapBinsWardWise (req,res) {
  const filter = req.query; 
  try {
    const binLocations = await BinsByWardNumberQuery(filter.Where);

    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      'MapBinsWardWise data fetched successfully',
      binLocations
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(false, StatusCodes.NOT_FOUND, 'Failed to fetch All Bins');
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}







// function getDynamicAggregation(vehicleno, datef, datet) {
//   return [
//     {
//       $match: {
//         TrackDate: {
//           $gte: new Date(datef),
//           $lte: new Date(datet),
//         },
//       },
//     },

//     // Step 2: Join with ItemMaster
//     {
//       $lookup: {
//         from: "ItemMaster",
//         localField: "devid",
//         foreignField: "devid",
//         as: "itemMaster",
//       },
//     },
    
//     // Step 3: Filter by VehicleNo within itemMaster
//     {
//       $match: {
//         "itemMaster.VehicleNo": vehicleno,
//       },
//     },
//     // Step 4: Unwind itemMaster
//     // {
//       //   $unwind: {
//         //     path: "$itemMaster",
//         //     preserveNullAndEmptyArrays: false, // Null values are irrelevant here
//         //   },
//         // },
//         // Step 5: Join with VehicleTypeMaster
//         {
//           $lookup: {
//             from: "VehicleTypeMaster",
//         localField: "itemMaster.VehicleTypeId",
//         foreignField: "VehicleTypeId",
//         as: "vehicleTypeMaster",
//       },
//     },
//     // Step 6: Unwind vehicleTypeMaster
//     // {
//       //   $unwind: {
//     //     path: "$vehicleTypeMaster",
//     //     preserveNullAndEmptyArrays: false,
//     //   },
//     // },
//     // Step 7: Group by necessary fields
//     {
//       $group: {
//         _id: {
//           devid: "$devid",
//           VehicleNo: "$itemMaster.VehicleNo",
//           // VehicleTypeId: "$itemMaster.VehicleTypeId",
//           // VehicleNo: { $arrayElemAt: ["$itemMaster.VehicleNo", 0] },
//           // VehicleTypeId: { $arrayElemAt: ["$itemMaster.VehicleTypeId", 0] },
//           VehicleTypename: {
//             $arrayElemAt: ["$vehicleTypeMaster.VehicleTypename", 0],
//           },
//           TrackDate: "$TrackDate",
//         },
//         Distance: { $max: "$distance" },
//       },
//     },
//     {
//       $project: {
//         _id: 0, // Exclude _id field
//         devid: "$_id.devid",
//         VehicleNo: "$_id.VehicleNo",
//         VehicleTypeId: "$_id.VehicleTypeId",
//         VehicleTypename: "$_id.VehicleTypename",
//         TrackDate: "$_id.TrackDate",
//         Distance: { $toDouble: "$Distance" }, // Convert Distance to double
//       },
//     },
//     {
//       $sort: { TrackDate: 1 }, // Sort by TrackDate if needed
//     },
//   ];

//   // return [
//     //     {
//       //       $match: {
//         //         TrackDate: {
//           //           $gte: new Date("2024-01-01"),
//           //           $lte: new Date("2024-01-02")
//           //         }
//           //       }
//           //     },
          
//           //     // Step 2: Join with ItemMaster and VehicleTypeMaster in one lookup
//           //     {
//             //       $lookup: {
//               //         from: "ItemMaster",
//               //         let: { devid: "$devid" }, // Local field to join with ItemMaster
//               //         pipeline: [
//                 //           {
//                   //             $match: { $expr: { $eq: ["$devid", "$$devid"] } } // Match the devid
//                   //           },
//                   //           {
//                     //             $lookup: {
//                       //               from: "VehicleTypeMaster",
//                       //               localField: "VehicleTypeId",
//                       //               foreignField: "VehicleTypeId",
//                       //               as: "vehicleTypeMaster"
//   //             }
//   //           },
//   //           {
//     //             $unwind: { path: "$vehicleTypeMaster", preserveNullAndEmptyArrays: true }
//     //           },
//   //         ],
//   //         as: "itemMaster"
//   //       }
//   //     },

//   //     // Step 3: Filter by VehicleNo within itemMaster
//   //     {
//     //       $match: {
//       //         "itemMaster.VehicleNo": "UP78GT8446"
//       //       }
//       //     },
      
//       //     // Step 4: Group by necessary fields
//       //     {
//         //       $group: {
//           //         _id: {
//             //           devid: "$devid",
//             //           VehicleNo: { $arrayElemAt: ["$itemMaster.VehicleNo", 0] },
//             //           VehicleTypeId: { $arrayElemAt: ["$itemMaster.VehicleTypeId", 0] },
//             //           VehicleTypename: { $arrayElemAt: ["$itemMaster.vehicleTypeMaster.VehicleTypename", 0] },
//             //           TrackDate: "$TrackDate"
//             //         },
//             //         Distance: { $max: "$distance" }
//             //       }
//             //     },
            
//             //     // Step 5: Project the results
//             //     {
//               //       $project: {
//   //         _id: 0, // Exclude _id field
//   //         devid: "$_id.devid",
//   //         VehicleNo: "$_id.VehicleNo",
//   //         VehicleTypeId: "$_id.VehicleTypeId",
//   //         VehicleTypename: "$_id.VehicleTypename",
//   //         TrackDate: "$_id.TrackDate",
//   //         Distance: { $toDouble: "$Distance" } // Convert Distance to double
//   //       }
//   //     },
  
//   //     // Step 6: Sort by TrackDate
//   //     {
//     //       $sort: { TrackDate: 1 }
//     //     }
//     //   ]
// }
  






  