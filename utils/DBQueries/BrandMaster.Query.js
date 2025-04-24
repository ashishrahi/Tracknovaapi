import { StatusCodes } from "http-status-codes";
import BrandMaster from "../../modals/BrandMaster.model.js";
import { getTenantDBModels } from "../../db/index.js";

//////////////////////////  AddUpdateBrandMasterQuery  ////////////////////////////////

export const AddUpdateBrandMasterQuery = async (model) => {
  try {
    const { BrandMaster } = await getTenantDBModels();
    // Convert input field names to match schema
    let brandData = {
      ...model,
      CreatedBy: model.createdBy, // Map input `createdBy` to schema `CreatedBy`
      UpdatedBy: model.updatedBy, // Map input `updatedBy` to schema `UpdatedBy`
    };
    delete brandData.createdBy;
    delete brandData.updatedBy;

    let brand;
    if (brandData.brandId === 0 || brandData.brandId === -1) {
      // Create new brand
      const maxBrandId = await BrandMaster.findOne(
        {},
        {},
        { sort: { brandId: -1 } }
      );
      brandData.brandId = (maxBrandId ? maxBrandId.brandId : 0) + 1;

      brand = await BrandMaster.create(brandData);
      return {
        isSuccess: 1,
        id: brand.brandId,
        createUpdate: "Create",
        msg: `BrandName ${brand.brandname} Added Successfully`,
        data: brand,
      };
    } else {
      // Update existing brand
      const existingBrand = await BrandMaster.findOne({
        brandId: brandData.brandId,
      });

      if (existingBrand) {
        // Check if the brand is associated with any vehicles
        const hasAssociatedVehicles = await BrandMaster.findOne({
          brandId: brandData.brandId,
          vehicles: { $exists: true, $not: { $size: 0 } },
        });

        if (hasAssociatedVehicles) {
          return {
            isSuccess: 0,
            id: hasAssociatedVehicles.brandId,
            createUpdate: "Already",
            msg: `BrandId ${hasAssociatedVehicles.brandname} in Vehicle has movement record NOT updated`,
          };
        }

        brandData.UpdatedOn = new Date();
        brand = await BrandMaster.findOneAndUpdate(
          { brandId: brandData.brandId },
          brandData,
          { new: true }
        );

        return {
          isSuccess: 1,
          id: brand.brandId,
          createUpdate: "Already",
          msg: `BrandID ${brand.brandId} Updated Successfully`,
          data: brand,
        };
      } else {
        return {
          isSuccess: 0,
          msg: `BrandID ${brand.brandId} of Brand not found`,
        };
      }
    }
  } catch (error) {
    return {
      isSuccess: false,
      msg: error.message,
    };
  }
};

//////////////////////////  ImportBrandsQuery  ////////////////////////////////

export const ImportBrandsQuery = async (model) => {
  
  try {
    const { BrandMaster } = await getTenantDBModels();
    let inserted = 0;
    let skipped = 0;
    for (const brand of model) {
      const {brandName,brandCode,brandShortname} = brand;
      let inserted = 0;
      let skipped = 0;
      // Find BrandMaster
      const existing = await BrandMaster.findOne({brandname:brandName})
      //  Check BrandMaster Exist
      if(existing){
        skipped++
        continue;
      }
      // Find Last BrandId
      const lastBrandId = await BrandMaster.findOne().sort({brandId:-1}).limit(1)
      const nextBrandId = lastBrandId ? lastBrandId.brandId+1 : 1
      // Create BrandMaster
      await BrandMaster.create({
        brandId:nextBrandId,
        brandshortname:brandShortname,
        brandname:brandName,
        brandCode:brandCode
      })
      inserted++
    }
    return {
      isSuccess: true,
      mesg: `Total ${inserted} CSV data import successfully`,
      inserted,
      skipped,
    };


  } catch (error) {
    console.error('error:',error)
    return {
      isSuccess: false,
      statusCode: 500,
      msg: error.message,
    };
  }

}


//////////////////////////  GetBrandQuery  //////////////////////////////////////////////////////////////

export const GetBrandQuery = async (model) => {
  try {
  const { BrandMaster } = await getTenantDBModels();

  const { brandId, brandname } = model;

  const brandQuery = {};
  if (brandId !== -1) {
    brandQuery.brandId = brandId;
  }

  if (brandname) {
    brandQuery.brandname = { $regex: brandname, $options: "i" };
  }

    // Fetch brands from the database based on the query
    const brands = await BrandMaster.find(brandQuery);

    return {
      status: 1,
      message: `Details of Brand${brandId} has been fetched successfully`,
      data: brands,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Error in GetBrandQuery: ${error.message}`,
    };
  }
};

//////////////////////////  DeleteBrandQuery  //////////////////////////////////////////////////////////////

export const DeleteBrandQuery = async (model) => {
  try {
    const { BrandMaster } = await getTenantDBModels();

    let { brandId } = model;
    // console.log('brandId',brandId)

    // if (!brandId || brandId === 0) {
    //   brandId = -1;
    // }
   
    // Find and delete the brand by brandId
    const brand = await BrandMaster.findOneAndDelete({ brandId: brandId });
    

    if (!brand) {
      return {
        isSuccess: false,
        id: brandId.brandId,
        createUpdate: "BrandId not deleted ",
        msg: `brandId${brandId} not found`,
      };
    }

    return {
      isSuccess: true,
      id: brandId.brandId,
      createUpdate: "BrandId not deleted ",
      msg: `${brandname} deleted successfully`,
    };
  } catch (error) {
    return {
      isSuccess: 0,
      msg: error.message,
    };
  }
};
