class ApiSuccessResponse{
    constructor(statusCode,  message = "Data Successfully fetched", data,   pageNo, pageSize, rowCount,){
        this.isSuccess = true;
        this.statusCode = statusCode;
        message ==="default" ? this.message = "Data Successfully fetched" : this.message = message;
        if(pageNo) this.pageNo = pageNo;
        if(pageSize) this.pageSize = pageSize;
        if(rowCount) this.rowCount = rowCount;
        if(data) this.data = data;

    }
}

export default ApiSuccessResponse;