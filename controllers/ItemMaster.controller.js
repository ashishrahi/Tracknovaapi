import { StatusCodes } from "http-status-codes";
import { ItemMaster, VehicleAddTempInfo } from "../modals/index.js";

async function AddUpdateItemMaster(req, res){
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
        const model = req.body;
        // let vNo = model.EScarp ? model.VehicleNo : "";
        let vNo =  model.vNoehicleNo;
        // let isNew = !model.ItemMasterId;

        if (model.itemMasterId === 0) {
            const existingVehicle = await ItemMaster.findOne({ VehicleNo: model.vehicleNo })
            // .session(session);
            if (existingVehicle) throw new Error("Vehicle No Already Exists...!!!!!");
            
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
            return res.status(StatusCodes.OK).json({ status: "Success", message: "Successfully Added", data: savedData });
        } else{
            // now updating
        const entity = await ItemMaster.findOne({ ItemMasterId: model.itemMasterId })
        // .session(session);
        if (!entity) throw new Error("Item not found");
        
        if (entity.VehicleNo !== model.vehicleNo) {
            const vehicleExists = await ItemMaster.findOne({ VehicleNo: model.vehicleNo })
            // .session(session);
            if (vehicleExists) throw new Error("Vehicle No. Already Exists...!!!!!");
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
                    CreatedBy: model.createdBy,
                    // CreatedOn: new Date(),
                    UpdatedBy: model.updatedBy,
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
                    UpdatedBy: model.UpdatedBy

                }).save();  // save({session})


                if(!newVehicleAddTempInfo){
                    return res.status(StatusCodes.OK).json({status: "Failed", message: "Internal issue. Try Again",})
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
        return res.status(StatusCodes.OK).json({ status: "Success", message: "Successfully Updated", data: updatedItemMaster });
        }

        
    } catch (error) {
        // await session.abortTransaction();
        return res.status(StatusCodes.OK).json({ status: "Failed", error: error.message });
    }
}

export { AddUpdateItemMaster };