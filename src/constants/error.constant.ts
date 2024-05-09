export const ERRORS = {
  INVALID_REPOSNE_TYPE: "Response type not expected",
  INVALID_RESPONSE_STATUS: "Response status not expected",
  INVALID_RESPONSE_HEADERS: "Response headers not expected",
  DATA_NOT_MODIFIED: "Data not modified",
  AXIOS_ERROR: "Axios Error",
  NO_AUTHORIZATION_HEADER: "No authorization header found",
  NO_TOKEN_FOUND: "No token found",
  BATCH_SIZE_EXCEEDED: "Batch size exceeds limit",
  USER_NOT_FOUND: "User not found",
  BATCH_WRITE_FAILED: "Batch write failed",
  DATA_ALREADY_EXISTS: "Data already exists",
  DATA_NOT_INSERTED: "Data not inserted",
} as const;