import authValidationRules from "./authenticate.validation";
import userValidationRules from "./user.validation";
import productValidationRules from "./product.validation";
import promotionValidationRules from "./promotion.validation";

const bodyValidator = {
  authValidationRules,
  userValidationRules,
  productValidationRules,
  promotionValidationRules,
};

export default bodyValidator;
