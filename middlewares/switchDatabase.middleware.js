import mongoose from "mongoose";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import { StatusCodes } from "http-status-codes";
import { middlewareResponse as apiResponse } from "../utils/static-response-message/index.js";
import { connectTenantDB } from "../db/connectMongoDB.js";
// import { Request, Response, NextFunction } from "express";

let connections = {}; // Store active connections

async function switchDatabase(req, res, next) {
  try {
    const company = req.company;
    console.log("company is", company);

    if (!company) {
      next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Please Login"));
    }

    //  if(company && company.admin.role === "SuperAdmin"){
    //     return new ApiSuccessResponse(true, StatusCodes.OK, "Login Successfull", { redirect: "/company", message: "Super Admin Dashboard" } )
    //  }

    
    const { database } = company;
    
    // If already connected, attach it to the request
    const tenantDB = await connectTenantDB(dbName);

    if (!tenantDB) {
      throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiResponse.failedDbConnection)
    }
    // Create a new connection if not already established
    // const db = mongoose.createConnection(`${process.env.MONGODB_SERVER_URI}/${database.dbName}`);

    // if(!db){
    //   throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiResponse.failedDbConnection)
    // }

    // connections[database.dbName] = db;
    req.db = tenantDB;

    console.log(`🔹 Connected to database: ${database.dbName}`);
    next();
  } catch (error) {
    console.error("Database switching error:", error);
    return res.status(500).json(new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error switching database"));
  }
};


export default switchDatabase;