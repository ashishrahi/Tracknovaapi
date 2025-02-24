class ApiSuccessResponse{
    constructor(isSuccess,statusCode, message, data, pageNo, pageSize, rowCount){
        if(isSuccess) this.isSuccess = isSuccess|| true;
        if(statusCode) this.statusCode = statusCode,
        message ==="default" ? this.message = "Data Successfully fetched" : this.message = message;
        this.data = data
        if(pageNo) this.pageNo = pageNo;
        if(pageSize) this.pageSize = pageSize;
        if(rowCount) this.rowCount = rowCount;

    }
}
//------Till Here
class ReturnData {
    constructor(isSuccess, internalSuccess, mesg = null, insertedId = null, data = null) {
        this.isSuccess = isSuccess;
        this.internalSuccess = internalSuccess;
        this.mesg = mesg;
        this.insertedId = insertedId;
        this.data = data;
    }
}

class ProReturnData {
    constructor(isSuccess, msg = null, id = null) {
        this.IsSuccess = isSuccess;
        this.Msg = msg;
        this.Id = id;
    }
}

class CommonResponse {  
    constructor(status, message, data,  rowCount, orderby, pageNo, pageSize,
        error = new ExceptionHandler()
    ) {
        this.status = status;
        this.message = message;
        this.data = data || null;
        this.where = null;
        this.rowCount = rowCount || null;
        this.orderby = orderby || null;
        this.pageNo = pageNo || null;
        this.pageSize = pageSize || null;
        this.error = error || null;
    }
}

class ExceptionHandler {
    constructor(errorMessage = "", stackTrace = "", statusCode = 500) {
        this.ErrorMessage = errorMessage;
        this.StackTrace = stackTrace;
        this.StatusCode = statusCode;
    }
}

// Enum equivalent in JS
const EnumVoucher = Object.freeze({
    WrkIssue: "WrkIssue",
    AssetIssue: "AssetIssue",
    Mrn: "Mrn",
    Qc: "Qc",
    StockGeneral: "StockGeneral",
    WrkReturn: "WrkReturn",
    AssetReturn: "AssetReturn"
});

class DBReturn {
    constructor(isSuccess, id, createUpdate, msg, data = null, dataEx1 = null, dataEx2 = null, dataEx3 = null, dataEx4 = null) {
        this.isSuccess = isSuccess;
        this.id = id;
        this.createUpdate = createUpdate;
        this.msg = msg;
        this.data = data;
        this.dataEx1 = dataEx1;
        this.dataEx2 = dataEx2;
        this.dataEx3 = dataEx3;
        this.dataEx4 = dataEx4;
    }
}

// Export the classes and enum
export { ApiSuccessResponse, ReturnData, ProReturnData, CommonResponse, ExceptionHandler, EnumVoucher, DBReturn };
