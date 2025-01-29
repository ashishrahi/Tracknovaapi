class ApiErrorResponse{

    // constructor(statusCode, error ){
    //     this.isSuccess =  false;
    //     this.statusCode = statusCode;
    //     this.message = error;

    constructor(isSuccess,statusCode, error ){
        this.isSuccess =  isSuccess,
        this.statusCode = statusCode,
        this.error = error

    }
}

export default ApiErrorResponse;