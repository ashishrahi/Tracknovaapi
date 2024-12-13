import sql from "mssql";
import dotenv from "dotenv"

dotenv.config();

const config = {
  server: String(process.env.DB_SERVER_NAME),
  port: Number(process.env.DB_SERVER_PORT),
  database: String(process.env.DB_NAME),
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  options: {
    encrypt: true, // Encrypts the connection (use true if connecting to Azure)
    trustServerCertificate: true, // Use only for development/testing
    multipleActiveResultSets: true, // Allows multiple active result sets
  },
  requestTimeout: 2 * 60 * 1000, // 20 min
  // requestTimeout: 15000, // 20 min
};

// Connect
async function connectDB() {
  try {
    const connection = await sql.connect(config);
    console.log("Connection to the server connected SuccessFully.");
    return connection;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

export default connectDB;
