import { body } from "express-validator";
const authValidationSchemas = {
  username: body("username")
    .trim()
    .notEmpty()
    .withMessage("Username can not be empty")
    .isString()
    .withMessage("Username must be string")
    .bail()
    .escape(),
  password: body("password")
    .trim()
    .notEmpty()
    .withMessage("Password can not be empty")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password should at least 8 chars and max 25 chars")
    .isString()
    .withMessage("Password must be string")
    .bail()
    .escape(),
  passwordconfirm: body("passwordconfirm")
    .trim()
    .notEmpty()
    .withMessage("Password confirm can not be empty")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password confirm should at least 8 chars and max 25 chars")
    .isString()
    .withMessage("Password must be string")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password confirm not match")
    .bail()
    .escape(),
  newpassword: body("newpassword")
    .trim()
    .notEmpty()
    .withMessage("New password can not be empty")
    .isLength({ min: 6, max: 25 })
    .withMessage("New password should at least 8 chars and max 25 chars")
    .isString()
    .withMessage("New password must be string")
    .custom((value, { req }) => {
      return value !== req.body.password;
    })
    .withMessage("New password should not same the old password")
    .bail()
    .escape(),
  token: body("token")
    .trim()
    .notEmpty()
    .withMessage("There is no token provided")
    .bail()
    .escape(),
};

type authValidationType = keyof typeof authValidationSchemas;

const authValidationRules = (...keys: authValidationType[]) =>
  keys.map((key) => authValidationSchemas[key]);

export default authValidationRules;
