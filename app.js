import express from "express";
import dotenv from "dotenv";
import AppRoutes from "./routes/index.js";
import cors from "cors";
import connectMongoDB from "./db/connectMongoDB.js";
import compression from "compression";
import ApiErrorResponse from "./utils/apiResponse/ApiErrorResponse.js";
import { StatusCodes } from "http-status-codes";


dotenv.config();

const app = express();

// connectDBMongo();
connectMongoDB().catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    app.set("dbConnectionFailed", true);
});




app.use((req, res, next) => {
    if (app.get("dbConnectionFailed")) {
        const err = new Error("Database connection failed. Please try again later.");
        err.status = StatusCodes.INTERNAL_SERVER_ERROR;
        return next(err);
    }
    next();
});
app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));

app.use(compression())

app.use("/api", AppRoutes);


//Handling the incorrect route
app.use((req, res, next)=>{
    const error = new Error("InCorrect Route");
    error.status = 404;
    // we need to pass the error as a argument
    next(error);
})


// Global error handeling
// here error get access we passed inside next() fn
app.use((err, req, res, next) => {
    const statusCode = err.status|| err.statusCode || 500;  // Default to 500 if undefined
    return res.status(statusCode).json(new ApiErrorResponse(statusCode, err.message || "Internal Server Error"));
});


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`App is listening from port ${PORT}`)
});