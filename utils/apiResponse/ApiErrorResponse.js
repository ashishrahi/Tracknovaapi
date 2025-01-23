class ApiErrorResponse{
    constructor(statusCode, error ){
        this.isSuccess =  false;
        this.statusCode = statusCode;
        this.message = error;
    }
}

export default ApiErrorResponse;