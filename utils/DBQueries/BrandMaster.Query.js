import { StatusCodes } from "http-status-codes";
import { brandMaster } from "../../modals/BrandMaster.model.js";



//////////////////////////  AddUpdateBrandMasterQuery  ////////////////////////////////


export const AddUpdateBrandMasterQuery = async (model) => {
    const { brandId, brandname, brandshortname, brandCode, createdBy, updatedBy, createdOn, updatedOn } = model;
    try {

      let brand = await brandMaster.findOne({ brandId:brandId });
      if (brand) {
        brand.brandname = brandname || brand.brandname;
        brand.brandshortname = brandshortname || brand.brandshortname;
        brand.brandCode = brandCode || brand.brandCode;
        brand.CreatedBy = brand.CreatedBy || brand.CreatedBy;
        brand.UpdatedBy = updatedBy || brand.UpdatedBy;
        brand.UpdatedOn = updatedOn || brand.UpdatedOn;
  
      const data =  await brand.save();
        return {
            isSuccess:'success',
            statusCode:StatusCodes.OK,
            message:`BrandId ${data.brandId} updated successfully`,
            data: data
             };
      } else {
        // Add new brand
        const newBrand = new brandMaster({
          brandId: brandId || -1, 
          brandname,
          brandshortname,
          brandCode,
          createdBy,
          updatedBy,
          createdOn,
          updatedOn
        });
  
        await newBrand.save();
        return { isSuccess:'success',
                statusCodes:StatusCodes.OK ,
                message: `Brand ${brandId} added successfully`, 
                data: newBrand 
              }
      }
    } catch (error) {
      return { 
        isSuccess: 'failed',
        statusCode:StatusCodes.NOT_FOUND, 
        message: error.message 
           };
    }
}

//////////////////////////  GetBrandQuery  //////////////////////////////////////////////////////////////


export const GetBrandQuery = async (model) => {
    const { brandId, brandname } = model;
    
    const brandQuery = {};
    if (brandId && brandId !== '0') {
        brandQuery.brandId = brandId; 
    }
    if (brandname) {
        brandQuery.brandname = { $regex: brandname, $options: 'i' }; 
    }
    
    try {
        // Fetch brands from the database based on the query
        const brands = await brandMaster.find(brandQuery);


    return {
        isSuccess:'Success',
        statusCode:StatusCodes.OK,
        message:`Details of Brand${brandId} has been fetched successfully`,
        data:brands
         };
    } catch (error) {
        // Return error response
        throw new Error(error.message);
    }
}

//////////////////////////  DeleteBrandQuery  //////////////////////////////////////////////////////////////

export const DeleteBrandQuery = async (model) => {
    try {
        const { brandId } = model;

        if (!brandId || brandId === 0) {
            brandId = -1;
        }

        // Find and delete the brand by brandId
        const brand = await brandMaster.findOneAndDelete({brandId:brandId});

        if (!brand) {
            return {
                 isSuccess: failed,
                 statusCode:StatusCodes.NOT_FOUND,
                 message: `brandId${brandId} not found` };
        }

        return { 
                isSuccess:'success',
                statusCode:StatusCodes.OK, 
                message: `brandId ${brandId} deleted successfully` 
              };
    } catch (error) {
        return { isSuccess: 'failed', 
            message: error.message };
    }
}

