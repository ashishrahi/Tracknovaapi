import Joi from "joi";

const employeeSchema = Joi.object({
  empid: Joi.string().required(),
  empName: Joi.string().required(),
  empCode: Joi.string().required(),
  empPerAddress: Joi.string().min(6).required(),
  empLocalAddress: Joi.string(),
  empFatherName: Joi.string().min(3).required(),
  empMotherName: Joi.string().min(3).required(),
  empMobileNo: Joi.string().min(10).max(10).required(), // assuming mobile number validation
  empStatus: Joi.string().valid("active", "inactive").required(), // added valid status options
  empPanNumber: Joi.string().length(10).alphanum().required(), // assuming Pan card number is alphanumeric of length 10
  empAddharNo: Joi.string()
    .length(12)
    .pattern(/^[0-9]+$/)
    .required(), // Assuming Adhar is numeric and 12 digits
  empDob: Joi.date().required(), // date format validation
  empJoiningDate: Joi.date().required(),
  empretirementDate: Joi.date().required(), // Retirement date should be after Joining date
  empDesignationId: Joi.string().required(),
  empDeptId: Joi.string().required(),
  empStateId: Joi.string().required(),
  empCountryID: Joi.string().required(),
  empCityId: Joi.string().required(),
  empPincode: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required(), // assuming pincode is 6 digits
  imageFile: Joi.string().optional(), // assuming image file URL (if file upload path/URL is provided)
  signatureFile: Joi.string().optional(), // same as ImageFile for signature
  email: Joi.string().email().required(),
  dlno: Joi.string().min(15).max(15).required(), // Assuming Driving License number length
  gender: Joi.string().required(), // Assuming gender options
});
const validateEmpMaster = (model) => {
  return employeeSchema.validate(model);
};

export { validateEmpMaster };
