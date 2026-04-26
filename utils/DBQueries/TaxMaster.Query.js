import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";



/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const AddUpdateTaxMasterQuery = async (model) => {
    try {
        const { TaxMaster } = await getTenantDBModels();
        
        if(!model.taxName || model.taxName ==="")
            {
            return{
               isSuccess:false,
               internalSuccess:"",
               mesg:'Tax Name is required'
            }}

     let existingTaxMaster = await TaxMaster.findOne({TaxId:model.taxId})
     if(existingTaxMaster){
        existingTaxMaster.TaxName = model.taxName || existingTaxMaster.TaxName,
        existingTaxMaster.TaxPercentage = model.taxPercentage || existingTaxMaster.TaxPercentage,
        existingTaxMaster.EffectiveDate = model.effectiveDate || existingTaxMaster.EffectiveDate,
        await existingTaxMaster.save( )
        return{
            isSuccess: true,
            internalSuccess:"",
            mesg:`TaxId ${existingTaxMaster.TaxId} has been updated successfully`,
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
        internalSuccess:"",
        mesg:'Tax Name already exists'
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

const createdTaxMaster = {
    taxId: newTaxMaster.TaxId,
    taxName: newTaxMaster.TaxName,
    taxPercentage: newTaxMaster.TaxPercentage,
    effectiveDate: newTaxMaster.EffectiveDate,
    createdBy: newTaxMaster.CreatedBy,
    updatedBy: newTaxMaster.UpdatedBy,
}


return{
    isSuccess: true,
    internalSuccess:"",
    mesg:`TaxId ${newTaxMaster.TaxId} has been added successfully`,
    insertedId:"",
    data:createdTaxMaster
}}
       
    } catch (error) {
       return{
        isSuccess: false,
        internalSuccess: "",
        insertedId:"",
        mesg:error.message,
       }
        
    }
}

/////////////////////////////////////////// ImportTaxMastersQuery //////////////////////////////////////////////////////////////////

export const ImportTaxMastersQuery = async (model) => {
    try {
        const { TaxMaster } = await getTenantDBModels();
        let inserted = 0;
        let skipped = 0;
            // Iterate over Model for getting a taxmaster object
            for (const taxmaster of model) {
            // destructure of taxmaster
         const {taxName,taxPercentage,effectiveDate} = taxmaster
             // Check taxname exist 
            const existing = await TaxMaster.findOne({TaxName:taxName})
            // taxname exist then skipped
            if (existing) {
                skipped++;
                continue;
            }
            // Sort TaxMaster in decreasing order
            const lastTax = await TaxMaster.findOne().sort({TaxId:-1}).limit(1)
            // assign new TaxId
            const nextTaxId = lastTax ? lastTax.TaxId +1 : 1;
            //create new Tax
            await TaxMaster.create({
                TaxId:nextTaxId,
                TaxName:taxName,
                TaxPercentage:taxPercentage,
                EffectiveDate:effectiveDate,
            })
            return {
                isSuccess: true,
                mesg: `CSV import successful`,
                inserted,
                skipped,
              };
        }
    } catch (error) {
        console.error('error',error)
        
    }
}


//////////////////////////////////////////// GetTaxMasterQuery //////////////////////////////////////////////////////////////////

export const GetTaxMasterQuery = async (model) => {

    try {
        const { TaxMaster } = await getTenantDBModels();

        if (model.taxId === -1) {
            const data = await TaxMaster.find({}).lean();

    const taxList = data.map((tax)=>{
        return{
        taxId: tax.TaxId,
        taxName: tax.TaxName,
        taxPercentage: parseFloat(tax.TaxPercentage.toString()),
        effectiveDate: tax.EffectiveDate,
        createdBy: tax.CreatedBy,
        updatedBy: tax.UpdatedBy,
        updatedOn:tax.updatedAt,
        CreatedOn:tax.createdAt
        
    }})


            return{
                isSuccess: true,
                internalSuccess: "",
                mesg: 'List of Tax Master Data fetched successfully',
                insertedId:"",
                data: taxList,
            }
        } else {
            const data = await TaxMaster.findOne({ TaxId: model.taxId }).lean();

           const taxDetail =  {
                taxId: data.TaxId,
                taxName: data.TaxName,
                taxPercentage: parseFloat(tax.TaxPercentage.toString()),
                effectiveDate: data.EffectiveDate,
                createdBy: data.CreatedBy,
                updatedBy: data.UpdatedBy,
                
            }


          return{
            isSuccess: true,
            internalSuccess:"",
            mesg: `Details of TaxId ${model.TaxId} of Tax Master fetched successfully`,
            insertedId:"",
            data: taxDetail,
          }
        }
    } catch (error) {
      return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        mesg: error.message,
      }
    }

}
///////////////////////////////////////////// DeleteTaxMasterQuery //////////////////////////////////////////////////////////////////

export const DeleteTaxMasterQuery = async (model) => {
    try {
        const { TaxMaster } = await getTenantDBModels();

        const records = await TaxMaster.find({TaxId:model.taxId});
       
        if(records && records.length >0){
            await TaxMaster.deleteMany({TaxId:model.taxId})
            return{
                isSuccess:true,
                internalSuccess:"",
                mesg:`TaxId ${model.taxId} was successfully deleted`
            }}
            else{
                return{
                    isSuccess:false,
                    statusCode:StatusCodes.NOT_FOUND,
                    mesg:`TaxId ${model.taxId} not found`
                }
            }
        
    } catch (error) {
        return{
            isSuccess: false,
            internalSuccess: "",
            mesg:error.message,
        }
        
    }
}