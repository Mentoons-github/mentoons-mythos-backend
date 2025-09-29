import Joi from "joi";

const messages = {
  required: "This field is required",
  invalidEmail: "Please provide a valid email",
  invalidPassword: "Password must contain only alphanumeric characters",
  passwordMin: "Password should have at least 6 characters",
  passwordMax: "Password cannot exceed 10 characters",
};

const userAuthJoi = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "FirstName is required",
    "any.required": messages.required,
  }),

  lastName: Joi.string().required().messages({
    "string.empty": "LastName is required",
    "any.required": messages.required,
  }),

  dateOfBirth: Joi.date()
    .less('now')
    .required()
    .messages({
      "date.base": "Date of Birth must be a valid date",
      "date.less": "Date of Birth cannot be in the future",
      "any.required": "Date of Birth is required",
    }),

  country: Joi.string().required().messages({
    "string.empty": "Country is required",
    "any.required": messages.required,
  }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.email": messages.invalidEmail,
      "any.required": messages.required,
    }),

  password: Joi.string()
    .min(6)
    .pattern(/[0-9]/, "number") 
    .pattern(/[!@#$%^&*(),.?_":{}|<>]/, "special character") 
    .required()
    .messages({
      "string.min": "Password must have at least 6 characters",
      "string.pattern.name": "Password must contain at least one {#name}", 
      "any.required": "Please enter a new password",
    }),
}).options({ allowUnknown: true });


export default userAuthJoi;
