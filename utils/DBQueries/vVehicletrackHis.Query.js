// import {
//   ZoneMaster,
//   BinLocation,
//   AreaWardMaster,
//   ItemMaster,
//   NT,
// } from "../../modals/index.js";
// import { StatusCodes } from "http-status-codes";
import formattedData from "../dotnet-like-format/dotnetLikeData.js";
// import mongoose from "mongoose";
import { getTenantDBModels } from "../../db/index.js";
/////////////////////////////////////////// GetvVehicletrackHisQuery //////////////////////////////////////////

export const GetvVehicletrackHisQuery = async (modal) => {

  try {
    const { ItemMaster, tenant_db, EmpMaster} = await getTenantDBModels();

    const { where: vehicleNo, str4: trackDate } = modal;

    // console.log('modal:',modal)

    // Find device ID based on vehicle number
    const device = await ItemMaster.findOne(
      { VehicleNo: vehicleNo },
      { projection: { devid: 1 } }
    );
    // console.log('device:',device)

    if (!device || !device.devid) {
      return {
        status: 0,
        message: "Device not found for the given vehicle",
      };
    }

    const Devid = device.devid.toString();


    // Convert trackDate to start and end range
    const startDate = new Date(trackDate);
    const endDate = new Date(trackDate);
    endDate.setDate(endDate.getDate() + 1);
    // console.log('Devid', Devid)
    // console.log('startDate', startDate)
    // console.log('endDate', endDate)
    // Fetch all collections that start with 'evts_'
    const collections = await tenant_db.connection.db.listCollections().toArray();

    const relevantCollections = collections
      .map((col) => col.name)
      .filter((name) => name);


    // console.log('relevantCollections',relevantCollections)
    let aggregatedData = [];

    for (const collectionName of relevantCollections) {
      const collection = tenant_db.connection.db.collection(collectionName);

      const data = await collection
        .aggregate([
          {
            $match: {
              devid: Devid,
              TrackTime: { $gte: startDate, $lt: endDate }
            }
          },
          {
            $project: {
              TrackTime: 1,
              Longitude: { $toDouble: "$Longitude" },  // Convert to decimal
              Lattitude: { $toDouble: "$Lattitude" },  // Convert to decimal
              speed: 1,
              devid: 1,
              distance: { $toDouble: "$distance" },    // Convert to decimal
              Flag: 1,
              Id: 1
            }
          }
        ])
        .toArray();

      aggregatedData.push(...data);
    }


    // Fetch vehicle details from ItemMaster
    const itemMasterMap = await tenant_db.connection.db
      .collection("ItemMaster")
      .find({}, { projection: { devid: 1, VehicleNo: 1, EmpId: 1 } })
      .toArray()
      .then((items) =>
        items.reduce((acc, item) => {
          acc[item.devid] = { VehicleNo: item.VehicleNo || "", EmpId: item.EmpId || "" };
          return acc;
        }, {})
      );

    // console.log("itemMasterMap:",itemMasterMap)

    // Fetch employee details from EmpMaster
    const empMasterMap = await EmpMaster
      .find({}, { projection: { Empid: 1, EmpName: 1, EmpMobileNo: 1 } })
      .toArray()
      .then((emps) =>
        emps.reduce((acc, emp) => {
          acc[emp.Empid] = { EmpName: emp.EmpName || "", EmpMobileNo: emp.EmpMobileNo || "" };
          return acc;
        }, {})
      );

    // console.log('empMaster:',empMasterMap)
    // Merge data
    aggregatedData = aggregatedData.map((record) => {
      const itemData = itemMasterMap[record.devid] || {};
      const empData = empMasterMap[itemData.EmpId] || {};


      return {
        ...record,
        VehicleNo: itemData.VehicleNo || "",
        Empid: itemData.EmpId || "",
        EmpName: empData.EmpName || "",
        EmpMobileNo: empData.EmpMobileNo || "",
      };
    });

    // Sort results by ID
    aggregatedData.sort((a, b) => a.Id - b.Id);

    return {
      status: 1,
      message: "Vehicle history data fetched successfully",
      data: formattedData(aggregatedData),
    };
  } catch (error) {
    console.error("Error fetching vehicle track history:", error);
    return {
      status: 0,
      message: error.message,
    };
  }
};
