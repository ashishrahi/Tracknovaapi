import { StatusCodes } from "http-status-codes";
import { ContractorMaster, ItemMaster, VehicleAddTempInfo } from "../modals/index.js";
import {ApiErrorResponse, ApiSuccessResponse, CommonResponse, ReturnData} from "../utils/apiResponse/index.js";
// import {ApiSuccessResponse} from "../utils/apiResponse/ApiSuccessResponse.js";

//--------------AddUpdateItemMaster-------->
async function AddUpdateItemMaster( req, res, next){
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
        const model = req.body;
        // let vNo = model.EScarp ? model.VehicleNo : "";
        let vNo =  model.vehicleNo;
        // let isNew = !model.ItemMasterId;

        if (model.itemMasterId === 0) {
            const existingVehicle = await ItemMaster.findOne({ VehicleNo: model.vehicleNo })
            // .session(session);
            if (existingVehicle){
                const error = new Error("Vehicle No. Already Exists...!!!!!")
                error.status = StatusCodes.CONFLICT;
                return next(error);
            };
            
            const lastItem = await ItemMaster.findOne().sort({ ItemMasterId: -1 })
            // .session(session);
            const updatedLastItemMasterId = lastItem ? lastItem.ItemMasterId + 1 : 1;
            const savedData = await new ItemMaster({
                "ItemMasterId": updatedLastItemMasterId,
                "ItemName": model.itemName,
                "ItemCode": model.itemCode,
                "ItemCategoryId": model.itemCategoryId,
                "ItemFlag": model.itemFlag,
                "ItemTypeId": model.itemTypeId,
                "EmpId": model.empId,
                "TaxId": model.taxId,
                "PurchaseYear": model.purchaseYear,
                "UnitId": model.unitId,
                "ModelNo": model.modelNo,
                "SerialNo": model.serialNo,
                "VehicleNo": model.vehicleNo,
                "ChesisNo": model.chesisNo,
                "QCApplicable": model.qcApplicable,
                "HSNCode": model.hsnCode,
                "VehicleWeight": model.vehicleWeight,
                "DepreciationRate": model.depreciationRate,
                "CreatedBy": model.createdBy,
                "UpdatedBy": model.updatedBy,
                "VehicleTypeId": model.vehicleTypeId,
                "FuelTypeId": model.fuelTypeId,
                "BrandTypeId": model.brandTypeId,
                "Mileage": model.mileage,
                "VZoneID": model.vZoneId,
                "devid": model.devid,
                "KmPerLitre": model.kmPerLitre,
                "LitrePerHr": model.litrePerHr,
                "ZoneName": model.zoneName,
                "rfid": model.rfid,
                "NTRecord": model.ntRecord,
                "TankCapacity": model.tankCapacity,
                "Rfid2": model.rfid2,
                "FuelAlloted": model.fuelAlloted,
                "SimNo": model.simNo,
                "deptId": model.deptId,
                "DeviceTypeId": model.deviceTypeId,
                "SimType": model.simType,
                "SimCompany": model.simCompany
              }                                    
              ).save(); // save({session})
            // await session.commitTransaction();
            return res.status(StatusCodes.OK).json(new CommonResponse(true, "Successfully Added",savedData));
        } else{
            // now updating
        const entity = await ItemMaster.findOne({ ItemMasterId: model.itemMasterId })
        // .session(session);
        if (!entity){
            const error = new Error("Item not found");
            error.status = StatusCodes.NOT_FOUND;
            return  next(error);
        }
        
        if (entity.VehicleNo !== model.vehicleNo) {
            const vehicleExists = await ItemMaster.findOne({ VehicleNo: model.vehicleNo })
            // .session(session);
            if (vehicleExists) {
                const error = new Error("Vehicle No. Already Exists...!!!!!");
                error.status = StatusCodes.CONFLICT;
                return next(error)
            };
        }

        if (model.simNo && model.simNo !== model.existSimNo) {
            model.simNo = model.simNo.trim();
            let simEntry = await VehicleAddTempInfo.findOne({ SimNo: model.simNo })
            // .session(session);
            
            if (!simEntry) {
                const lastSim = await VehicleAddTempInfo.findOne().sort({ Id: -1 })
                // .session(session);
                let simId = lastSim ? lastSim.Id + 1 : 1;

                const newVehicleAddTempInfo = await new VehicleAddTempInfo({
                    Id: simId,
                    // UpdatedOn: new Date(),
                    CompanyName: model.simCompany,
                    VehicleId: model.itemMasterId,
                    VehicleNo: model.vehicleNo,
                    DeviceType: model.deviceTypeId,
                    DeviceNo: model.devid,
                    OlddeviceNo: entity.devid,
                    EmpMobileNo: model.modelNo || "000",
                    EmpName: "N/A",
                    EmpId: model.empId,
                    ProblemType: "",
                    OldSimNo: entity.SimNo,
                    ServiceEngg: model.seviceEnggCode,
                    SimNo: model.simContactNo,
                    SimType: model.simType,
                    WorkType: model.workType,
                    Replacement: model.replacement,
                    Repair: model.repair,
                    Remark: model.simNoRemark?.trim() || "",
                    CreatedBy: model.createdBy,
                    UpdatedBy: model.updatedBy

                }).save();  // save({session})


                if(!newVehicleAddTempInfo){
                    const error = new Error("Internal issue. Try Again")
                    error.status = StatusCodes.INTERNAL_SERVER_ERROR;
                    return next(error)
                    // res.status(StatusCodes.OK).json({status: "Failed", message: "Internal issue. Try Again",})
                }
            }
            
        }

    

        const updatedItemMaster = await ItemMaster.findOneAndUpdate({ ItemMasterId: model.itemMasterId }, {
            "ItemMasterId": model.itemMasterId,
            "ItemName": model.itemName,
            "ItemCode": model.itemCode,
            "ItemCategoryId": model.itemCategoryId,
            "ItemFlag": model.itemFlag,
            "ItemTypeId": model.itemTypeId,
            "EmpId": model.empId,
            "TaxId": model.taxId,
            "PurchaseYear": model.purchaseYear,
            "UnitId": model.unitId,
            "ModelNo": model.modelNo,
            "SerialNo": model.serialNo,
            "VehicleNo": model.vehicleNo,
            "ChesisNo": model.chesisNo,
            "QCApplicable": model.qcApplicable,
            "HSNCode": model.hsnCode,
            "VehicleWeight": model.vehicleWeight,
            "DepreciationRate": model.depreciationRate,
            "CreatedBy": model.createdBy,
            "UpdatedBy": model.updatedBy,
            "VehicleTypeId": model.vehicleTypeId,
            "FuelTypeId": model.fuelTypeId,
            "BrandTypeId": model.brandTypeId,
            "Mileage": model.mileage,
            "VZoneID": model.vZoneId,
            "devid": model.devid,
            "KmPerLitre": model.kmPerLitre,
            "LitrePerHr": model.litrePerHr,
            "ZoneName": model.zoneName,
            "rfid": model.rfid,
            "NTRecord": model.ntRecord,
            "TankCapacity": model.tankCapacity,
            "Rfid2": model.rfid2,
            "FuelAlloted": model.fuelAlloted,
            "SimNo": model.simNo,
            "deptId": model.deptId,
            "DeviceTypeId": model.deviceTypeId,
            "SimType": model.simType,
            "SimCompany": model.simCompany
        }, {new: true})
        // .session(session);
        // await session.commitTransaction();
        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Successfully Updated", updatedItemMaster));
        }

        
    } catch (err) {
        const error = new Error(err.message)
        error.status = StatusCodes.BAD_REQUEST;
        return next(error)
        // return res.status(StatusCodes.OK).json({ status: "Failed", error: error.message });
    }
}

