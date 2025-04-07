import { StatusCodes } from "http-status-codes";
import { VehicleTypeMaster, ItemMaster } from "../modals/index.js";
import { ApiSuccessResponse, CommonResponse, DBReturn } from "../utils/apiResponse/index.js";
import { getTenantDBModels } from "../db/index.js";


//-----------AddUpdateVehicleType------>
async function AddUpdateVehicleType(req, res, next) {
  try {
    const {VehicleTypeMaster } = await getTenantDBModels()

    const model = req.body;
    console.log('model:',model)
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
        VehicleTypename: model.vehicleTypename || "",
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
            new DBReturn(true, null, null, `${newDoc.vehicleTypename} Successfully Added`,   newDoc)
          );
      } else {
        const error = new Error("Failed to save. Please try again");
        error.status = StatusCodes.INTERNAL_SERVER_ERROR;
        return next(error);
      }
    }

    // updating exits document  

    const updatedFields = {};

// Dynamically add fields only if they exist and are not null/undefined
if (model.vehicleTypename) updatedFields.VehicleTypename = model.vehicleTypename;
if (model.shortName) updatedFields.ShortName = model.shortName;
if (model.vehicleCode) updatedFields.VehicleCode = model.vehicleCode;
if (model.createdBy) updatedFields.CreatedBy = model.createdBy;
if (model.updatedBy) updatedFields.UpdatedBy = model.updatedBy;

const updatedDoc = await VehicleTypeMaster.findOneAndUpdate(
  { VehicleTypeId: model.vehicleTypeId },
  { $set: updatedFields },
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
          true,
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
    const {VehicleTypeMaster,ItemMaster } = await getTenantDBModels()

        const model = req.body;
        

        let filter = {};
        if (model.vehicleTypeId !== 0 || model.vehicleTypeId !== -1) filter.VehicleTypeId = model.vehicleTypeId;
        if (model.vehicleTypename?.trim() !== "") {
          filter.VehicleTypename = { $regex: model.vehicleTypename, $options: 'i' };  // Case-insensitive search
        }
        if(model.vehicleTypeId === -1) filter = {};
        // Query the VehicleTypeMaster collection
        let result = await VehicleTypeMaster.find(filter).select("-_id").lean();
    
       let msg;
       result.length > 0 ? msg = "Data Fetched" : msg = "No Record Found!!"

       const response = result.map((obj) => {
        let newObj = {};
        Object.keys(obj).forEach((key) => {
          let newKey = key.charAt(0).toLowerCase() + key.slice(1);
          newObj[newKey] = obj[key];
        });
        return newObj;
      });
       return res.status(StatusCodes.OK).json(new CommonResponse(1,  msg, response))

      } catch (error) {
        const err = new Error(error.message)
        err.status = StatusCodes.INTERNAL_SERVER_ERROR
        return next(err)
      }
}

//-----------DeleteVehicleType------>
async function DeleteVehicleType(req, res, next){
      try {
    const {VehicleTypeMaster, } = await getTenantDBModels()

        const model = req.body;
        // console.log('model:',model)
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
        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, 'VehicleType successfully deleted'))
      } catch (error) {
        const err = new Error(error.message);
        error.status = StatusCodes.BAD_REQUEST;
        return next(err);
      }
    
     
}

