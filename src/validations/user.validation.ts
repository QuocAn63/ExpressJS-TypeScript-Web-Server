import { body } from "express-validator";

const userValidationSchemas = {
  name: body("name")
    .trim()
    .notEmpty()
    .withMessage("Name can not be empty")
    .isString()
    .withMessage("Name must be string")
    .escape()
    .bail(),
  dob: body("dob")
    .trim()
    .notEmpty()
    .withMessage("Date of birth can not be empty")
    .isDate()
    .withMessage("Date of birth must be Date type")
    .bail(),
  sex: body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender can not be empty")
    .custom((value) => value in ["male", "female"])
    .withMessage("Unknown gender"),
  phonenumber: body("phonenumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number can not be empty")
    .isMobilePhone("vi-VN")
    .withMessage("Invalid phone number")
    .bail(),
};

type userValidationType = keyof typeof userValidationSchemas;

const userValidationRules = (...keys: userValidationType[]) =>
  keys.map((key) => userValidationSchemas[key]);

export default userValidationRules;