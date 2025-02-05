import { StatusCodes } from "http-status-codes";
import { Designation } from "../../modals/index.js";

////////////////////////////////////////////// AddUpdateDesignationMasterQuery //////////////////////////////////////////////////////////////////

export const AddUpdateDesignationMasterQuery = async (model) => {
    const { designationId, designationName, designationCode,updatedBy,createdBy } = model;

    try {
      if (!designationName || designationName.trim() === '') {
        return { 
              isSuccess: false, 
              statusCode:StatusCodes.NOT_FOUND,
              message: 'Designation Name is required' };
      }
  
      let designation = await Designation.findOne({ DesignationId:designationId });
  
      if (designation) {
        // Update existing designation
        designation.DesignationName = designationName.trim() || designation.DesignationName;
        designation.DesignationCode = designationCode || designation.DesignationCode;
        designation.CreatedBy = designationCode || designation.CreatedBy;
        designation.UpdatedBy = designationCode || designation.UpdatedBy;
  
        await designation.save();
        return { 
              isSuccess: true,
              statusCode:StatusCodes.CREATED,
              message: `${designation.DesignationName} Successfully Updated`,
              data: designation

             };
      } 
      else
       {
        const existingDesignation = await Designation.findOne({ DesignationName: designationName.trim() });
        if (existingDesignation) {
          return { 
                  isSuccess: false,
                  statusCode:StatusCodes.CONFLICT,
                  message: `${existingDesignation.DesignationName} Already Exist`, 
                  data: existingDesignation
                   };
        }
  
        // Calculate new DesignationId if not provided
        const maxIdDesignation = await Designation.findOne().sort({ DesignationId: -1 });
        const newDesignationId = maxIdDesignation ? maxIdDesignation.DesignationId + 1 : 1;
  
        const newDesignation = new Designation({
          DesignationId: designationId > 0 ? designationesignationId : newDesignationId,
          DesignationName: designationName.trim(),
          DesignationCode:designationCode,
          CreatedBy:createdBy ,
          UpdatedBy:updatedBy,
        });
  
        const data = await newDesignation.save();
        return {
                 isSuccess: true,
                 statusCode:StatusCodes.OK, 
                 message: `${data.DesignationName} has been Successfully Added`,
                 data: data
                };
      }
    } catch (error) {
      if (error.code === 11000) {
        return {
                 isSuccess: false,
                 statusCode:StatusCodes.CONFLICT,
                 message: `${data.DesignationName}" Already Exist`, 
                };
      }
  
      return { 
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message
       };
    }
}

/////////////////////////////////////////////  GetDesignationMasterQuery //////////////////////////////////////////////////////////////////

export const GetDesignationMasterQuery = async (model) => {

    try {


        if (model.designationId === -1) {
          // If DesignationId is -1, get all designation records
          const data = await Designation.find().exec();
          return {
            isSuccess:true,
            statusCode:StatusCodes.OK,
            message:`Designations has been fetched successfully`,
            data:data
          }
          
        } else {
          const data = await Designation.findOne({ DesignationId: model.designationId }).exec();
        

        // Return the result
       return {
        isSuccess:true,
        statusCode:StatusCodes.OK,
        message:`${data.DesignationName} details has been fetched successfully`,
        data:data
      }}
       
    } catch (err) {
        return{
          isSuccess:false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred'
        }
    }

}

///////////////////////////////////////////////  DeleteDesignationMasterQuery  //////////////////////////////////////////////////////////////////

export const DeleteDesignationMasterQuery = async (model) => {


    try {
        const designation = await Designation.find({ DesignationId: model.designationId }).exec();
        if (designation && designation.length > 0) {
            await Designation.deleteMany({ DesignationId: model.designationId }).exec();
            return{
              isSuccess:true,
              statusCode:StatusCodes.OK,
              message:`DesignationId ${model.designationId} Successfully deleted`
            };
        } else {
            
    return {
      isSuccess: true, 
      statusCode:StatusCodes.NOT_FOUND,
      message: `DesignationId "${designation.DesignationId}" Not Found!`
    }    
          }
    } catch (error) {
        return{
          isSuccess:false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message
        }
    }

}
