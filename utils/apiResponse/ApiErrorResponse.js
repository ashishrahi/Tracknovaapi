class ApiErrorResponse {
  constructor( statusCode = 500,  errorMessage = "",  stackTrace = "") {
    this.ErrorMessage = errorMessage;
    this.StackTrace = stackTrace;
    this.StatusCode = statusCode;
  }
}

export { ApiErrorResponse };
