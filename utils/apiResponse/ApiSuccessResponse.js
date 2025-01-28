class ApiSuccessResponse{
    constructor(isSuccess,statusCode, message, data, pageNo, pageSize, rowCount){
        if(isSuccess) this.isSuccess = isSuccess|| true;
        if(statusCode) this.statusCode = statusCode,
        this.message = message || "Data fetched the successfully",
        this.data = this.data
        if(pageNo) this.pageNo = pageNo;
        if(pageSize) this.pageSize = pageSize;
        if(rowCount) this.rowCount = rowCount;
        
    }
}

export default ApiSuccessResponse;