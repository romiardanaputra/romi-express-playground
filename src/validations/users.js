import { query } from "express-validator";

export const createUserSchema = {
  name: {
    notEmpty: {
      errorMessage: "name is required",
    },
    isString: {
      errorMessage: "name must be a string",
    },
  },
  age: {
    notEmpty: {
      errorMessage: "age is required",
    },
    isString: {
      errorMessage: "age must be a string",
    },
  },
};

export const filterUserSchema = {
  filter: {
    notEmpty: {
      errorMessage: "filter is required",
    },
    isString: {
      errorMessage: "filter must be a string",
    },
    isLength: {
      options: { min: 3, max: 10 },
      errorMessage: "filter must be between 3 and 10 characters",
    },
  },
};
