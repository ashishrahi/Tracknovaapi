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

    if (!designationName) {
      return {
        isSuccess: 0,
        internalSuccess: "",
        mesg: "Designation Name is required",
        insertedId: "",
        data: null,
      };
    }

    let designation = await Designation.findOne({
      DesignationId: designationId,
    });

    if (designation) {
      // Update existing designation
      designation.DesignationName = designationName.trim() || designation.DesignationName;
      designation.DesignationCode = designationCode || designation.DesignationCode;
      designation.CreatedBy = createdBy || designation.CreatedBy;
      designation.UpdatedBy = updatedBy || designation.UpdatedBy;

      const updated = await designation.save();
      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `${updated.DesignationName} Successfully Updated`,
        insertedId: updated._id,
        data: updated,
      };
    } else {
      const existingDesignation = await Designation.findOne({
        DesignationName: designationName.trim(),
      });

      if (existingDesignation) {
        return {
          isSuccess: 0,
          internalSuccess: "",
          mesg: `${existingDesignation.DesignationName} Already Exists`,
          insertedId: "",
          data: existingDesignation,
        };
      }

      const maxIdDesignation = await Designation.findOne().sort({ DesignationId: -1 });
      const newDesignationId = maxIdDesignation ? maxIdDesignation.DesignationId + 1 : 1;

      const newDesignation = new Designation({
        DesignationId: designationId > 0 ? designationId : newDesignationId,
        DesignationName: designationName.trim(),
        DesignationCode: designationCode,
        CreatedBy: createdBy,
        UpdatedBy: updatedBy,
      });

      const saved = await newDesignation.save();

      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `${saved.DesignationName} has been Successfully Added`,
        insertedId: saved._id,
        data: {
          designationId: saved.DesignationId,
          designationName: saved.DesignationName,
          designationCode: saved.DesignationCode,
          createdBy: saved.CreatedBy,
          updatedBy: saved.UpdatedBy,
        },
      };
    }
  } catch (error) {
    if (error.code === 11000) {
      return {
        isSuccess: 0,
        internalSuccess: "",
        mesg: "Designation Already Exists (Duplicate Key)",
        insertedId: "",
        data: null,
      };
    }

    return {
      isSuccess: 0,
      internalSuccess: 500,
      mesg: error.message,
      insertedId: "",
      data: null,
    };
  }
};


////////////////////////////////////////////// ImportDesignationQuery //////////////////////////////////////////////////////////////////

export const ImportDesignationQuery = async (model) => {
  try {
    const { Designation } = await getTenantDBModels();
    let inserted = 0;
    let skipped = 0
    for (const designation of model) {
      const {designationName,designationCode} = designation
      const existing = await Designation.findOne({DesignationName : designationName})
      if (existing) {
        skipped++;
        continue;
      }
      const lastDesignation = await Designation.findOne().sort({DesignationId:-1})
      const nextDesignation = lastDesignation ? lastDesignation.DesignationId + 1 : 1
      
      // insert new designation
      await Designation.create({
        DesignationId:nextDesignation,
        DesignationName:designationName,
        DesignationCode:designationCode
      })
    }
    return {
      isSuccess: true,
      mesg: `CSV import successful`,
      inserted,
      skipped,
    };
    
  } catch (error) {
    console.log('error:',error)
    return {
      isSuccess: false,
      statusCode: 500,
      msg: error.message,
    };
  }
}

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
        mesg: `DesignationId ${designation.DesignationName} Successfully deleted`,
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
