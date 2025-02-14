
import { StatusCodes } from "http-status-codes";
import { ApiSuccessResponse,ReturnData } from "../utils/apiResponse/index.js";
import { VendorMaster } from "../modals/index.js"
import formattedData from "../utils/dotnet-like-format/dotnetLikeData.js";
//----------AddUpdateVendorMaster------------>
async function AddUpdateVendorMaster(req, res, next){
    try {
        const modal = req.body;
        // Validate required field
        if (!modal.name || modal.name.trim() === "") {
            return { isSuccess: false, mesg: "Vendor name is required" };
        }

        // Prepare update object dynamically
        const updateFields = {};
        // return res.json({data: Object.keys(modal)})
        Object.keys(modal).forEach((key) => {
            if (modal[key] !== null && modal[key] !== undefined) {
                updateFields[key.charAt(0).toUpperCase() + key.slice(1)] = modal[key];
            }
        });

        // Check if name already exists (only for new entries)
        if (!modal.venderId || modal.venderId === 0) {
            const existingVendor = await VendorMaster.findOne({ Name: modal.name });
            if (existingVendor) {
                const error = new Error("Name already exists")
                error.status = StatusCodes.CONFLICT;
                return next(error);
                // return { isSuccess: false, mesg: "Name already exists" };
            }

            const totalDocs = await VendorMaster.find().sort({VenderId: -1}).limit(1).lean(); // Count total documents
            const newVenderId = (totalDocs[0]?.VenderId || 0) + 1; // Assign new venderId
          
           
            updateFields["VenderId"] = newVenderId;
            
            const newVender = new VendorMaster(updateFields);
            const newDoc = await newVender.save(); 
            if(!newDoc){
                const error = new Error("Please try again. Failed to create new Vendor Master")
                error.status = StatusCodes.INTERNAL_SERVER_ERROR;
                return next(error);
            }
            return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Successfully added", newDoc))

            
        } else {
            // update the existing docs
            const existingDoc = await VendorMaster.findOne({ VenderId: modal.venderId });
            if(!existingDoc){
                const error = new Error("Not Found");
                error.status = StatusCodes.NOT_FOUND;
                return next(error);
            }

            const updatedDoc = await VendorMaster.updateOne({VendorId: modal.venderId}, 
                {$set: updateFields},
                {new : true}
            )

            if(!updatedDoc){
                const error = new Error("Failed to update the document");
                error.status = StatusCodes.INTERNAL_SERVER_ERROR;
                return next(error);
            }

            return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Successfully updated!!",updatedDoc ))
        }    
    } catch (error) {
        const err = new Error(error.message);
        err.status = StatusCodes.INTERNAL_SERVER_ERROR;
        return next(err);
    }
}

//----------GetVendorMaster------------>
async function GetVendorMaster(req, res, next){
    try {
        const { venderId } = req.body; // Extract venderId from request body
        if(!venderId){
            const error = new Error("Please Provide VenderId")
            error.status = StatusCodes.BAD_REQUEST;
            return next(error);
        }
        // Fetch all vendors if venderId is -1, else fetch specific vendor
        const vendors = venderId === -1 
            ? await VendorMaster.find().lean() 
            : await VendorMaster.find({ VenderId: venderId }).lean();

      const newData = formattedData(vendors)


        const msg = vendors.length > 0 ?  "Data Successfully fetched" : "No Record Found"
        return res.status(StatusCodes.OK).json(new ReturnData(true, StatusCodes.OK, msg,null ,newData));

    } catch (error) {
        const err = new Error(error.message);
        return next(err);
    }
}

//----------DeleteVendorMaster------------>
async function DeleteVendorMaster(req, res, next){
    try {
        const { venderId } = req.body;

        // Directly attempt deletion and check if a document was deleted
        const result = await VendorMaster.deleteOne({ VenderId: venderId });

        if (result.deletedCount === 0) {
            const error = new Error("VendorId not found!");
            error.status = StatusCodes.NOT_FOUND;
            return next(error);
        }

        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Successfully deleted" ));
    } catch (error) {
        const err = new Error(error.message);
        err.status = StatusCodes.INTERNAL_SERVER_ERROR;
        return next(err);
    }
}


export { AddUpdateVendorMaster, GetVendorMaster, DeleteVendorMaster };