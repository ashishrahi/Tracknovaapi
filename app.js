import express from "express";
import dotenv from "dotenv";
import AppRoutes from "./routes/index.js";
import cors from "cors";
import { connectMongoDB, connectTenantDB} from "./db/connectMongoDB.js";
import compression from "compression";
import { ApiErrorResponse } from "./utils/apiResponse/index.js";
import { StatusCodes } from "http-status-codes";
import verifyAccessToken from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import limiter from "./utils/rate-limiter/rateLimiter.js";
import { getLoggedInCompany } from "./middlewares/index.js";


dotenv.configDotenv();

const app = express();

connectMongoDB().catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message || error.ErrorMessage);
    app.set("dbConnectionFailed", true);
    process.exit(1);
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
    origin: ["http://localhost:3000", "http://103.12.1.132:8205" ],  // Allow frontend origin
    // origin: "*",  // Allow frontend origin
    methods: ["GET","POST","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true  // Allow sending cookies with requests
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(cookieParser()); // access to req.cookies
app.use(helmet());
app.use(compression());


// all routes starts from here
app.use(limiter);
// app.use(getLoggedInCompany); // for getting loggedIn company details. When someone logged in.
// app.use(verifyAccessToken)
app.use("/api", AppRoutes);


//Handling the incorrect route
app.use((req, res, next)=>{
    const error = new ApiErrorResponse(404,"InCorrect Route");
    next(error);
})

// Global error handeling
app.use((err, req, res, next) => {
    console.log("error is from central error", err)
    const statusCode = err.status || err.statusCode || err.StatusCode  || 500;  // Default to 500 if undefined
    return res.status(statusCode).json(new ApiErrorResponse(statusCode, err.message|| err.ErrorMessage || "Internal Server Error"));
});


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`App is listening from port ${PORT}`)
});