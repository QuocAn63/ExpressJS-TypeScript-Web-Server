import { body, Schema, checkSchema } from "express-validator";

export const userDataValidateSchema = checkSchema({
  username: {
    trim: true,
    exists: {
      errorMessage: "Username can not empty",
      bail: true,
    },
    isString: {
      errorMessage: "Username must be string",
    },
    escape: true,
  },
  password: {
    trim: true,
    exists: {
      errorMessage: "Password can not empty",
      bail: true,
    },
    isString: {
      errorMessage: "Password must be string",
    },
  },
  passwordconfirm: {
    trim: true,
    exists: {
      errorMessage: "Username can not empty",
      bail: true,
    },
    isString: {
      errorMessage: "Username must be string",
    },
    custom: {
        if: (value, {req}) => 
    }
  },
});
