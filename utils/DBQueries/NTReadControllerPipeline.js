import  { NTCurrentDay, ItemMaster, VehicleTypeMaster} from "../../modals/index.js"

async function GetNTDashboardPipeline(){
    const groupedData = await NTCurrentDay.aggregate([
        {
          $sort: { TrackTime: -1 }, // Sort by TrackTime descending
        },
        {
          $group: {
            _id: "$devid",
            latestRecord: { $first: "$$ROOT" }, // Take the first document after sorting
          },
        },
      ]);
      const deviceIds = groupedData.map((d) => d._id);
    
      const vehicles = await ItemMaster.aggregate([
        {
          $lookup: {
            from: "EmpMaster",
            localField: "EmpId",
            foreignField: "Empid",
            as: "empData",
          },
        },
        { $unwind: { path: "$empData", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "Department",
            localField: "empData.EmpDeptId",
            foreignField: "DepartmentId",
            as: "departmentData",
          },
        },
        { $unwind: { path: "$departmentData", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "ZoneMaster",
            localField: "VZoneID",
            foreignField: "ZoneID",
            as: "zoneData",
          },
        },
        { $unwind: { path: "$zoneData", preserveNullAndEmptyArrays: true } },
        {
          $match: {
            devid: { $in: deviceIds },
          },
        },
        {
          $project: {
            ItemName: 1,
            KmPerLitre: 1,
            LitrePerHr: 1,
            VehicleNo: 1,
            DepartmentName: { $ifNull: ["$departmentData.DepartmentName", "N/A"] },
            EmpDeptId: "$empData.EmpDeptId",
            EmpName: "$empData.EmpName",
            EmpMobileNo: "$empData.EmpMobileNo",
            VZoneID: 1,
            ZoneName: { $ifNull: ["$zoneData.ZoneName", "N/A"] },
            devid: 1,
            VehicleTypeId: 1,
            EmpId: 1,
            ItemMasterId: 1,
            PurchaseYear: 1,
            ModelNo: 1,
            SerialNo: 1,
            ChesisNo: 1,
            HSNCode: 1,
            VehicleWeight: 1,
            Mileage: 1,
          },
        },
      ]);
      const vehicleTypes = await VehicleTypeMaster.aggregate([
        {
          $lookup: {
            from: "VehicleTypeChild",
            localField: "VehicleTypeId",
            foreignField: "VehicleTypeId",
            as: "typeInfo",
          },
        },
        { $unwind: { path: "$typeInfo", preserveNullAndEmptyArrays: true } },
      ]);
      // Step 4: Combine data into the final NT list
      const ntList = [];
      let sn = 1;
    
      for (const group of groupedData) {
        const record = group.latestRecord;
        // console.log(record)
    
        const nt = {
          Srno: sn++,
          devid: record.devid,
          acc: record.acc,
          speed: record.speed,
          TrackTime: record.TrackTime,
          SecondsRun: record.SecondsRun,
          SecondsIdle: record.SecondsIdle,
          distance: record.distance,
          Lattitude: record.Lattitude,
          Longitude: record.Longitude,
          nearme: record.nearme,
          flag:
            record.acc && record.speed > 0
              ? "Running"
              : record.acc
              ? "Idle"
              : "Stopped",
          Ignition: record.acc ? "On" : "Off",
          IdleTime: `${Math.floor(record.SecondsIdle / 3600)} Hr ${Math.floor(
            (record.SecondsIdle % 3600) / 60
          )} Min ${record.SecondsIdle % 60} Sec`,
        };
        // console.log("nt" ,nt);
    
        const vehicle = vehicles.find((v) => v.devid === nt.devid);
    
        //  console.log("vehicle", vehicles);
    
        if (vehicle) {
          nt.VehicleNo = vehicle.VehicleNo;
          nt.ZoneName = vehicle.ZoneName;
          nt.DepartmentName = vehicle.DepartmentName;
          nt.EmpMobileNo = vehicle.EmpMobileNo;
          nt.EmpName = vehicle.EmpName;
          nt.VehicleTypeId = vehicle.VehicleTypeId;
          nt.KmPerLitre = vehicle.KmPerLitre;
          nt.LitrePerHr = vehicle.LitrePerHr;
    
          const vehicleTypeData = vehicleTypes.find(
            (vt) => vt.VehicleTypeId === vehicle.VehicleTypeId
          );
          if (vehicleTypeData) {
            nt.VehicleTypename = vehicleTypeData.VehicleTypename;
    
            // Fuel calculation
            if (vehicle.KmPerLitre && vehicle.KmPerLitre > 0) {
              nt.Fuel = nt.distance / vehicle.KmPerLitre;
            }
            if (vehicle.LitrePerHr && vehicle.LitrePerHr > 0) {
              nt.Fuel =
                ((nt.SecondsIdle + nt.SecondsRun) / 3600) * vehicle.LitrePerHr;
            }
          }
        }
    
        ntList.push(nt);
    }

    return ntList;
}


export { GetNTDashboardPipeline };