//--------------GetItemMaster-------->
async function GetItemMaster(req, res, next){

    try {
        const { itemmasterid, vehicleNo } = req.body;
        let query = [];
        if (itemmasterid === -1) {
            query.push(
                {
                    $lookup: {
                        from: "Department",
                        localField: "deptId",
                        foreignField: "DepartmentId",
                        as: "departmentData",
                    },
                },
                {
                    $lookup: {
                        from: "Designation",
                        localField: "desigId",
                        foreignField: "DesignationId",
                        as: "designationData",
                    },
                },
                {
                    $lookup: {
                        from: "vehicletypes",
                        localField: "VehicleTypeId",
                        foreignField: "VehicleTypeId",
                        as: "vehicleTypeData",
                    },
                },
                {
                    $unwind: {
                        path: "$departmentData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$designationData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$vehicleTypeData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // {
                //     $match: {
                //       VehicleNo: {
                //         $regex: vehicleNo,
                //         $options: "i"
                //       }
                //     }
                // },
                {
                    $project: {
                        _id: 0,
                        ItemMasterId: 1,
                        ItemName: { $ifNull: ["$ItemName", ""] },
                        ItemCode: { $ifNull: ["$ItemCode", ""] },
                        ItemTypeId: 1,
                        ItemFlag: 1,
                        ItemCategoryId: 1,
                        UnitId: 1,
                        EmpId: 1,
                        TaxId: 1,
                        PurchaseYear: { $ifNull: ["$PurchaseYear", 0] },
                        ModelNo: { $ifNull: ["$ModelNo", ""] },
                        SerialNo: { $ifNull: ["$SerialNo", ""] },
                        VehicleNo: { $ifNull: ["$VehicleNo", ""] },
                        VZoneID: 1,
                        HSNCode: { $ifNull: ["$HSNCode", ""] },
                        ChesisNo: { $ifNull: ["$ChesisNo", ""] },
                        QCApplicable: { $ifNull: ["$QCApplicable", false] },
                        DepreciationRate: { $ifNull: ["$DepreciationRate", 0] },
                        CreatedBy: 1,
                        UpdatedBy: 1,
                        devid: { $ifNull: ["$Devid", ""] },
                        SimNo: { $ifNull: ["$SimNo", ""] },
                        SimCompany: { $ifNull: ["$SimCompany", ""] },
                        SimType: { $ifNull: ["$SimType", ""] },
                        DeviceTypeId: 1,
                        ZoneName: { $ifNull: ["$ZoneName", ""] },
                        CreatedOn: 1,
                        UpdatedOn: 1,
                        Mileage: { $ifNull: ["$Mileage", 0] },
                        LitrePerHr: { $ifNull: ["$LitrePerHr", 0] },
                        KmPerLitre: { $ifNull: ["$KmPerLitre", 0] },
                        FuelAlloted: { $ifNull: ["$FuelAlloted", 0] },
                        VehicleTypeId: 1,
                        VehicleTypeName: { $ifNull: ["$vehicleTypeData.VehicleTypename", ""] },
                        BrandTypeId: 1,
                        FuelTypeId: 1,
                        NTRecord: 1,
                        VehicleWeight: { $ifNull: ["$VehicleWeight", 0] },
                        deptId: 1,
                        desigId: 1,
                        DepartmentName: { $ifNull: ["$departmentData.DepartmentName", ""] },
                        DesignationName: { $ifNull: ["$designationData.DesignationName", ""] },
                        rfid: { $ifNull: ["$Rfid", ""] },
                        rfid2: { $ifNull: ["$Rfid2", ""] },
                        SpeedLimit: 1,
                        Contractorid: 1,
                    },
                }
            );
        } else {
            query.push({
                $match: {
                    $or: [
                        { ItemMasterId: itemmasterid },
                        { VehicleNo: { $regex: vehicleNo, $options: "i" } },
                    ],
                },
            });
        }

        const result = await ItemMaster.aggregate(query);
       

        const response = result.map((obj) => {
            let newObj = {};
            Object.keys(obj).forEach((key) => {
              let newKey = key.charAt(0).toLowerCase() + key.slice(1);
              newObj[newKey] = obj[key];
            });
            return newObj;
          });
    
        const message = response.length > 0 ? "Data fetched successfully" : "No records found."
        return res.status(StatusCodes.OK).json(new ReturnData(true, false, message, null, response));
    } catch (err) {
        const error = new Error(err.message);
        error.status = StatusCodes.BAD_REQUEST;
        return next(error);
        // return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
    }
}

//--------------DeleteItemMaster-------->
async function DeleteItemMaster(req, res, next){
    try {
    const { itemMasterId } = req.body;
        // const response = { status: "Failed", message: "" };

        // Check if ItemMasterId exists in ContractorMaster
        const cam = await ContractorMaster.findOne({ ItemId: itemMasterId });

        if (cam) {
            const error = new Error("Item Id is used in ContractorMaster, so it can't be deleted.")
            error.status = StatusCodes.CONFLICT;
            return next(error)
            // response.message = "Item Id is used in ContractorMaster, so it can't be deleted.";

            // return res.status(StatusCodes.CONFLICT).json(response);
        }

        if (itemMasterId || itemMasterId === 0) {
            // Check if the item exists in ItemMasters
            const entity = await ItemMaster.findOne({ ItemMasterId: itemMasterId });

            if (entity && entity.NTRecord && entity.NTRecord.toLowerCase() === "y") {
                const error = new Error("Vehicle Movement found, cannot be deleted.");
                error.status = StatusCodes.CONFLICT;
                return next(error); 
                // throw new Error("Vehicle Movement found, cannot be deleted.");
            }

            // Perform the delete operation
            const deleteResult = await ItemMaster.deleteOne({ ItemMasterId: itemMasterId });

            if (deleteResult.deletedCount === 1) {
                return res.status(StatusCodes.OK).json(new ReturnData(true ,true, "Successfully Deleted", false, null))
               
            } else {
                const error = new Error("ItemMaster not found.");
                error.status = StatusCodes.NOT_FOUND;
                return next(error);
                
            }
        }
    } catch (err) {
        const error = new Error(err.message);
        error.status = StatusCodes.BAD_REQUEST
        return next(error);
        // res.message = error.message || "An error occurred during deletion.";
    }

}



export { AddUpdateItemMaster, GetItemMaster, DeleteItemMaster };