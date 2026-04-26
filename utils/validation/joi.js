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
    
        companyPhone: Joi.string()
            .trim()
            .required()
            .custom((value, helpers) => {
                const digits = String(value).replace(/\D/g, "");
                let local = digits;
                if (local.length === 12 && local.startsWith("91")) {
                    local = local.slice(-10);
                } else if (local.length > 10) {
                    local = local.slice(-10);
                }
                if (!/^\d{10}$/.test(local)) {
                    return helpers.error("any.custom", { message: "Company phone must be a valid 10-digit number." });
                }
                return local;
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
            phone: Joi.string()
                .trim()
                .required()
                .custom((value, helpers) => {
                    const digits = String(value).replace(/\D/g, "");
                    let local = digits;
                    if (local.length === 12 && local.startsWith("91")) {
                        local = local.slice(-10);
                    } else if (local.length > 10) {
                        local = local.slice(-10);
                    }
                    if (!/^\d{10}$/.test(local)) {
                        return helpers.error("any.custom", {
                            message: "Admin phone must be a valid 10-digit number (you may use +91 or spaces).",
                        });
                    }
                    return local;
                })
                .messages({
                    "string.empty": "Phone number cannot be empty.",
                    "any.required": "Admin phone is required.",
                }),
            role: Joi.string().valid("SuperAdmin", "Admin", "User").required().messages({
                "any.only": "Role must be one of 'SuperAdmin', 'Admin', or 'User'.",
                "any.required": "Admin role is required."
            })
        }),
    
        subscription: Joi.object({
            plan: Joi.string().valid("Basic", "Pro", "Enterprise", "Trial").required().messages({
                "any.only": "Subscription plan must be Basic, Pro, Enterprise, or Trial.",
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
            status: Joi.string().valid("Pending", "Active", "Suspended", "Expired").default("Active").messages({
                "any.only": "Subscription status must be Pending, Active, Suspended, or Expired."
            })
        }),
    
        database: Joi.object({
            // Empty/omitted: server generates a unique name from companyName (public signup).
            // Non-empty: honored for super-admin / internal create flows; must be valid tenant db name.
            dbName: Joi.string()
                .trim()
                .max(64)
                .allow("")
                .optional()
                .pattern(/^$|^[a-zA-Z0-9_-]{1,64}$/)
                .messages({
                    "string.max": "Database name must be at most 64 characters.",
                    "string.pattern.base": "Invalid database name. Use letters, numbers, underscore, or hyphen only.",
                }),
            backupEnabled: Joi.string().valid("Active", "Inactive").default("Active")
        })
    });

    return schema.validate(model, { abortEarly: true });
}

function validateSigninModel(model){
    const Schema = Joi.object({
        username: Joi.string().required().messages({
            "any.required": "Username is required"
        }),
        password: Joi.string().required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required."
        }),
        /**
         * Optional tenant hint for multi-tenant sign-in. Omit for legacy (username+password only).
         * At least one of these should be sent for workspace login when duplicate usernames exist across companies.
         */
        companyCode: Joi.string().trim().max(20).allow("").optional(),
        workspaceSlug: Joi.string().trim().max(64).allow("").optional(),
    })

    return Schema.validate(model, { abortEarly: true });
}

/**
 * At least one field required. Used by PATCH /v2/tenant/branding.
 */
function validatePatchTenantBranding(model) {
    const hexOrEmpty = Joi.string()
        .trim()
        .max(32)
        .allow(null, "")
        .custom((value, helpers) => {
            if (value == null || value === "") return value;
            if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
                return helpers.error("any.custom", { message: "Primary color must be a hex value like #2563EB or #fff." });
            }
            return value;
        });

    const schema = Joi.object({
        companyName: Joi.string().trim().min(3).max(100).optional(),
        primaryColor: hexOrEmpty.optional(),
        supportEmail: Joi.alternatives()
            .try(Joi.valid(null, ""), Joi.string().trim().max(254).email())
            .optional(),
        logoDataUrl: Joi.string().max(2_500_000).allow(null, "").optional(),
        clearLogo: Joi.boolean().optional(),
    })
        .or("companyName", "primaryColor", "supportEmail", "logoDataUrl", "clearLogo")
        .messages({
            "object.missing": "At least one branding field is required.",
        });

    return schema.validate(model, { abortEarly: true, stripUnknown: true });
}

export { validateRegisterCompanyModel, validateSigninModel, validatePatchTenantBranding }