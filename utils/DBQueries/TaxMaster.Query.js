import { TaxMaster } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";


/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const AddUpdateTaxMasterQuery = async (model) => {
    try {
        
        if(!model.taxName || model.taxName ==="")
            {
            return{
               isSuccess:false,
               statusCode:StatusCodes.NOT_FOUND,
               message:'Tax Name is required'
            }}

     let existingTaxMaster = await TaxMaster.findOne({TaxId:model.taxId})
     if(existingTaxMaster){
        existingTaxMaster.TaxName = model.taxName || existingTaxMaster.TaxName,
        existingTaxMaster.TaxPercentage = model.taxPercentage || existingTaxMaster.TaxPercentage,
        existingTaxMaster.EffectiveDate = model.effectiveDate || existingTaxMaster.EffectiveDate,
        await existingTaxMaster.save( )
        return{
            isSuccess: true,
            statusCode:StatusCodes.CREATED,
            message:`TaxId ${existingTaxMaster.TaxId} has been updated successfully`,
            data:existingTaxMaster
        }
     }else
     {
        if(!model.taxId || model.taxId ===-1 || model.taxId === 0 ){
           const maxTaxId = await TaxMaster.find().sort({TaxId:-1}).limit(1)
           model.taxId = maxTaxId.length >0 ? maxTaxId[0].TaxId+1:0; 
        }
       const existingTaxName = await TaxMaster.findOne({TaxName:model.taxName})

if(existingTaxName){
    return{
        isSuccess:false,
        statusCode:StatusCodes.CONFLICT,
        message:'Tax Name already exists'
    }
}
const newTaxMaster = new TaxMaster({
    TaxId:model.taxId,
    TaxName:model.taxName,
    TaxPercentage:model.taxPercentage,
    EffectiveDate:model.effectiveDate,
    CreatedBy: model.createdBy,
    UpdatedBy: model.updatedBy,
 
});
await newTaxMaster.save();
return{
    isSuccess: true,
    statusCode:StatusCodes.CREATED,
    message:`TaxId ${newTaxMaster.TaxId} has been added successfully`,
    data:newTaxMaster
}}
       
    } catch (error) {
       return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
       }
        
    }
}
//////////////////////////////////////////// GetTaxMasterQuery //////////////////////////////////////////////////////////////////

export const GetTaxMasterQuery = async (model) => {

    try {
        if (model.TaxId === -1) {
            const data = await TaxMaster.find({}).lean();
            return{
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: 'List of Tax Master Data fetched successfully',
                data: data,
            }
        } else {
            const data = await TaxMaster.findOne({ TaxId: model.TaxId }).lean();
          return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: `Details of TaxId ${model.TaxId} of Tax Master fetched successfully`,
            data: data,
          }
        }
    } catch (error) {
      return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error while fetching Tax Master data',
        error: error.message,
      }
    }

}
///////////////////////////////////////////// DeleteTaxMasterQuery //////////////////////////////////////////////////////////////////

export const DeleteTaxMasterQuery = async (model) => {
    try {
        const records = await TaxMaster.find({TaxId:model.TaxId});
       
        if(records && records.length >0){
            await TaxMaster.deleteMany({TaxId:model.TaxId})
            return{
                isSuccess:true,
                statusCode:StatusCodes.OK,
                message:`TaxId ${model.TaxId} was successfully deleted`
            }}
            else{
                return{
                    isSuccess:false,
                    statusCode:StatusCodes.NOT_FOUND,
                    message:`TaxId ${model.TaxId} not found`
                }
            }
        
    } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error while deleting Tax Master data',
            error: error.message,
        }
        
    }
}