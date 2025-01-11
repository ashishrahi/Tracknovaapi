import mongoose from "mongoose";



async function connectMongoDB() {

    const uri = String(process.env.MONGODB_SERVER_URI)
    const dbName = String(process.env.DB_NAME)
    
    try {
        await mongoose.connect(uri + "/" + dbName);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        // throw new Error(error.message);
    }
}

mongoose.connection.on("connected", ()=>{
    console.log("Mongoose Connected to DB");
})

mongoose.connection.on("error", (err)=>{
    console.log(err.message);
})

mongoose.connection.on("disconnected", ()=>{
    console.log("Mongoose connection is disconnected")
})

process.on("SIGINT", async ()=>{
    await mongoose.connection.close()
    console.log("Mongoose connection closed  ")
    process.exit(0);
})

export default connectMongoDB;