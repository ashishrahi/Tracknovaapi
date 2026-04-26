import Joi from "joi";

const stateMasterSchema = Joi.object({
    stateId: Joi.number().integer().required(),
    stateName: Joi.string().min(3).max(100).required(),
    stateCode: Joi.string().min(2).max(10).required(),
    countryId: Joi.number().integer().required()
}).unknown(true);

const validateStateMaster = (model) => {
  return stateMasterSchema.validate(model);
};

export { validateStateMaster};