//-----------AddUpdateEscrapVehicleType------>
async function AddUpdateEscrapVehicleType(req, res, next){
  try {
      // await client.connect();
      // session = client.startSession();
      // session.startTransaction();

      // const db = client.db('your_database_name'); // Replace with your database name
      // const vehicleTypeCollection = db.collection('VehicleTypeMaster');
      // const itemMasterCollection = db.collection('ItemMaster');
      // const eScarpVehicleTypeCollection = db.collection('v01_VehicleType');
      const {VehicleTypeMaster,vehicleTypeCollection,ItemMaster } = await getTenantDBModels()

      const model = req.body;
      console.log('model:',model)
      let escrVehtypename = '';
      if (model.EScarp) {
          escrVehtypename = model.eScarpPrevValue || '';
      }

      let updateVt = true;

      if (model.vehicleTypeId === 0) {
          const existingVehicleType = await VehicleTypeMaster.findOne({ VehicleTypename: model.vehicleTypename }
            // , { session }
          );
          if (existingVehicleType) {
             return res.status(StatusCodes.CONFLICT).json(StatusCodes.CONFLICT, 'Record Already Exist!')
              // res.Message = 'Record Already Exist!';
              // return res;
          }

          const lastVehicleType = await VehicleTypeMaster.find().sort({ VehicleTypeId: -1 }).limit(1).lean();
          const updatedVehicleTypeId = (lastVehicleType[0]?.VehicleTypeId || 0) + 1;

          const newDoc = new VehicleTypeMaster({
            VehicleTypeId: updatedVehicleTypeId,
            VehicleTypename: model.vehicleTypename || "",
            ShortName: model.shortName,
            VehicleCode: model.vehicleCode,
            CreatedBy: model.createdBy,
            UpdatedBy: model.updatedBy,
          })
          const newInsertedDoc = await newDoc.save(); 

          // await vehicleTypeCollection.insertOne(model, { session });
          return res.status(StatusCodes.OK).json(new CommonResponse(true, 'Successfully Added', newInsertedDoc) );
      } else {
          const finduse = await ItemMaster.findOne({ VehicleTypeId: model.vehicleTypeId, NTRecord: 'y' }
            // , { session }
          );
          if (finduse && finduse.NTRecord.toLowerCase() === 'y') {
              updateVt = false;
          }

          if (updateVt) {
              await vehicleTypeCollection.updateOne({ VehicleTypeId: model.vehicleTypeId }, { $set: {
                VehicleTypename: model.vehicleTypename || "",
                ShortName: model.shortName,
                VehicleCode: model.vehicleCode,
                CreatedBy: model.createdBy,
                UpdatedBy: model.updatedBy,
              } }
                // , { session }
              );
              return res.status(StatusCodes.OK).json(new CommonResponse(true,  "Successfully Updated") )
              // res.Status = 'Success';
              // res.Message = 'Successfully Updated';
          } else {
            return res.status(StatusCodes.OK).json(StatusCodes.OK, "Vehicle type NOT updated!. NT record found." )
              // res.Status = 'Success';
              // res.Message = 'Vehicle type NOT updated!. NT record found.';
          }
      }

  } catch (ex) {
      // if (session) {
      //     await session.abortTransaction();
      // }
      const error = new Error(ex.message);
      error.status = StatusCodes.BAD_REQUEST
      return next(error);
  } 
  // finally {
  //     if (session) {
  //         session.endSession();
  //     }
  //     await client.close();
  // }

  return res;
}

//-----------DeleteEscrapVehicleType------>
async function DeleteEscrapVehicleType(req, res, next){

  try {
    const {ItemMaster, VehicleTypeMaster } = await getTenantDBModels()

      const model = req.body;
      if (model.vehicleTypeId !== 0) {
          const finduse = await ItemMaster.findOne(
              { VehicleTypeId: model.vehicleTypeId, NTRecord: 'y' }
          ).lean();

          if (finduse) {
            const error = new Error("Vehicle type in use cannot be deleted");
            error.status = StatusCodes.BAD_REQUEST;
            return next(error);
          }

          // Delete the vehicle type
          const deleteResult = await VehicleTypeMaster.deleteOne(
              { VehicleTypeId: model.vehicleTypeId }
          );

          if (deleteResult.deletedCount === 0) {
            const error = new Error("Vehicle type not found");
            error.status = StatusCodes.NOT_FOUND;
            return next(error);
          }

          return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, 'Successfully Deleted'))
      } else {
        const error = new Error("Invalid VehicleTypeId");
        error.status = StatusCodes.BAD_REQUEST;
        return next(error);
      }
  } catch (ex) {
    const error = new Error(ex.message);
    error.status = StatusCodes.BAD_REQUEST;
    return next(error);
  }
}

//-----------GetEscrapVehicleType------>
async function GetEscrapVehicleType(req, res, next){

  try {
    const { VehicleTypeMaster } = await getTenantDBModels()

    // Fetch vehicle types with filters
    const model = req.body;
    // const { pageNo = 1, pageSize = 10 } = req.body;
    let query = {};
    
    if (model.vehicleTypeId !== 0) query.VehicleTypeId = model.vehicleTypeId;
    if (model.vehicleTypename) query.VehicleTypename = { $regex: model.vehicleTypename, $options: 'i' };  // Case-insensitive search
    
    if(!model.vehicleTypeId || model.vehicleTypeId === 0) query= {};
    const vehicleTypes = await VehicleTypeMaster.find(query).lean()
        // .skip((pageNo - 1) * pageSize) // Pagination
        // .limit(pageSize);
    
    const response = vehicleTypes.map((obj) => {
      let newObj = {};
      Object.keys(obj).forEach((key) => {
        let newKey = key.charAt(0).toLowerCase() + key.slice(1);
        newObj[newKey] = obj[key];
      });
      return newObj;
    });

   
    const rowCount = await VehicleTypeMaster.countDocuments(query);

    let msg;
    rowCount > 0 ? msg = "Data fetched" : msg = "No Record Found!!"
    return res.status(StatusCodes.OK).json(new CommonResponse(true,  msg, response, rowCount))

   } catch (error) {
     const err = new Error(error.message)
     err.status = StatusCodes.INTERNAL_SERVER_ERROR;
     return next(err)
   }
}

export { AddUpdateVehicleType, GetVehicleType, DeleteVehicleType, AddUpdateEscrapVehicleType, DeleteEscrapVehicleType, GetEscrapVehicleType };
