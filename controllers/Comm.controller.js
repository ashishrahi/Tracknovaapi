import { StatusCodes } from "http-status-codes";
import { CommGroup } from "../modals/index.js";
import { ApiSuccessResponse, ApiErrorResponse } from "../utils/apiResponse/index.js"; 
import mongoose from "mongoose";
//-------------GetCommGroup-------->
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

//-------------UpsertCommGroup-------->
async function UpsertCommGroup(req, res){
    try {
    let { groupId, name, description, type, isActive, createdBy, updatedBy} = req.body;
    console.log(req.body)
    
        let existingGroup = await CommGroup.findOne({ Name: name });
        console.log("existingGroup", existingGroup)

        // Check if it's a new record
        // zero means we are updating the record
        if (!groupId || groupId === 0) {
            if (existingGroup) {
                return res.status(StatusCodes.BAD_REQUEST).json({ Data: req.body, Status: "Failed", Message: "Record Already Exists!" });
            }

            // Get the highest GroupId and increment
            let lastGroup = await CommGroup.findOne().sort({ GroupId: -1 });
            groupId = (lastGroup?.GroupId || 0) + 1;

            // Create a new group
            const newGroup = new CommGroup({Name: name, GroupId: groupId, Type:type, Description: description, isActive: isActive, CreatedBy: createdBy, UpdatedBy: updatedBy});
            await newGroup.save();

            return res.status(StatusCodes.CREATED).json({ Status: "Success", Message: "Added Successfully", Data: newGroup });
        } else {
            // Update existing record
            let updatedGroup = await CommGroup.findOneAndUpdate(
                { GroupId: groupId },
                {Name: name, GroupId: groupId, Type:type, Description: description, isActive: isActive, CreatedBy: createdBy, UpdatedBy: updatedBy},
                { new: true } // Return updated document
            );

            if (!updatedGroup) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Status: "Failed", Message: "Internal error. Try again" });
            }

            return res.status(StatusCodes.OK).json({ Status: "Success", Message: "Updated Successfully", Data: updatedGroup });
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ Status: "Failed", Error: error.message });
    }
}

//-------------DeleteCommGroup-------->
async function DeleteCommGroup(req, res){

    try {
    const model = req.body;

    let session = await mongoose.startSession();
    session.startTransaction();

        // Check if GroupId is used in CommMembers
        const existingMember = await CommMembers.findOne({ GroupId: model.groupId }).session(session);
        if (existingMember) {
            await session.abortTransaction();
            session.endSession();
            return res.status(StatusCodes.CONFLICT).json({ Status: "Failed", Message: "GroupId is used in CommMembers, so it can't be deleted." });
        }

        // Delete CommGroup and associated CommMembers
        const deletedGroup = await CommGroup.findOneAndDelete({ GroupId: model.groupId }).session(session);
        const deletedMembers = await CommMembers.deleteMany({ GroupId: model.groupId }).session(session);

        await session.commitTransaction();
        session.endSession();

        if (!deletedGroup) {
            return res.status(StatusCodes.NOT_FOUND).json( { Status: "Failed", Message: "GroupId not found!" });
        }

        return res.status(StatusCodes.OK).json({ Status: "Success", Message: "Deleted Successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Status: "Failed", Error: error.message });
    }

}


export { GetCommGroup, UpsertCommGroup, DeleteCommGroup }