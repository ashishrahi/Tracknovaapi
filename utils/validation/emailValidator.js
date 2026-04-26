import Joi from "joi";

const emailSchema = Joi.object({
  id: Joi.string().required(),  
  name: Joi.string().min(3).required(),  
  email: Joi.string().email().required(), 
  port: Joi.number().integer().min(1).max(65535).required(), 
  IsActive: Joi.boolean().required(), 
});

module.exports = emailSchema;
