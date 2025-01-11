class ApiErrorResponse{
    constructor(isSuccess,statusCode, error ){
        this.isSuccess =  isSuccess,
        this.statusCode = statusCode,
        this.error = error
    }
}

export default ApiErrorResponse;