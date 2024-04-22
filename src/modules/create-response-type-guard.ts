import Ajv from "ajv";

import type { Schema } from "ajv";

export type ValidationResult =
  | {
      isValid: false;
      errorMessage: string;
    }
  | {
      isValid: true;
    };

export const isResponseTypeTrue = <T extends Schema>(
  schema: T,
  data: Record<string, unknown> | Record<string, unknown>[],
  areAdditionalPropertiesAllowed: boolean,
): ValidationResult => {
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
  });
  const validate = ajv.compile({
    ...(schema as Record<string, unknown> | Record<string, unknown>[]),
    additionalProperties: areAdditionalPropertiesAllowed,
  });
  const isValid = validate(data) as boolean;
  return isValid
    ? { isValid }
    : {
      isValid: false,
      errorMessage:
          validate.errors?.map((error) => `${error.schemaPath} ${error.message}`).join("; ") || "",
    };
};
