class ApiErrorResponse{
    constructor(statusCode, error ){
        this.status = false;
        this.statusCode = statusCode,
        this.error = error
    }
}

export default ApiErrorResponse;