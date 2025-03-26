import Joi from "joi";

function validateRegisterCompanyModel(model){
    const schema = Joi.object({
        companyName: Joi.string().min(3).max(100).required().messages({
            "string.base": "Company name must be a string.",
            "string.empty": "Company name is required.",
            "string.min": "Company name must be at least 3 characters.",
            "string.max": "Company name must be less than 100 characters.",
            "any.required": "Company name is required."
        }),
    
        industryType: Joi.string().optional().messages({
            "string.base": "Industry type must be a string."
        }),
    
        fleetSize: Joi.number().integer().min(1).optional().messages({
            "number.base": "Fleet size must be a number.",
            "number.min": "Fleet size must be at least 1."
        }),
    
        companyPhone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
            "string.pattern.base": "Company phone must be a 10-digit number.",
            "any.required": "Company phone is required."
        }),
    
        companyEmail: Joi.string().email().required().messages({
            "string.email": "Invalid email format.",
            "string.empty": "Company email is required.",
            "any.required": "Company email is required."
        }),
    
        pan: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional().messages({
            "string.pattern.base": "PAN must be in format 'ABCDE1234F'."
        }),
    
        aadhaar: Joi.string().pattern(/^[0-9]{12}$/).optional().messages({
            "string.pattern.base": "Aadhaar must be exactly 12 digits."
        }),
    
        companyAddress: Joi.string().required().messages({
            "string.empty": "Company address is required."
        }),
    
        pincode: Joi.string().length(6).pattern(/^[0-9]{6}$/).required().messages({
            "string.length": "Pincode must be exactly 6 digits.",
            "string.pattern.base": "Pincode must be numeric and exactly 6 digits.",
            "any.required": "Pincode is required."
        }),
    
        city: Joi.string().required().messages({
            "string.empty": "City is required."
        }),
    
        state: Joi.string().required().messages({
            "string.empty": "State is required."
        }),
    
        country: Joi.string().required().messages({
            "string.empty": "Country is required."
        }),
    
        admin: Joi.object({
            name: Joi.string().required().messages({
                "string.empty": "Admin name is required."
            }),
            email: Joi.string().email().required().messages({
                "string.email": "Admin email must be a valid email.",
                "any.required": "Admin email is required."
            }),
            phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required().messages({
                "string.empty": "Phone number cannot be empty.", 
                "string.pattern.base": "Admin phone must be a 10-digit number.",
                "any.required": "Admin phone is required."
            }),
            role: Joi.string().valid("SuperAdmin", "Admin", "User").required().messages({
                "any.only": "Role must be one of 'SuperAdmin', 'Admin', or 'User'.",
                "any.required": "Admin role is required."
            })
        }).required(),
    
        subscription: Joi.object({
            plan: Joi.string().valid("Basic", "Pro", "Enterprise").required().messages({
                "any.only": "Subscription plan must be Basic, Pro, or Enterprise.",
                "any.required": "Subscription plan is required."
            }),
            fromDate: Joi.date().iso().required().messages({
                "date.format": "Start date must be in ISO format (YYYY-MM-DD).",
                "any.required": "Start date is required."
            }),
            toDate: Joi.date().iso().greater(Joi.ref("fromDate")).required().messages({
                "date.greater": "End date must be after the start date.",
                "any.required": "End date is required."
            }),
            status: Joi.string().valid("Active", "Suspended", "Expired").default("Active").messages({
                "any.only": "Subscription status must be Active, Suspended, or Expired."
            })
        }).required(),
    
        database: Joi.object({
            dbName: ""
            // .required().messages({
            //     "string.empty": "Database name is required."
            // }),,
            ,
            backupEnabled: Joi.boolean().default(false)
        }).optional()
    });

    return schema.validate(model, { abortEarly: true });
}

function validateSigninModel(model){
    const Schema = Joi.object({
        username: Joi.string().email().required().messages({
            "string.email": "Invalid email format",
            "any.required": "Email is required"
        }),
        password: Joi.string().required().messages({ // ✅ FIXED: Use .messages()
            "string.empty": "Password is required.",
            "any.required": "Password is required."
        }),
        
    })

    return Schema.validate(model, { abortEarly: true });
}

export { validateRegisterCompanyModel, validateSigninModel }