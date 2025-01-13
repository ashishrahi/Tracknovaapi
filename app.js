import express from "express";
import dotenv from "dotenv";
import AppRoutes from "./routes/index.js";
import cors from "cors";
import connectMongoDB from "./db/connectMongoDB.js";
import compression from "compression";
// import connectDBMongo from "./db/connectDBMongo.js";

dotenv.config();

// connectDBMongo();
connectMongoDB()

const app = express();

app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));


// Handling the incorrect route
// app.use((req, res, next)=>{
//     const error = new Error("InCorrect Route");
//     error.status = 404;
//     // we need to pass the error as a argument
//     next(error);
// })

// // here error get access we passed inside next() fn
// app.use((err, req, res, next)=>{
//     res.status(err.status);
//     res.send({
//         error: {
//             status: err.status,
//             message: err.message,       
//         }
//     })
// })

app.use(compression())

app.use("/api", AppRoutes);


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`App is listening from port ${PORT}`)
});