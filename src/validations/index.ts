import authValidationRules from "./authenticate.validation";
import userValidationRules from "./user.validation";

const bodyValidator = {
  authValidationRules,
  userValidationRules,
};

export default bodyValidator;
