import { StatusCodes } from "http-status-codes";
import { VehicleTypeMaster } from "../modals/index.js";
import { ApiSuccessResponse } from "../utils/apiResponse/index.js";

//-----------AddUpdateVehicleType------>
async function AddUpdateVehicleType(req, res, next) {
  try {
    const model = req.body;
    // const db = mongoose.connection.db; // Get MongoDB connection
    // const vehicleTypeCollection = db.collection("VehicleTypes"); // Collection name

    if (model.vehicleTypeId === 0) {
      // add new vehicleTypeMaster
      const lastVehicle = await VehicleTypeMaster.findOne()
        .sort({ VehicleTypeId: -1 })
        .limit(1);
      const newLastVehicle = lastVehicle?.VehicleTypeId + 1 || 1;
      // const vehicleTypeId = model.vehicleTypeId === 0 ? new ObjectId() : model.VehicleTypeId; // Generate new ID if 0

      const Doc = new VehicleTypeMaster({
        VehicleTypeId: newLastVehicle,
        VehicleTypeName: model.vehicleTypename || "",
        ShortName: model.shortName,
        VehicleCode: model.vehicleCode,
        CreatedBy: model.createdBy,
        UpdatedBy: model.updatedBy,
      });
      const newDoc = await Doc.save();

      if (newDoc) {
        return res
          .status(StatusCodes.OK)
          .json(
            new ApiSuccessResponse(StatusCodes.OK, "Successfully Added", newDoc)
          );
      } else {
        const error = new Error("Failed to save. Please try again");
        error.status = StatusCodes.INTERNAL_SERVER_ERROR;
        return next(error);
      }
    }

    // updating exits document  

    const updatedFields = {};

    // Add the fields from the request body if they exist
    if (model.vehicleTypename) updatedFields.VehicleTypename = model.vehicleTypename;
    if (model.shortName) updatedFields.ShortName = model.shortName;
    if (model.vehicleCode) updatedFields.VehicleCode = model.vehicleCode;
    if (model.createdBy) updatedFields.CreatedBy = model.createdBy;
    if (model.updatedBy) updatedFields.UpdatedBy = model.updatedBy;

    const updatedDoc = await VehicleTypeMaster.findOneAndUpdate(
      { VehicleTypeId: model.vehicleTypeId },
      {
        $set: updatedFields,
      },
      { new: true }
    );
    if (!updatedDoc) {
      const error = new Error("This Document is not present");
      error.status = StatusCodes.NOT_FOUND;
      return next(error);
    }
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse(
          StatusCodes.OK,
          "Record is successfully updated.",
          updatedDoc
        )
      );
  } catch (error) {
    const err = new Error(error.message);
    err.status = StatusCodes.BAD_REQUEST;
    return next(err);
  }
}

//-----------GetVehicleType------>
async function GetVehicleType(req, res, next){
        
      try {
        const model = req.body;
        
        const filter = {};
        if (model.vehicleTypeId !== 0) filter.VehicleTypeId = model.vehicleTypeId;
        if (model.vehicleTypename) {
          filter.VehicleTypename = { $regex: model.vehicleTypename, $options: 'i' };  // Case-insensitive search
        }
    
        // Query the VehicleTypeMaster collection
        const result = await VehicleTypeMaster.find(filter);
    
       let msg;
       result.length > 0 ? msg = "default" : msg = "No Record Found!!"
       return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, msg, result))

      } catch (error) {
        const err = new Error(error.message)
        err.status = StatusCodes.INTERNAL_SERVER_ERROR
        return next(err)
      }
}

//-----------DeleteVehicleType------>
async function DeleteVehicleType(req, res, next){
      try {
        const model = req.body;
        if (model.vehicleTypeId === 0) {
            const error = new Error("Invalid VehicleTypeId");
            error.status = StatusCodes.BAD_REQUEST;
            return next(error);
        }
    
        // Delete the document from the VehicleTypeMaster collection
        const result = await VehicleTypeMaster.deleteOne({ VehicleTypeId: model.vehicleTypeId });
    
        // If no document was deleted, the operation was not successful
        if (result.deletedCount === 0) {
            const error = new Error("VehicleType not found");
            error.status = StatusCodes.NOT_FOUND;
            return next(error);
        }
    
        // Set the response message for a successful deletion
        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, 'VehicleType successfully deleted'))
      } catch (error) {
        const err = new Error(error.message);
        error.status = StatusCodes.BAD_REQUEST;
        return next(err);
      }
    
     
}


export { AddUpdateVehicleType, GetVehicleType, DeleteVehicleType };
