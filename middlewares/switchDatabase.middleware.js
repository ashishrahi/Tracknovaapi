import mongoose from "mongoose";
// import { Request, Response, NextFunction } from "express";

let connections = {}; // Store active connections

export const switchDatabase = async (req, res, next) => {
  try {
    const { company } = req.body;
    if (!company || !company.dbName) {
      return res.status(400).json({ message: "Company database information missing" });
    }

    const { dbName } = company;

    // If already connected, attach it to the request
    if (connections[dbName]) {
      req.db = connections[dbName];
      return next();
    }

    // Create a new connection if not already established
    const db = mongoose.createConnection(
      `mongodb://localhost:27017/${dbName}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    connections[dbName] = db;
    req.db = db;

    console.log(`🔹 Connected to database: ${dbName}`);
    next();
  } catch (error) {
    console.error("Database switching error:", error);
    res.status(500).json({ message: "Error switching database", error });
  }
};
