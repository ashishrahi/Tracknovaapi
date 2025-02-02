import { StatusCodes } from "http-status-codes";
import { ItemTypeMaster } from "../modals/index.js";
import { ApiSuccessResponse } from "../utils/apiResponse/index.js";

async function AddUpdateItemTypeMaster(req, res, next){

    try {
        const { itemTypeMasterId, itemType, itemTypecode, createdBy, updatedBy} = req.body;

        if (!itemType || itemType.trim() === "") {
            const error = new Error("Item Type is required");
            error.status = StatusCodes.BAD_REQUEST;
            return next(error);
        //   return { isSuccess: false, message: "Item Type is required" };
        }
    
        const existingItem = await ItemTypeMaster.findOne({ ItemTypeMasterId: itemTypeMasterId });
    
        if (existingItem) {
          // Update existing record
          existingItem.ItemType = itemType || existingItem.ItemType;
          existingItem.ItemTypecode = itemTypecode || existingItem.ItemTypecode;
          existingItem.UpdatedBy = updatedBy || existingItem.UpdatedBy;
          existingItem.CreatedBy = createdBy || existingItem.CreatedBy;
       
    
          const savedItem = await existingItem.save();
    
          return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Item Type Successfully Updated", savedItem));
        } else {
             // Check if ItemType already exists
          const duplicate = await ItemTypeMaster.findOne({ ItemType: itemType });
          if (duplicate) {
            const error = new Error("Item Type Already Exists");
            error.status = StatusCodes.CONFLICT;
            return next(error);
           
          }
          // Generate new ItemTypeMasterId
          const maxItem = await ItemTypeMaster.findOne().sort({ ItemTypeMasterId: -1 });
          const newItemTypeMasterId = maxItem ? maxItem.ItemTypeMasterId + 1 : 1;
    
          const newItem = new ItemTypeMaster({
            ItemTypeMasterId: newItemTypeMasterId,
            ItemType: itemType,
            ItemTypecode: itemTypecode,
            CreatedBy: createdBy,
            UpdatedBy: updatedBy
          });
          const savedNewItem = await newItem.save();
          return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Item Type Successfully Added", savedNewItem));
        }
      } catch (error) {
        const err = new Error(error.message);
        err.status = StatusCodes.BAD_REQUEST
        return next(err)
      }
}

async function GetItemTypeMaster(req, res, next){
    try {
    const { itemTypeMasterId, itemType, itemTypecode  } = req.body;
        let query = {}; // Default to fetch all records
        if(itemTypeMasterId  && itemTypeMasterId !== -1 && itemTypeMasterId !== 0) query.ItemTypeMasterId = itemTypeMasterId;
        if(itemType) query.ItemType = itemType;
        if(itemTypecode) query.ItemTypecode = itemTypecode;
    
        const data = await ItemTypeMaster.find(query).lean(); // Optimized query
    
        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK,"default" , data))
      } catch (error) {
        
        return res.json({
          isSuccess: false,
          message: error.message,
        });
      }
}

async function DeleteItemTypeMaster(req, res, next){
  try {
    const { itemTypeMasterId }  = req.body;
    if(!itemTypeMasterId){
      const error = new Error("Please Provide ItemTypeMasterId");
      error.status = StatusCodes.BAD_REQUEST;
      return next(error);
    }
    const deletedItems = await ItemTypeMaster.deleteMany({ ItemTypeMasterId: itemTypeMasterId });

    if(deletedItems.deletedCount > 0){
        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK,"Successfully deleted" ));
    } else {
      const error = new Error("Item Type Id Not Found!")
      error.status = StatusCodes.NOT_FOUND;
      return next(error);
        // return { IsSuccess: false, Mesg: "Item Type Id Not Found!" };
    }
} catch (err) {
    const error = new Error(err.message);
    error.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return next(error);
    // return { IsSuccess: false, Mesg: error.message || "An error occurred" };
}
}

export{ AddUpdateItemTypeMaster, GetItemTypeMaster, DeleteItemTypeMaster }