import Ajv from "ajv";

export const validateTypeFactory = <T>(needToBeValidated: T, schema: object): boolean => {
  const ajv = new Ajv();
  const validateType = ajv.compile(schema);
  return validateType(needToBeValidated);
};