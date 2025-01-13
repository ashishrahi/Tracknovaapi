class ApiErrorResponse{
    constructor(statusCode, error ){
        this.isSuccess =  false,
        this.statusCode = statusCode,
        this.error = error
    }
}

export default ApiErrorResponse;