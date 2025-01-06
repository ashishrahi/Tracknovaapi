// import mongoose from "mongoose";
import  { MongoClient } from 'mongodb';


let client;
async function connectDBMongo(){
    try {
        client = new MongoClient("mongodb://127.0.0.1:27017/inventory", {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
          });
          await client.connect();
    } catch (error) {
        console.log(error)
    }
}


// export default connectDBMongo;
export { client, connectDBMongo };