import { StatusCodes } from "http-status-codes";
import { NodePermission } from "../modals/index.js";
import { ApiSuccessResponse } from "../utils/apiResponse/index.js";


async function AddUpdateNodePermission(req, res, next){

    try {
        const model = req.body;
        // **Step 1: Remove existing permissions for the UserId**
        await NodePermission.deleteMany({ UserId: model.userId });

        // **Step 2: Get the current max ID from the collection**
        const maxIdDoc = await NodePermission.find().sort({ ID: -1 }).limit(1);
        let tempID = maxIdDoc.length > 0 ? maxIdDoc[0].ID + 1 : 1;

        // **Step 3: Insert new permissions**
        let data;
        if (model.subNode && model.subNode.length > 0) {
            const newPermissions = model.subNode.map((k, index) => ({
                UserId: model.userId,
                NodeId: k.nodeId,
                ParentId: model.parentId,
                ID: tempID + index // Incremental ID assignment
            }));
            // return res.json({newPermissions})

            data = await NodePermission.insertMany(newPermissions);
        }

        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Successfully Added", data));
    } catch (err) {
        const error = new Error(err.message);
        error.status = StatusCodes.BAD_REQUEST;
        return next(error);
    }
}

async function GetNodePermission(req, res, next){
    
}


export { AddUpdateNodePermission };