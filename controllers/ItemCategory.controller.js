import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, CommonResponse } from "../utils/apiResponse/index.js";
import { ItemCategoryMaster } from "../modals/index.js";
import formattedData from "../utils/dotnet-like-format/dotnetLikeData.js";

//-------------AddUpdateItemCategory------->
async function AddUpdateItemCategory(req, res) {
  const model = req.body;
  try {
    const response = { status: "", message: "", data: null, error: null };

    const existingCategory = await ItemCategoryMaster.findOne({
      ItemCategory: model.itemCategory,
    });

    if (!model.itemCategoryId || model.itemCategoryId === 0) {
      
      if (existingCategory) {
        response.status = "Failed";
        response.error = new Error("Category Already Exists...!!!!!");
        response.data = existingCategory;
        return res.status(StatusCodes.CONFLICT).json(response);
      }

      const lastCategory = await ItemCategoryMaster.findOne().sort({
        ItemCategoryId: -1,
      });
      const newItemCategoryId = lastCategory ? lastCategory.ItemCategoryId + 1 : 0;

      const newCategory = new ItemCategoryMaster({
        ItemCategoryId: newItemCategoryId,
        ItemCategory: model.itemCategory,
        ItemCategoryAbbre: model.itemCategoryAbbre,
        ParentId: model.parentId,
        TaxId: model.taxId,
        CreatedBy: model.createdBy,
        UpdatedBy: model.updatedBy,
      });
      await newCategory.save();

      response.status = "Success";
      response.message = "Successfully Added";
      response.data = newCategory;
      return res.status(StatusCodes.CREATED).json(response);
    } else {
      // Update existing category
      const entity = await ItemCategoryMaster.findOne({
        ItemCategoryId: model.itemCategoryId,
      });

      if (!entity) {
        response.status = "Failed";
        response.error = new Error("ItemCategoryMaster not found");
        response.data = entity;
        return res.status(StatusCodes.NOT_FOUND).json(response);
      }

      if (entity.ItemCategory !== model.itemCategory) {
        if (existingCategory || model.itemCategoryId === model.parentId) {
          response.status = "Failed";
          response.error = new Error("Category Already Exists...!!!!!");
          response.data = existingCategory;
          return response.status(StatusCodes.CONFLICT).json(response);
        }
      } else if (model.ItemCategoryId === model.parentId) {
        response.status = "Failed";
        response.error = new Error("Change Parent Category ...!!!!!");
        return response.status(StatusCodes.CONFLICT).json(response);
      }

      const updatedItemMaster = await ItemCategoryMaster.findOneAndUpdate(
        { ItemCategoryId: model.itemCategoryId },
        {
          ItemCategoryId: model.itemCategoryId,
          ItemCategory: model.itemCategory,
          ItemCategoryAbbre: model.itemCategoryAbbre,
          ParentId: model.parentId,
          TaxId: model.taxId,
          CreatedBy: model.createdBy,
          UpdatedBy: model.updatedBy,
        },
        { new: true }
      );
      response.status = "Success";
      response.message = "Successfully Updated";
      response.data = updatedItemMaster;

      return res.status(StatusCodes.OK).json(response);
    }
  } catch (error) {
    // response.status = "Failed";
    // response.error = error.message;
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
  }
  return res;
}

//-------------GetItemCategory------->
async function GetItemCategory(req, res) {
  try {
    const {
      itemCategoryId,
      itemCategory,
      itemCategoryAbbre,
      parentId,
      taxId,
      createdBy,
      updatedBy,
      pageNo = 1,
      pageSize = 10,
    } = req.body;

    const response = {
      status: "true",
      data: null,
      pageNo: pageNo,
      pageSize: pageSize,
      rowCount: null,
    };
    const query = {};
    if (itemCategoryId) query.ItemCategoryId = itemCategoryId;
    if (itemCategory) query.ItemCategory = itemCategory;
    if (itemCategoryAbbre) query.ItemCategoryAbbre = itemCategoryAbbre;
    if (parentId) query.ParentId = parentId;
    if (taxId) query.TaxId = taxId;
    if (createdBy) query.CreatedBy = createdBy;
    if (updatedBy) query.UpdatedBy = updatedBy;

    const itemCategoryResult = await ItemCategoryMaster.find(query).select("-_id").lean()
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize);

    if (itemCategoryResult.length === 0) {
      response.data = itemCategoryResult;
      response.message = "No record found";
      response.rowCount = itemCategoryResult.length;
      return res.status(StatusCodes.OK).json(new CommonResponse(1, response.message, response.data, response.rowCount  ));
    }
    response.data = formattedData(itemCategoryResult);
    response.message = "Data fetched";
    response.rowCount = itemCategoryResult.length;
    return res.status(StatusCodes.OK).json(new CommonResponse(1, response.message, response.data, response.rowCount  ));
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
  }
}

//-------------DeleteItemCategory------->
async function DeleteItemCategory(req, res){
    try {
    const model = req.body;
        if (!model.itemCategoryId) throw new Error("ItemCategoryId is required");
        
        const entity = await ItemCategoryMaster.findOneAndDelete({ ItemCategoryId: model.itemCategoryId });
        if (!entity) throw new Error("Category not found");
        
        return res.status(StatusCodes.OK).json({ status: "Success", message: "Successfully Deleted" });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ status: "Failed", error: error.message });
    }
}


export { AddUpdateItemCategory, GetItemCategory, DeleteItemCategory };
