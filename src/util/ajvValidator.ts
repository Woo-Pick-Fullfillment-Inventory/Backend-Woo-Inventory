import Ajv from "ajv";

export const validateTypeFactory = <T>(type: T, schema: object): boolean => {
  const ajv = new Ajv();
  const validateType = ajv.compile<T>(schema);
  return validateType(type);
};