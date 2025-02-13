class ApiErrorResponse {
  constructor(errorMessage = "", statusCode = 500, stackTrace = "") {
    this.ErrorMessage = errorMessage;
    this.StackTrace = stackTrace;
    this.StatusCode = statusCode;
  }
}

export { ApiErrorResponse };
