class ApiSuccessResponse{
    constructor(isSuccess,statusCode, message, data){
        this.isSuccess = isSuccess,
        this.statusCode = statusCode,
        this.message = message,
        this.data = data
    }
}

export default ApiSuccessResponse;