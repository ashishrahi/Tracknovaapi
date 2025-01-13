class ApiSuccessResponse{
    constructor(statusCode, message, data){
        this.isSuccess = true,
        this.statusCode = statusCode,
        this.message = message,
        this.data = data
    }
}

export default ApiSuccessResponse;