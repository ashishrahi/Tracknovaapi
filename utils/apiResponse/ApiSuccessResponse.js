class ApiSuccessResponse{
    constructor(statusCode, message = "Data Successfully fetched",  data, pageNo, pageSize, rowCount){
        this.isSuccess = true,
        this.statusCode = statusCode,
        this.message = message,
        this.data = data
        if(pageNo) this.pageNo = pageNo;
        if(pageSize) this.pageSize = pageSize;
        if(rowCount) this.rowCount = rowCount;

    }
}

export default ApiSuccessResponse;