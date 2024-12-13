import express from "express";
import dotenv from "dotenv"
import AppRoutes from "./routes/index.js"
const app = express();

dotenv.config();


const PORT = process.env.PORT;


app.use("/api", AppRoutes)

app.listen(PORT, ()=>{
    console.log(`App is listening from port ${PORT}`)
})