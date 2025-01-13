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
import { NTCurrentDay, NT } from "../modals/index.js";

//----------- Sample ---------------->

async function sample(req, res) {
  try {
    const { devid } = req.query;
    if(!devid){
      return res.status(StatusCodes.NOT_FOUND).json(new ApiErrorResponse(StatusCodes.NOT_FOUND, "Devid is must needed."))
    }
    
    const sixHoursAgo = new Date();
    // 6 hours back time
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
    const fourHoursBackTime = sixHoursAgo.toISOString().slice(0, -1).toString() + "+00:00";
    // console.log("sixHoursAgo",  sixHoursAgo.toString());
    console.log("tryeof: ", typeof fourHoursBackTime)
    console.log("fourHoursBackTime", fourHoursBackTime)
    const query = { 
      ...(devid && {devid : devid}),
      
      TrackTime: { 
        $gt:  new Date(fourHoursBackTime)
        // $gt:  new Date("2024-11-12T00:05:00.343+00:00")
      }
    };

    const data = await NTCurrentDay.find(query).limit(300);

    if(data.length === 0) {
      return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true,
        StatusCodes.OK,
        "No data found", data));
    }

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse(
          
          StatusCodes.OK,
          "Data Successfully fetched",
          data
        )
      );
  } catch (error) {
    

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiErrorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          error.message
        )
      );
  }
}

//-------------SmpCurr----------->

async function SmpCurr(req, res){
  const { trackdate } = req.query;

  try {
    // Converting `currentDay` to a JavaScript Date object
    const currentDay = new Date(trackdate);
    currentDay.setHours(0,0,0,0)
    // Check if the provided day is today
    const today = new Date();
    today.setHours(0,0,0,0)
    ; // doing it so that only time portion set to 0000, only date is needed
    
    if (currentDay.getTime() === today.getTime()) {
      console.log("I am inside if block")
     
      const result = await NTCurrentDay.aggregate([
        {
          $sort: { TrackTime: -1 } 
        },
        {
          $group: {
            _id: "$devid", 
            latestRecord: { $first: "$$ROOT" } // $$ROOT does point to whole docs
          }
        },
        {
          $replaceRoot: { newRoot: "$latestRecord" } // Replace the root with the latest record
        },
      ]);

      const mappedResult = result.map(doc => ({
        devid: doc.devid,
        TrackTime: doc.TrackTime,
        SecondsIdle: doc.SecondsIdle || 0,
        SecondsRun: doc.SecondsRun || 0,
        distance: doc.distance || 0,
        Lattitude: doc.Lattitude || null,
        Longitude: doc.Longitude || null,
        nearme: doc.nearme || null
      }));


      return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, "Data Successfully fetched", mappedResult ))
      
    } else {
      // If `currDay` is not today, query NT collection
      console.log("I am from else block")
      const result = await NT.aggregate([
        {
          $match: {
            TrackTime: {
              $gte: new Date(
                new Date(currentDay).setHours(
                  0,
                  0,
                  0,
                  0
                )
              ),
              // Start of `currDay`
              $lt: new Date(
                new Date(currentDay).setHours(
                  23,
                  59,
                  59,
                  999
                )
              ) // End of `currDay`
            }
          }
        },
        {
          $sort: {
            TrackTime: -1
          } // Sort by `TrackTime` descending
        },
        {
          $group: {
            _id: "$devid",
            // Group by `devid`
            latestRecord: {
              $first: "$$ROOT"
            } // Pick the latest record per group
          }
        },
        {
          $replaceRoot: {
            newRoot: "$latestRecord"
          } // Replace the root with the latest record,
        },
        {
          $addFields: {
            Longitude: {$toDouble: "$Longitude"},
            Lattitude: {$toDouble: "$Lattitude"},
            distance: {$toDouble: "$distance"},
            speedDecimal: {$toDouble: "$speedDecimal"}
          }
        }
      ]);
      // Map the result to the desired structure
      const mappedResult = result.map(doc => ({
        devid: doc.devid,
        TrackTime: doc.TrackTime,
        SecondsIdle: doc.SecondsIdle || 0,
        SecondsRun: doc.SecondsRun || 0,
        distance: doc.distance || 0,
        Lattitude: doc.Lattitude || null,
        Longitude: doc.Longitude || null,
        nearme: doc.nearme || null
      }));

      // ret.Data = mappedResult;
      return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, "Data Successfully fetched", mappedResult ))
    }
  } catch (error) {
    // ret.IsSuccess = false;
    // ret.Mesg = error.message;
  }

  // return ret;



}

//-------------Geofence----------->
async function Geofence (req, res){

}

//-------------NTCurrent----------->
async function NTCurrent(req, res){
  

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
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("date", sql.Date, date)
      .query(probWireTampQuery);

    await pool.close();

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
          "Successfully Fetched the data",
          encryptData(result)
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

//--------------GetVehicleNotMoved------>
async function getVehicleNotMoved(req, res) {
  try {
    const { dateFrom, dateTo } = req.body;
    if ([dateFrom, dateTo].some((date) => date?.trim() === undefined || "")) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          new ApiErrorResponse(
            StatusCodes.BAD_REQUEST,
            "Please Provide Valid Dates"
          )
        );
    }
    const query = getVehicleNotMovedQuery;
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("dateFrom", sql.Date, dateFrom)
      .input("dateTo", sql.Date, dateTo)
      .query(query);

    await pool.close();

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
          "Successfully Fetched the data",
          encryptData(result)
        )
      );
  } catch (error) {
    console.log(error);
  }
}



export { probWireTamp, getVehicleNotMoved, sample, SmpCurr, Geofence, NTCurrent };
