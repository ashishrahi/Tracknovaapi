import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";

let connection = {};
const uri = String(process.env.MONGODB_SERVER_URI);

async function connectMongoDB() {

    try {
        const dbName = "central_db"   //String(process.env.DB_NAME)
        connection = await mongoose.connect(uri + "/" + dbName);
        console.log("MongoDB Connected");
        console.log("Connected DB is :",connection.connections[0].name)
        return connection;
    } catch (error) {
        console.error("Database Connection Error:", error.message);
        // error.status = StatusCodes.INTERNAL_SERVER_ERROR;
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message)

    }
}

async function connectTenantDB(dbName) {
    try {
        connection = await mongoose.connect(uri + "/" + dbName);
        console.log("MongoDB Connected");
        return connection;
    } catch (error) {
        console.error("Database Connection Error:", error.message);
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }

}

mongoose.connection.on("connected", () => {
    console.log("Mongoose Connected to DB");
})

mongoose.connection.on("error", (err) => {
    console.log(err.message);
})

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected")
})

process.on("SIGINT", async () => {
    await mongoose.connection.close()
    console.log("Mongoose connection closed")
    process.exit(0);
})

export { connectMongoDB, connectTenantDB };