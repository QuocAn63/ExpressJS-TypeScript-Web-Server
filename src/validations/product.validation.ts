import { body } from "express-validator";

export const productValidationSchemas = {
  name: body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name can not be empty")
    .isString()
    .withMessage("Product name must be string")
    .isLength({ min: 8, max: 100 })
    .escape()
    .bail(),
  price: body("price")
    .trim()
    .notEmpty()
    .withMessage("Product price can not be empty")
    .isNumeric()
    .withMessage("Product price must be numberic")
    .escape()
    .bail(),
  description: body("description")
    .trim()
    .isString()
    .withMessage("Product description must be string")
    .isLength({ min: 8 })
    .optional()
    .escape()
    .bail(),
  stocks: body("stocks")
    .trim()
    .notEmpty()
    .withMessage("Product stocks can not be empty")
    .isNumeric()
    .withMessage("Product stocks must be numberic")
    .escape()
    .bail(),
  status: body("status")
    .trim()
    .isString()
    .withMessage('Product status must be "Invinsible" or "Visible"')
    .custom((value) => ["visible", "invisible"].includes(value))
    .bail(),
};

type productValidationType = keyof typeof productValidationSchemas;

const productValidationRules = (...keys: productValidationType[]) =>
  keys.map((key) => productValidationSchemas[key]);

export default productValidationRules;
