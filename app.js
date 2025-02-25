import express from "express";
import dotenv from "dotenv";
import AppRoutes from "./routes/index.js";
import cors from "cors";
import connectMongoDB from "./db/connectMongoDB.js";
import compression from "compression";
import { ApiErrorResponse } from "./utils/apiResponse/index.js";
import { StatusCodes } from "http-status-codes";
import verifyAccessToken from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import limiter from "./utils/rate-limiter/rateLimiter.js";


dotenv.config();

const app = express();

// connectDBMongo();
connectMongoDB().catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    app.set("dbConnectionFailed", true);
});

app.use((req, res, next) => {
    if (app.get("dbConnectionFailed")) {
        const err = new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Database connection failed. Please try again later.");
        // err.StatusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        return next(err);
    }
    next();
});
app.use(cors({
    origin: ["http://localhost:3000", "http://103.12.1.132:8205"],  // Allow frontend origin
    methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
    credentials: true  // Allow sending cookies with requests
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(cookieParser()); // access to req.cookies
app.use(compression());

// all routes starts from here
app.use(limiter);
app.use(verifyAccessToken)
app.use("/api", AppRoutes);


//Handling the incorrect route
app.use((req, res, next)=>{
    const error = new ApiErrorResponse(404,"InCorrect Route");
    // we need to pass the error as a argument
    next(error);
})


// Global error handeling
app.use((err, req, res, next) => {
    const statusCode = err.status || err.statusCode || err.StatusCode  || 500;  // Default to 500 if undefined
    return res.status(statusCode).json(new ApiErrorResponse(statusCode, err.message|| err.ErrorMessage || "Internal Server Error"));
});


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`App is listening from port ${PORT}`)
});