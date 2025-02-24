import formattedData from "../dotnet-like-format/dotnetLikeData.js";
//----------------------- All Modals ------------------------->

import { NTCurrentDay, ItemMaster,BinLocation,AreaWardMaster } from "../../modals/index.js";


//----------------------- Dashboard_Query ------------------------->



//----------------------- Aggregations for GetDashboardQuery ------------------------->


export const getDashboardQuery = async (CurDate) => {

  const summaryNTDash = {
    TrackDate: CurDate,
    IgnitionStatus: '',
    ZoneVehicleStatus: '',
    Running: '',
    Idle: '',
    Stop: '',
    TotalVehicle: '',
    TotalVehicleRunning: '',
    GPSStatus: ''
  };

  // Ignition status query
  const ignitionStatusResult = await NTCurrentDay.aggregate([
    { $match: { TrackTime: { $gt: CurDate } } },
    { $group: { _id: "$acc", count: { $sum: 1 } } }
  ]).exec();
  summaryNTDash.IgnitionStatus = ignitionStatusResult.map(r => `${r._id}~${r.count}`).join(', ');

  // Zone vehicle status query
  const zoneDeviceIds = await NTCurrentDay.distinct('devid', { TrackTime: { $gt: CurDate } });
  const zoneVehicleStatusResult = await ItemMaster.aggregate([
    { $match: { devid: { $in: zoneDeviceIds } } },
    { $group: { _id: "$ZoneName", count: { $sum: 1 } } }
  ]).exec();
  summaryNTDash.ZoneVehicleStatus = zoneVehicleStatusResult.map(r => `${r._id}~${r.count}`).join(', ');

  // Running, Idle, Stop vehicle counts using $facet
  const vehicleCounts = await NTCurrentDay.aggregate([
    { $match: { TrackTime: { $gt: CurDate } } },
    { $facet: {
      running: [
        { $match: { acc: true, speedDecimal: { $gt: 0 } } },
        { $count: "count" }
      ],
      idle: [
        { $match: { acc: true, speedDecimal: 0 } },
        { $count: "count" }
      ],
      stop: [
        { $match: { acc: false, speedDecimal: 0 } },
        { $count: "count" }
      ]
    } }
  ]).exec();

  summaryNTDash.Running = vehicleCounts[0]?.running[0]?.count || '0';
  summaryNTDash.Idle = vehicleCounts[0]?.idle[0]?.count || '0';
  summaryNTDash.Stop = vehicleCounts[0]?.stop[0]?.count || '0';

  // Total vehicle count
  const totalVehicleCount = await ItemMaster.countDocuments({ ItemFlag: 'V' });
  summaryNTDash.TotalVehicle = totalVehicleCount.toString();

  // Total running vehicle count
  const totalVehicleRunningCount = await NTCurrentDay.distinct('devid', { TrackTime: { $gt: CurDate } });
  summaryNTDash.TotalVehicleRunning = totalVehicleRunningCount.length.toString();

  // GPS status count
  const gpsStatusCount = await ItemMaster.countDocuments({ ItemFlag: 'V', devid: { $ne: null } });
  summaryNTDash.GPSStatus = gpsStatusCount.toString();

  return summaryNTDash;
};


//----------------------- Aggregations for getVehicleDayQuery ------------------------->

export const getVehicleQuery = async (vehicleNo) => {
  try {
    const data = await NTCurrentDay.aggregate([
      {
        $lookup: {
          from: 'ItemMaster',
          localField: 'devid',
          foreignField: 'devid',
          as: 'itemMasterDetails'
        }
      },
      {
        $unwind: '$itemMasterDetails'
      },
      {
        $match: {
          'itemMasterDetails.VehicleNo': vehicleNo
        }
      },
      {
        $project: {
          "_id": 0,
          id: 1,
          "vehicleNo": '$itemMasterDetails.VehicleNo',
          "departmentname": '$itemMasterDetails.Departmentname',
          "empName": '$itemMasterDetails.empName',
          "ignition": '$itemMasterDetails.ignition',
          "zoneName": '$itemMasterDetails.ZoneName',
          "vehicleTypename": '$itemMasterDetails.VehicleTypename',
          "zoneid": '$itemMasterDetails.Zoneid',
          distance: { $toDouble: '$Longitude' },
          "trackTime": "$TrackTime",
          longitude: { $toDouble: '$Longitude' }, 
          lattitude: { $toDouble: '$Lattitude' },
          speed: 1,
          devid: 1,
          "binVisited": "$BinVisited",
          acc: 1,
          pos: 1,
          overspeed: 1,
          "stateInfo": "$StateInfo",
          nearme: 1,
          "secondsRun": "$SecondsRun",
          speedDecimal: { $toDouble: '$speedDecimal' },
          currtime1: 1,
          description: 1,
          "areaId": "$AreaId",
          "secondsIdle": "$SecondsIdle",
          "secondsStop": "$SecondsStop",
          "secondsrunv": "$Secondsrunv",
          "flag": "$Flag",
          "nTId": "$NTId",
          "trackDate": "$TrackDate"
        }
      },
      { $sort: { trackTime: 1 } }
    ]);

    let retDat = [];
    let start = true;
    let distance = 0;
    for (let item of data) {
      if (start) {
        distance = item.distance;
        retDat.push(item);
        start = false;
        continue;
      }
      if ((item.distance - distance) >= 0.5) {
        distance = item.distance;
        retDat.push(item);
      }
    }

    return retDat;
  } catch (error) {
    throw new Error(error.message);
  }
};


//----------------------- BinLocationQuery ------------------------->


// binQueries.js
export const BinLocationQuery = async (flag) => {
  try {
    let queryResult;
    let newData;

    if (flag === 'false') {
      queryResult = await BinLocation.find(
        { Latitude: { $ne: null }, Longitude: { $ne: null } },
        {
          ZoneName: 1,
          AreaName: 1,
          BinLocID: 1,
          BinLocName: 1,
          BinLocCode: 1,
          ZoneID: 1,
          AreaID: 1,
          RFID: 1,
          Longitude: { $toDouble: '$Longitude' }, 
          Latitude: { $toDouble: '$Latitude' },
          LocationName: 1,
        }
      );
    } else {
      queryResult = await BinLocation.find(
        { Latitude: { $ne: null }, Longitude: { $ne: null } },
        {} // Include all fields by leaving projection empty
      ).lean();
      newData  = formattedData(queryResult)
    }

    return newData;
  } catch (error) {
    throw new Error(error.message);
  }};


//----------------------- getBinsByWardNumberQuery ------------------------->


  export const BinsByWardNumberQuery = async (wardNumber) => {
    try {
      let newData;
      const binLocations = await BinLocation.find({
        'AreaWardMaster.WardNumber': wardNumber,
      }).populate('AreaWardMaster');
  console.log("binLocations:",binLocations)


        newData = formattedData(binLocations)
      return newData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

