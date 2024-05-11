class APIResponseError extends Error{
  statusCode: number;
  type: string;
  isAPIResponseError: boolean = true;

  constructor(message: string, type: string, statusCode: number) {
    super(message);
    this.name = "APIResponseError"; // Default error name
    this.statusCode = statusCode;
    this.type = type;
  }
}

export default APIResponseError;