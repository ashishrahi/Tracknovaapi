import { StatusCodes } from "http-status-codes";
import { Designation } from "../../modals/index.js";
import { getTenantDBModels } from "../../db/index.js";

////////////////////////////////////////////// AddUpdateDesignationMasterQuery //////////////////////////////////////////////////////////////////

export const AddUpdateDesignationMasterQuery = async (model) => {
  try {
    const { Designation } = await getTenantDBModels();
    const {
      designationId,
      designationName,
      designationCode,
      updatedBy,
      createdBy,
    } = model;

    if (!designationName || designationName.trim() === "") {
      return {
        isSuccess: 0,
        internalSuccess: "",
        mesg: "Designation Name is required",
        insertedId: "",
      };
    }

    let designation = await Designation.findOne({
      DesignationId: designationId,
    });

    if (designation) {
      // Update existing designation
      designation.DesignationName = designationName.trim() || designation.DesignationName;
      designation.DesignationCode =
        designationCode || designation.DesignationCode;
      designation.CreatedBy = designationCode || designation.CreatedBy;
      designation.UpdatedBy = designationCode || designation.UpdatedBy;

      await designation.save();
      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `${designation.DesignationName} Successfully Updated`,
        insertedId,
        data: designation,
      };
    } else {
      const existingDesignation = await Designation.findOne({
        DesignationName: designationName.trim(),
      });
      if (existingDesignation) {
        return {
          isSuccess: 0,
          internalSuccess: "",
          mesg: `${existingDesignation.DesignationName} Already Exist`,
          insertedId: "",
          data: existingDesignation,
        };
      }

      // Calculate new DesignationId if not provided
      const maxIdDesignation = await Designation.findOne().sort({
        DesignationId: -1,
      });
      const newDesignationId = maxIdDesignation
        ? maxIdDesignation.DesignationId + 1 : 1;

      const newDesignation = new Designation({
        DesignationId:
          designationId > 0 ? designationesignationId : newDesignationId,
        DesignationName: designationName.trim(),
        DesignationCode: designationCode,
        CreatedBy: createdBy,
        UpdatedBy: updatedBy,
      });

      const data = await newDesignation.save();

      const newData = {
        designationId: newDesignation.DesignationId,
        designationName: newDesignation.DesignationName,
        designationCode: newDesignation.DesignationCode,
        createdBy: newDesignation.CreatedBy,
        updatedBy: newDesignation.UpdatedBy,
      };

      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `${data.DesignationName} has been Successfully Added`,
        insertedId: "",
        data: newData,
      };
    }
  } catch (error) {
    if (error.code === 11000) {
      return {
        isSuccess: false,
        internalSuccess: "",
        mesg: `${data.DesignationName}" Already Exist`,
      };
    }

    return {
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};

/////////////////////////////////////////////  GetDesignationMasterQuery //////////////////////////////////////////////////////////////////

export const GetDesignationMasterQuery = async (model) => {
  try {
    const { Designation } = await getTenantDBModels();

    if (model.designationId === -1) {
      // If DesignationId is -1, get all designation records
      const data = await Designation.find().exec();

      const newData = data.map((designation) => {
        return {
          designationId: designation.DesignationId,
          designationName: designation.DesignationName,
          designationCode: designation.DesignationCode,
          createdBy: designation.CreatedBy,
          updatedBy: designation.UpdatedBy,
        };
      });

      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `Designations has been fetched successfully`,
        insertedId: "",
        data: newData,
      };
    } else {
      const data = await Designation.findOne({
        DesignationId: model.designationId,
      }).exec();

      const newData = {
        designationId: data.DesignationId,
        designationName: data.DesignationName,
        designationCode: data.DesignationCode,
        createdBy: data.CreatedBy,
        updatedBy: data.UpdatedBy,
      };
      // Return the result
      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `${data.DesignationName} details has been fetched successfully`,
        insertedId: "",
        data: newData,
      };
    }
  } catch (err) {
    return {
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: "An unexpected error occurred",
    };
  }
};

///////////////////////////////////////////////  DeleteDesignationMasterQuery  //////////////////////////////////////////////////////////////////

export const DeleteDesignationMasterQuery = async (model) => {
  try {
    const { Designation } = await getTenantDBModels();
    const designation = await Designation.find({
      DesignationId: model.designationId,
    }).exec();
    if (designation && designation.length > 0) {
      await Designation.deleteMany({
        DesignationId: model.designationId,
      }).exec();
      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `DesignationId ${model.designationName} Successfully deleted`,
        insertedId: "",
      };
    } else {
      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `DesignationId "${designation.designationName}" Not Found!`,
      };
    }
  } catch (error) {
    return {
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};
