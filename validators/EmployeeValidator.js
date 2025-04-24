import Joi from "joi";

const employeeSchema = Joi.object({
  Empid: Joi.string().required(),
  EmpName: Joi.string().required(),  // changed to 'min(3)' for name length
  EmpCode: Joi.string().required(),
  EmpPerAddress: Joi.string().min(6).required(),
  EmpLocalAddress: Joi.string(),
  EmpFatherName: Joi.string().min(3).required(),
  EmpMotherName: Joi.string().min(3).required(),
  EmpMobileNo: Joi.string().min(10).max(15).required(),  // assuming mobile number validation
  EmpStatus: Joi.string().valid("active", "inactive").required(),  // added valid status options
  EmpPanNumber: Joi.string().length(10).alphanum().required(),  // assuming Pan card number is alphanumeric of length 10
  EmpAddharNo: Joi.string().length(12).pattern(/^[0-9]+$/).required(),  // Assuming Adhar is numeric and 12 digits
  EmpDob: Joi.date().required(),  // date format validation
  EmpJoiningDate: Joi.date().required(),
  EmpRetirementDate: Joi.date().required(),  // Retirement date should be after Joining date
  EmpPincode: Joi.string().length(6).pattern(/^[0-9]+$/).required(),  // assuming pincode is 6 digits
  ImageFile: Joi.string().uri().optional(),  // assuming image file URL (if file upload path/URL is provided)
  SignatureFile: Joi.string().uri().optional(),  // same as ImageFile for signature
  Email: Joi.string().email().required(),
  DLNo: Joi.string().min(15).max(15).required(),  // Assuming Driving License number length
  Gender: Joi.string().valid("Male", "Female", "Other").required(),  // Assuming gender options
});

module.exports = employeeSchema;
