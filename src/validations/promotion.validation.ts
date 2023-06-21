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
    .custom((value, { req }) => {
      const isValid = !req.body.amount && !!value;
      return isValid;
    })
    .withMessage("Promotion type just in Percentage or Amount")
    .optional()
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
    .custom((value, { req }) => {
      const isValid = !req.body.percentage && !!value;

      return isValid;
    })
    .optional()
    .withMessage("Promotion type just in Percentage or Amount")
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
    .optional()
    .bail(),
};

type promotionValidationType = keyof typeof promotionValidationSchemas;

const promotionValidationRules = (...keys: promotionValidationType[]) =>
  keys.map((key) => promotionValidationSchemas[key]);

export default promotionValidationRules;
