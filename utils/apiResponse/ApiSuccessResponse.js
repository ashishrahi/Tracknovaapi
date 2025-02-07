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
        this.IsSuccess = isSuccess;
        this.InternalSuccess = internalSuccess;
        this.Mesg = mesg;
        this.InsertedId = insertedId;
        this.Data = data;
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
    constructor(status, message, data, where, rowCount, orderby, pageNo, pageSize, error = new ExceptionHandler()) {
        this.Status = status;
        this.Message = message;
        this.Data = data;
        this.Where = where;
        this.RowCount = rowCount;
        this.Orderby = orderby;
        this.PageNo = pageNo;
        this.PageSize = pageSize;
        this.Error = error;
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
        this.IsSuccess = isSuccess;
        this.Id = id;
        this.CreateUpdate = createUpdate;
        this.MSG = msg;
        this.Data = data;
        this.DataEx1 = dataEx1;
        this.DataEx2 = dataEx2;
        this.DataEx3 = dataEx3;
        this.DataEx4 = dataEx4;
    }
}

// Export the classes and enum
export { ApiSuccessResponse, ReturnData, ProReturnData, CommonResponse, ExceptionHandler, EnumVoucher, DBReturn };
