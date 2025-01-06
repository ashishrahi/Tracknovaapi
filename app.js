import express from "express";
import dotenv from "dotenv";
import AppRoutes from "./routes/index.js";
import cors from "cors";
// import connectDBMongo from "./db/connectDBMongo.js";

dotenv.config();

// connectDBMongo();

const app = express();

app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));


const PORT = process.env.PORT;


app.use("/api", AppRoutes);


app.listen(PORT, ()=>{
    console.log(`App is listening from port ${PORT}`)
});