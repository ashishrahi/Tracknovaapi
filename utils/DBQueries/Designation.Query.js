import { StatusCodes } from "http-status-codes";
import { Designation } from "../../modals/index.js";

////////////////////////////////////////////// AddUpdateDesignationMasterQuery //////////////////////////////////////////////////////////////////

export const AddUpdateDesignationMasterQuery = async (model) => {
    const { DesignationId, DesignationName, DesignationCode,UpdatedBy,CreatedBy } = model;

    try {
      if (!DesignationName || DesignationName.trim() === '') {
        return { 
              isSuccess: 'failed', 
              statusCode:StatusCodes.NOT_FOUND,
              message: 'Designation Name is required' };
      }
  
      let designation = await Designation.findOne({ DesignationId });
  
      if (designation) {
        // Update existing designation
        designation.DesignationName = DesignationName.trim() || designation.DesignationName;
        designation.DesignationCode = DesignationCode || designation.DesignationCode;
        designation.CreatedBy = DesignationCode || designation.CreatedBy;
        designation.UpdatedBy = DesignationCode || designation.UpdatedBy;
        designation.UpdatedOn = Date.now();
  
        await designation.save();
        return { 
              isSuccess: 'Success',
              statusCode:StatusCodes.CREATED,
              message: `${designation.DesignationName} Successfully Updated`,
              data: designation

             };
      } 
      else
       {
        const existingDesignation = await Designation.findOne({ DesignationName: DesignationName.trim() });
        if (existingDesignation) {
          return { 
                  isSuccess: false,
                  statusCode:StatusCodes.CREATED,
                  message: `${existingDesignation.DesignationName} Already Exist`, 
                  data: existingDesignation
                   };
        }
  
        // Calculate new DesignationId if not provided
        const maxIdDesignation = await Designation.findOne().sort({ DesignationId: -1 });
        const newDesignationId = maxIdDesignation ? maxIdDesignation.DesignationId + 1 : 1;
  
        const newDesignation = new Designation({
          DesignationId: DesignationId > 0 ? DesignationId : newDesignationId,
          DesignationName: DesignationName.trim(),
          DesignationCode,
          CreatedBy:CreatedBy ,
          UpdatedBy:UpdatedBy,
          CreatedOn: Date.now(),
          UpdatedOn: Date.now(),
        });
  
        const data = await newDesignation.save();
        return {
                 isSuccess: 'success',
                 statusCode:StatusCodes.OK, 
                 message: `${data.DesignationName} has been Successfully Added`,
                 data: data
                };
      }
    } catch (error) {
      if (error.code === 11000) {
        return {
                 isSuccess: false,
                 statusCode:StatusCodes.OK,
                 message: `${data.DesignationName}" Already Exist`, 
                };
      }
  
      return { isSuccess: false, message: error.message };
    }
}

/////////////////////////////////////////////  GetDesignationMasterQuery //////////////////////////////////////////////////////////////////

export const GetDesignationMasterQuery = async (model) => {

    try {


        if (model.DesignationId === -1) {
          // If DesignationId is -1, get all designation records
          const data = await Designation.find().exec();
          return {
            isSuccess:true,
            statusCode:StatusCodes.OK,
            message:`Designations has been fetched successfully`,
            data:data
          }
          
        } else {
          const data = await Designation.findOne({ DesignationId: model.DesignationId }).exec();
        

        // Return the result
       return {
        isSuccess:true,
        statusCode:StatusCodes.OK,
        message:`${data.DesignationName} details has been fetched successfully`,
        data:data
      }}
       
    } catch (err) {
        console.error(err);
        throw new Error(err.message) 
    }

}

///////////////////////////////////////////////  DeleteDesignationMasterQuery  //////////////////////////////////////////////////////////////////

export const DeleteDesignationMasterQuery = async (model) => {


    try {
        const designation = await Designation.find({ DesignationId: model.DesignationId }).exec();
        if (designation && designation.length > 0) {
            await Designation.deleteMany({ DesignationId: model.DesignationId }).exec();
            return{
              isSuccess:'success',
              statusCode:StatusCodes.OK,
              message:`DesignationId ${model.DesignationId} Successfully deleted`
            };
        } else {
            
    return {
      isSuccess: 'failed', 
      statusCode:StatusCodes.NOT_FOUND,
      message: `DesignationId "${designation.DesignationId}" Not Found!`
    }    
          }
    } catch (error) {
        response.isSuccess = false;
        response.message = `${error.message}; ${error.cause || ''}`;
    }

    return response;
}
