import { raiseBadRequest } from "./errors.js";

export const applyValidation = (value, schema) => {
  try {
    return schema.parse(value);
  } catch (error) {
    const issues = error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }));
    return raiseBadRequest(issues);
  }
};
