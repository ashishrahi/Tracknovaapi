import { StatusCodes } from "http-status-codes";
import { VehicleAddTempInfo } from "../modals/index.js";
import { ApiSuccessResponse, CommonResponse } from "../utils/apiResponse/index.js";

//-------------AddUpdateVehicleAuditInfo------->
async function AddUpdateVehicleAuditInfo(req, res, next) {
  try {
    const model = req.body;
    // return res.json({model})
    if (model.id === 0 || !model.id) {
      // using select it means only Id field will return;
      const lastVehicle = await VehicleAddTempInfo.findOne()
        .sort({ Id: -1 })
        .select("Id")
        .lean();
      const newNextid = lastVehicle ? lastVehicle.Id + 1 : 1; // Assign next ID

      // Insert the new document
      const newVehicle = new VehicleAddTempInfo({
        Id: newNextid,
        CompanyName: model.companyName,
        CreatedBy: model.createdBy,
        UpdatedBy: model.updatedBy,
        VehicleId: model.vehicleId,
        VehicleNo: model.vehicleNo,
        DeviceType: model.deviceType,
        DeviceNo: model.deviceNo,
        OlddeviceNo: model.OlddeviceNo,
        EmpMobileNo: model.empMobileNo,
        EmpName: model.empName,
        EmpId: model.empId,
        ProblemType: model.problemType,
        OldSimNo: model.oldSimNo,
        ServiceEngg: model.serviceEngg,
        SimNo: model.simNo,
        SimType: model.simType,
        WorkType: model.workType,
        Replacement: model.replacement,
        Repair: model.repair,
        Remark: model.remark,
      });
      const savedVehicle = await newVehicle.save();

      if (savedVehicle) {
        return res
          .status(StatusCodes.CREATED)
          .json(
            new CommonResponse(
              true,
              "Added Successfully",
              newVehicle
            )
          );
      } else {
        const error = new Error("Failed to save vehicle data. Try again");
        (error.status = StatusCodes.INTERNAL_SERVER_ERROR), next(error);
      }
    } else {
      // Update the existing document
      const updatedVehicle = await VehicleAddTempInfo.findOneAndUpdate(
        { Id: model.id },
        {
          // Id: newNextid,
          CompanyName: model.companyName,
          VehicleId: model.vehicleId,
          VehicleNo: model.vehicleNo,
          DeviceType: model.deviceType,
          DeviceNo: model.deviceNo,
          OlddeviceNo: model.OlddeviceNo,
          EmpMobileNo: model.empMobileNo,
          EmpName: model.empName,
          EmpId: model.empId,
          ProblemType: model.problemType,
          OldSimNo: model.oldSimNo,
          ServiceEngg: model.serviceEngg,
          SimNo: model.simNo,
          SimType: model.simType,
          WorkType: model.workType,
          Replacement: model.replacement,
          Repair: model.repair,
          Remark: model.remark,
          CreatedBy: model.createdBy,
          UpdatedBy: model.updatedBy,
        },
        { new: true }
      );

      if (!updatedVehicle) {
        const error = new Error("Vehicle not found");
        error.status = StatusCodes.NOT_FOUND;
        return next(error);
        // return res.status(StatusCodes.NOT_FOUND).json(new ApiSuccessResponse(StatusCodes.NOT_FOUND, ))({
        //     status: "Failed",
        //     message: "Vehicle not found",
        // });
      }

      return res
        .status(StatusCodes.OK)
        .json(
          new CommonResponse(
            true,
            "Updated Successfully",
            updatedVehicle
          )
        );
    }
  } catch (err) {
    const error = new Error(err.message);
    error.status = StatusCodes.INTERNAL_SERVER_ERROR;
    next(error);
  }
}

//-------------GetVehicleAuditInfo------->
async function GetVehicleAuditInfo(req, res, next) {
  try {
    let query = { };

    // let { id, vehicleNo, vehicleId, simNo, deviceNo, problemType, serviceEngg, olddeviceNo, oldSimNo, empName, empMobileNo, empId, deviceType, simType,  } = req.body;

    // if (id) query.Id = id;
    // if (vehicleNo) query.VehicleNo = vehicleNo;
    // if (vehicleId) query.VehicleId = vehicleId;
    // if (simNo) query.simNo = simNo;
    // if (deviceNo) query.DeviceNo = deviceNo;
    // if (problemType) query.ProblemType = problemType;
    // if (serviceEngg) query.ServiceEngg = serviceEngg;
    // if (olddeviceNo) query.OlddeviceNo = olddeviceNo;
    // if (oldSimNo) query.OldSimNo = oldSimNo;
    // if (empName) query.EmpName = empName;
    // if (empMobileNo) query.EmpMobileNo = empMobileNo;
    // if (empId) query.EmpId = empId;
    // if (deviceType) query.DeviceType = deviceType;
    // if (simType) query.simType = simType;

    // if(!pageNo) pageNo = 1;
    // if(!pageSize) pageSize = 10;
    
    // Apply dynamic filters using Mongoose's `find` method
    const data = await VehicleAddTempInfo.find(query).lean()
    const response = data.map((obj) => {
      let newObj = {};
      Object.keys(obj).forEach((key) => {
        let newKey = key.charAt(0).toLowerCase() + key.slice(1);
        newObj[newKey] = obj[key];
      });
      return newObj;
    });
    // .skip((pageNo - 1) * pageSize).limit(pageSize);
    let msg;
    data?.length === 0 ? msg = "No Record found" : msg = "Data Fetched Successfully"
    return res.status(StatusCodes.OK).json(new CommonResponse(true, msg, response, response.length ));
  } catch (err) {
    const error = new Error(err.message);
    error.status = StatusCodes.BAD_REQUEST;
    return next(error);
  }
}

//-------------DeleteVehicleAuditInfo------->
async function DeleteVehicleAuditInfo(req, res, next){
    try {
        let query = { };
    
        let { id, vehicleNo, vehicleId, simNo, deviceNo, problemType, serviceEngg, olddeviceNo, oldSimNo, empName, empMobileNo, empId, deviceType, simType, repair,  } = req.body;
    
        if (id) query.Id = id;
        if (vehicleNo) query.VehicleNo = vehicleNo;
        if (vehicleId) query.VehicleId = vehicleId;
        if (simNo) query.simNo = simNo;
        if (deviceNo) query.DeviceNo = deviceNo;
        if (problemType) query.ProblemType = problemType;
        if (serviceEngg) query.ServiceEngg = serviceEngg;
        if (olddeviceNo) query.OlddeviceNo = olddeviceNo;
        if (oldSimNo) query.OldSimNo = oldSimNo;
        if (empName) query.EmpName = empName;
        if (empMobileNo) query.EmpMobileNo = empMobileNo;
        if (empId) query.EmpId = empId;
        if (deviceType) query.DeviceType = deviceType;
        if (simType) query.SimType = simType;
        if (repair) query.Repair = repair;
        
        // Apply dynamic filters using Mongoose's `find` method
        const data = await VehicleAddTempInfo.findOneAndDelete(query)
        if(data){
          return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Successfully deleted" ));
        }else{
          const error = new Error("Document not found or already deleted")
          error.status = StatusCodes.NOT_FOUND;
          next(error)
        }
      } catch (err) {
        const error = new Error(err.message);
        error.status = StatusCodes.BAD_REQUEST;
        return next(error);
      }
}


export { AddUpdateVehicleAuditInfo, GetVehicleAuditInfo, DeleteVehicleAuditInfo };
