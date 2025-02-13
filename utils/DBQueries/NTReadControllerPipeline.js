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
          distance: Number(record.distance),
          Lattitude: Number(record.Lattitude),
          Longitude: Number(record.Longitude),
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
          nt.KmPerLitre = Number(vehicle.KmPerLitre);
          nt.LitrePerHr = Number(vehicle.LitrePerHr);
    
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


async function NTCurrentPipeline(devids){
  // const devids = devs; 
  if(!devids) devids = null;
    const latestRecords = await NTCurrentDay.aggregate([
      {
          $match: devids ? { devid: { $in: devids } } : {} // Filter if devids provided
      },
      {
          $sort: { TrackTime: -1 } // Sort by TrackTime descending
      },
      {
          $group: {
              _id: "$devid",
              latest: { $first: "$$ROOT" } // Get the latest record per device
          }
      },
      {
          $replaceRoot: { newRoot: "$latest" } // Flatten the result
      }
    ])
    
      // Step 2: Extract Unique Device IDs
      const devidsNt = latestRecords.map(d => d.devid);
      
  // return res.json({devidsNt : devidsNt});
       // Step 3: Perform Joins (Lookups)
       const result = await ItemMaster.aggregate([
        {
            $match: { devid: { $in: devidsNt } } // Match only relevant devices
        },
        {
            $lookup: {
                from: "VehicleTypeMaster",
                localField: "VehicleTypeId",
                foreignField: "VehicleTypeId",
                as: "vehicleType"
            }
        },
        { $unwind: { path: "$vehicleType", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "EmpMaster",
                // localField: "EmpDeptId",
                localField: "EmpId",
                foreignField: "Empid",
                as: "employee"
            }
        },
        { $unwind: { path: "$employee", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "Department",
                localField: "employee.EmpDeptId",
                foreignField: "DepartmentId",
                as: "department"
            }
        },
        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                ItemMasterId: 1,
                ItemName: 1,
                KmPerLitre: 1,
                LitrePerHr: 1,
                VehicleNo: 1,
                DepartmentName: "$department.DepartmentName",
                EmpDeptId: "$employee.EmpDeptId",
                EmpName: "$employee.EmpName",
                devid: 1,
                VehicleTypeId: 1,
                VehicleTypename: "$vehicleType.VehicleTypename"
            }
        }
      ]);
  
      // Step 4: Map Latest Records to Vehicle Data
      const vehicleMap = new Map(result.map(v => [v.devid, v]));
      const ntSummary = latestRecords.map(d => {
          const vehicle = vehicleMap.get(d.devid) || {};
          return {
              id: d._id,
              tracktime: d.TrackTime,
              trackdate: d.TrackDate,
              speed: d.speed,
              Lattitude: Number(d.Lattitude),
              Longitude: Number(d.Longitude),
              nearme: d.nearme,
              devid: d.devid,
              distance: Number( d.distance),
              Ignition: d.acc ? "On" : "Off",
              Flag: !d.acc && d.speed === 0 ? "Stopped" : d.acc && d.speed > 0 ? "Running" : "Idle",
              vehicleno: vehicle.VehicleNo || "",
              Departmentname: vehicle.DepartmentName || "",
              EmpName: vehicle.EmpName || "",
              KmPerLitre: Number(vehicle?.KmPerLitre) || "",
              LitrePerHr: Number(vehicle?.LitrePerHr) || "",
              VehicleTypeId: vehicle.VehicleTypeId || "",
              VehicleTypename: vehicle.VehicleTypename || ""
          };
      });
      // console.log("ntSummary", ntSummary)
      return  ntSummary;
}

export { GetNTDashboardPipeline, NTCurrentPipeline };