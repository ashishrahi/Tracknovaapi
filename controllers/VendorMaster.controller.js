import { StatusCodes } from "http-status-codes";
import { ApiSuccessResponse } from "../utils/apiResponse/index.js";

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
        if (!modal.venderId || modal.vendorId === 0) {
            const existingVendor = await VendorMaster.findOne({ Name: modal.name });
            if (existingVendor) {
                const error = new Error("Name already exists")
                error.status = StatusCodes.CONFLICT;
                return next(error);
                // return { isSuccess: false, mesg: "Name already exists" };
            }
        }

        // Upsert (insert if not exists, update if exists)
        const result = await VendorMaster.findOneAndUpdate(
            { venderId: modal.venderId },
            { $set: updateFields },
            { new: true, upsert: true }
            // because of upsert if doc not found it will insert current document.
        );
        const  msg =  modal.venderId ? "Successfully updated" : "Successfully added";
        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, msg, result))
    } catch (error) {
        return { isSuccess: false, mesg: error.message };
    }
}

export { AddUpdateVendorMaster };