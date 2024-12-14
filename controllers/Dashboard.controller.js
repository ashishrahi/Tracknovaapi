import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import connectDB from "../db/connectDB.js";
import sql from "mssql";
import encryptData from "../utils/crypto/crypto.js";
import { getVehicleDistanceQuery } from "../utils/DBQueries/index.js";

//--------------getVehicleDistance------>
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

  try {
    const pool = await connectDB();
  
    const resultDistance = await pool
      .request()
      .input("vehicleno", sql.VarChar, vehicleno)
      .input("datef", sql.Date, datef)
      .input("datet", sql.Date, datet)
      .query(getVehicleDistanceQuery.distanceQuery);
    
    // if(!resultDistance){
    //   throw new Error(error.message);
    // }
  
    const resultIdle = await pool
      .request()
      .input("vehicleno", sql.VarChar, vehicleno)
      .input("datef", sql.Date, datef)
      .input("datet", sql.Date, datet)
      .query(getVehicleDistanceQuery.idleQuery);

      if(!(resultIdle || resultDistance)){
        throw new Error(error.message);
      }
  
    await pool.close();
  
    if (!resultDistance) {
      resultDistance = "No data Found";
    }
    if (!resultIdle) {
      resultIdle = "No data Found";
    }
    const data = {
      resultDistance,
      resultIdle,
    };
  
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new ApiErrorResponse(StatusCodes.NOT_FOUND, "Data not Found"));
    }
  
    return res.status(StatusCodes.OK).json(
      new ApiSuccessResponse(
        StatusCodes.OK,
        "Successfully Fetched the data",
        encryptData(data)
      )
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message))
  }
}

export { getVehicleDistance };
