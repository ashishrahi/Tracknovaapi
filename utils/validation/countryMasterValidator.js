import Joi from "joi";

const countryMasterSchema = Joi.object({
  countryId: Joi.number().integer().required(),
  countryName: Joi.string().min(3).max(100).required(),
  countryCode: Joi.string().min(2).max(10).required(),
}).unknown(true);

const validateCountryMaster = (model) => {
  return countryMasterSchema.validate(model);
};

export { validateCountryMaster};
