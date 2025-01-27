import { TaxMaster } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";


/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const AddUpdateTaxMasterQuery = async (model) => {
    try {
        
        if(!model.TaxName || model.TaxName ==="")
            {
            return{
               isSuccess:false,
               statusCode:StatusCodes.NOT_FOUND,
               message:'Tax Name is required'
            }}

     let existingTaxMaster = await TaxMaster.findOne({TaxId:model.TaxId})
     if(existingTaxMaster){
        existingTaxMaster.TaxName = model.TaxName || existingTaxMaster.TaxName,
        existingTaxMaster.TaxPercentage = model.TaxPercentage || existingTaxMaster.TaxPercentage,
        existingTaxMaster.TaxDescription = model.TaxDescription || existingTaxMaster.TaxDescription,
        await existingTaxMaster.save( )
        return{
            isSuccess: true,
            statusCode:StatusCodes.CREATED,
            message:`TaxId ${existingTaxMaster.TaxId} has been updated successfully`,
            data:existingTaxMaster
        }
     }else
     {
        if(!model.TaxId || model.TaxId ===-1 || model.TaxId === 0 ){
           const maxTaxId = await TaxMaster.find().sort({TaxId:-1}).limit(1)
           model.TaxId = maxTaxId.length >0 ? maxTaxId[0].TaxId+1:0; 
        }
       const existingTaxName = await TaxMaster.findOne({TaxName:model.TaxName})

if(existingTaxName){
    return{
        isSuccess:false,
        statusCode:StatusCodes.CONFLICT,
        message:'Tax Name already exists'
    }
}
const newTaxMaster = new TaxMaster(model);
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