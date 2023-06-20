import { body } from "express-validator";

export const promotionValidationSchemas = {
  title: body("title")
    .trim()
    .notEmpty()
    .withMessage("Promotion title can not be empty")
    .isString()
    .withMessage("Promotion title must be string")
    .isLength({ min: 5, max: 100 })
    .escape()
    .bail(),
  percentage: body("percentage")
    .trim()
    .notEmpty()
    .withMessage("Promotion percentage can not be empty")
    .isNumeric()
    .withMessage("Promotion percentage must be numberic")
    .isInt({ min: 1, max: 99 })
    .withMessage("Promotion percentage must between 1 and 99")
    .escape()
    .bail(),
  amount: body("amount")
    .trim()
    .notEmpty()
    .withMessage("Promotion amount can not be empty")
    .isNumeric()
    .withMessage("Promotion amount must be numberic")
    .isInt({ min: 1000 })
    .withMessage("Promotion amount must be greater than 1000")
    .escape()
    .bail(),
  description: body("description")
    .trim()
    .isString()
    .withMessage("Promotion description must be string")
    .isLength({ min: 8 })
    .optional()
    .escape()
    .bail(),
  status: body("status")
    .trim()
    .isString()
    .withMessage('Promotion status must be "Invinsible" or "Visible"')
    .custom((value) => ["visible", "invisible"].includes(value))
    .bail(),
};

type productValidationType = keyof typeof promotionValidationSchemas;

const productValidationRules = (...keys: productValidationType[]) =>
  keys.map((key) => promotionValidationSchemas[key]);

export default productValidationRules;
