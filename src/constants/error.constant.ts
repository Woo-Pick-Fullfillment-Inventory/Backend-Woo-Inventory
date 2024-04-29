export const ERRORS = {
  INVALID_REPOSNE_TYPE: "Response type not expected",
  INVALID_RESPONSE_STATUS: "Response status not expected",
  INVALID_RESPONSE_HEADERS: "Response headers not expected",
  AXIOS_ERROR: "Axios Error",
  NO_AUTHORIZATION_HEADER: "No authorization header found",
  NO_TOKEN_FOUND: "No token found",
  BATCH_SIZE_EXCEEDED: "Batch size exceeds limit",
} as const;