import Joi from "joi";
const cityMasterSchema = Joi.object({
    cityId: Joi.number().required().label("City ID"),
    cityName: Joi.string().trim().min(1).required().label("City Name"),
    stateId:  Joi.number().required().label("State ID"),
    createdOn: Joi.date().required().label("Created On"),
    updatedOn: Joi.date().required().label("Updated On"),
    // createdBy: Joi.number().required().label("Created By"),
    // updatedBy:  Joi.number().required().label("Updated By"),
})
const validatecityMaster = (model) => {
  return cityMasterSchema.validate(model);
};

export { validatecityMaster};

