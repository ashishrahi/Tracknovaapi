import { StatusCodes } from "http-status-codes";
import { brandMaster } from "../../modals/BrandMaster.modal.js";



//////////////////////////  AddUpdateBrandMasterQuery  ////////////////////////////////


export const AddUpdateBrandMasterQuery = async (model) => {
    try {
    let brandData = model

        let brand 
        if (brandData.brandId === 0 || brandData.brandId === -1) {
          // Create new brand
          const maxBrandId = await brandMaster.findOne({}, {}, { sort: { brandId: -1 } });
          brandData.brandId = (maxBrandId ? maxBrandId.brandId : 0) + 1;
          brandData.createdOn = new Date();
          brandData.updatedOn = new Date();
    
          brand = await brandMaster.create(brandData);
          return {
            isSuccess: true,
            statusCode: StatusCodes.CREATED, 
            message: 'Brand Added Successfully',
            data: brand, 
          };
        } else {
          // Update existing brand
          const existingBrand = await brandMaster.findOne({ brandId: brandData.brandId });
    
          if (existingBrand) {
            // Check if the brand is associated with any vehicles
            const hasAssociatedVehicles = await brandMaster.findOne({ 
              brandId: brandData.brandId, 
              'vehicles': { $exists: true, $not: { $size: 0 } } 
            });
    
            if (hasAssociatedVehicles) {
              return {
                isSuccess: false,
                statusCode: StatusCodes.CONFLICT, // Use appropriate status code
                message: 'Brand in Vehicle has movement record NOT updated',
              };
            }
    
            brandData.updatedOn = new Date();
            brand = await brandMaster.findOneAndUpdate(
              { brandId: brandData.brandId },
              brandData,
              { new: true }
            );
    
            return {
              isSuccess: true,
              statusCode: StatusCodes.OK, // Use appropriate status code
              message: 'Brand Updated Successfully',
              data: brand, 
            };
          } else {
            return {
              isSuccess: false,
              statusCode: StatusCodes.NOT_FOUND, // Use appropriate status code
              message: 'Brand not found',
            };
          }
        }
      } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR, // Use appropriate status code
            message: error.message,
        }
       
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
        isSuccess:true,
        statusCode:StatusCodes.OK,
        message:`Details of Brand${brandId} has been fetched successfully`,
        data:brands
         };
    } catch (error) {
        return{
          isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Error in GetBrandQuery: ${error.message}`,
        }
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
                 isSuccess: false,
                 statusCode:StatusCodes.NOT_FOUND,
                 message: `brandId${brandId} not found` };
        }

        return { 
                isSuccess:true,
                statusCode:StatusCodes.OK, 
                message: `brandId ${brandId} deleted successfully` 
              };
    } catch (error) {
        return {
           isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message };
    }
}

