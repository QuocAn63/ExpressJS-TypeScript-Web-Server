import authValidationRules from "./authenticate.validation";
import userValidationRules from "./user.validation";
import productValidationRules from "./product.validation";

const bodyValidator = {
  authValidationRules,
  userValidationRules,
  productValidationRules,
};

export default bodyValidator;
