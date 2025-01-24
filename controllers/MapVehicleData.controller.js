import { StatusCodes } from "http-status-codes";
import { NT } from "../modals/index.js";

async function GetMapVehicleData(req, res, next){
    try {
        const { pageSize , pageNo  } = req.body;

        if(!pageSize || !pageNo){
            const error = new Error("Page No and Page Size is mandatory")
            error.status = StatusCodes.BAD_REQUEST
            return next(error);
        }
        const pagesize = pageSize || 100;
        const pageno = pageNo || 1;
        const filter = { Id: { $gt: 42 } }; // WHERE id > 42

        const result = await NT
            .find(filter) // Apply filter
            .skip((pageno - 1) * pagesize)
            // .project(projection)
            .limit(pageSize) // Select specific fields
            .sort({ TrackTime: 1 }) // ORDER BY TrackTime
            // .toArray(); // Convert cursor to array

        // Transform data into required format
        const mapDetails = result.map(doc => ({
            label: "", // Static empty string
            lng: parseFloat(doc.Longitude), // Convert to decimal
            lat: parseFloat(doc.Lattitude) // Convert to decimal
        }));

        return res.status(200).json({ data: mapDetails, status: "Success", rowCount: mapDetails.length });
    } catch (err) {
        const error = new Error(err.message);
        error.status = StatusCodes.BAD_REQUEST;
        return next(error);
    }
}

export { GetMapVehicleData }