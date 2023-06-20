import { body } from "express-validator";

const userValidationSchemas = {
  name: body("name")
    .trim()
    .isString()
    .withMessage("Name must be string")
    .escape()
    .bail()
    .optional(),
  dob: body("dob")
    .trim()
    .isDate()
    .withMessage("Date of birth must be Date type")
    .bail()
    .optional(),
  gender: body("gender")
    .trim()
    .custom((value) => value in ["male", "female"])
    .withMessage("Unknown gender")
    .bail()
    .optional(),
  phonenumber: body("phonenumber")
    .trim()
    .isMobilePhone("vi-VN")
    .withMessage("Invalid phone number")
    .bail()
    .optional(),
};

type userValidationType = keyof typeof userValidationSchemas;

const userValidationRules = (...keys: userValidationType[]) =>
  keys.map((key) => userValidationSchemas[key]);

export default userValidationRules;
