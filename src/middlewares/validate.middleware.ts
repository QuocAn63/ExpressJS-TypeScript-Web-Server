import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import HttpException from "../exceptions/httpException";

const handleErrorTypes = (error: ValidationError) => {
  switch (error.type) {
    case "field":
      return {
        field: error.path,
        message: error.msg,
      };
    case "unknown_fields":
      return {
        unknowfields: error.fields,
        message: error.msg,
      };
    case "alternative":
      return {};
    case "alternative_grouped":
      return {};
  }
};

const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req).array({ onlyFirstError: true });

  if (errors.length === 0) {
    next();
  } else {
    const extractedErrors = errors.map(handleErrorTypes);

    next(new HttpException(401, "Validation error", extractedErrors));
  }
};

export default validationMiddleware;
