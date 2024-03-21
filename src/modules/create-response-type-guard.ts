import Ajv from "ajv";

import type {
  ErrorObject,
  Schema,
  ValidateFunction,
} from "ajv";

export type ValidationResult = {
  isValid: boolean;
  errors: ErrorObject[];
};

export const isResponseTypeTrue = <T extends Schema>(
  schema: T,
  data: Record<string, unknown>,
  areAdditionalPropertiesAllowed: boolean,
): ValidationResult=> {
  const ajv = new Ajv({ strict: false });
  const validate: ValidateFunction = ajv.compile({
    ...(schema as Record<string, unknown>),
    additionalProperties: areAdditionalPropertiesAllowed,
  });
  const isValid = validate(data) as boolean;
  const errors = isValid ? [] : validate.errors || [];
  return {
    isValid,
    errors,
  };
};