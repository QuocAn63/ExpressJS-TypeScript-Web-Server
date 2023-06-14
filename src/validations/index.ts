import { authenticateValidationSchemas } from "./authenticate.validation";

function createChains<T>(keys: Record<string, T>) {
  return function (...args: Array<keyof typeof keys>) {
    const values = args.map((key) => keys[key]);

    return values;
  };
}

const test = createChains(authenticateValidationSchemas);

const validationChains = {
  authenticate: createChains(authenticateValidationSchemas),
};

export default validationChains;
