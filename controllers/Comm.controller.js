import { StatusCodes } from "http-status-codes";
import { CommGroup } from "../modals/index.js";
import { ApiSuccessResponse, ApiErrorResponse } from "../utils/apiResponse/index.js"; 

async function GetCommGroup(req, res){
    const { PageNo, PageSize, Name, Type } = req.body;
       // query
    const query = {}
    if(Name) query.Name = Name;
    if(Type) query.Type = Type.toUpperCase();
   
    // Step 2: Pagination Setup
    const pageNo = PageNo || 1; // Default Page Number
    const pageSize = PageSize || 10; // Default Page Size
    const skip = (pageNo - 1) * pageSize; // Calculate documents to skip

 
    // Step 3: Fetch Total Count
    const totalCount = await CommGroup.countDocuments(query);

    // Step 4: Fetch Paginated Data
    const lNM = await CommGroup
        .find(query, { projection: { _id: 0 } }) // Exclude `_id` if not needed
        .skip(skip) // Skip previous pages
        .limit(pageSize) // Limit to page size
        

    // Step 5: Return Response
    return res.status(StatusCodes.OK).json({
        Data: lNM,
        Status: "Success",
        PageNo: pageNo,
        PageSize: pageSize,
        RowCount: totalCount, // Total records count
        TotalPages: Math.ceil(totalCount / pageSize)} // Calculate total pages
    )
    
    
    // {
        // Data: lNM,
        // Status: "Success",
        // PageNo: pageNo,
        // PageSize: pageSize,
        // RowCount: totalCount, // Total records count
        // TotalPages: Math.ceil(totalCount / pageSize), // Calculate total pages
    // };
}

async function UpsertCommGroup(req, res){

}


export { GetCommGroup, UpsertCommGroup }