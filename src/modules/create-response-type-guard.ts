import Ajv, { Schema, ValidateFunction, ErrorObject } from "ajv";

export type ValidationResult = {
  isValid: boolean;
  errors: ErrorObject[]; // Errors should always be an array
};

export const isResponseTypeTrue = <T extends Schema>(
  schema: T,
  data: Record<string, any>,
  areAdditionalPropertiesRequired: boolean
): ValidationResult=> {
  const ajv = new Ajv();
  const validate: ValidateFunction = ajv.compile({
    ...(schema as Record<string, unknown>),
    additionalProperties: areAdditionalPropertiesRequired,
  });
  const isValid = validate(data) as boolean;
  const errors = isValid ? [] : validate.errors || []; 
  return { isValid, errors };
};