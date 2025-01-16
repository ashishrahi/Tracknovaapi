class ApiSuccessResponse{
    constructor(statusCode,  data){
        this.isSuccess = true,
        this.statusCode = statusCode,
        this.message = "Data Successfully fetched",
        this.data = data
    }
}

export default ApiSuccessResponse;