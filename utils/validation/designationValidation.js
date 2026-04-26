import Joi from "joi";

const designationSchema = Joi.object({

    designationId: Joi.number().integer().required(),
    designationName: Joi.string().min(3).required().label("Designation Name"),
    designationCode: Joi.string().alphanum().required(),
    createdBy: Joi.string().required().label("Created By"),
    updatedBy: Joi.string().required().label("Updated By"),
    createdOn: Joi.date(),
    updatedOn: Joi.date()

})

const validateDesignation = (model)=>{
    return designationSchema.validate(model)
}
export{validateDesignation}