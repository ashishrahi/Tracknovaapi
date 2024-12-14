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

//-------------ProbWireTamp----------->
async function probWireTamp(req, res) {
  const { date } = req.query;
  console.log("date is", date)
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
  ;
  

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


export { probWireTamp, getVehicleNotMoved };
