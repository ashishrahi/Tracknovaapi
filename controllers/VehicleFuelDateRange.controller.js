async function VehicleFuelDateRange(req, res,next){
    const filter = req.body;
    try {
        const d1 = new Date(filter.date1);
        const d2 = new Date(filter.date2);
    
        const vehicles = filter.Flag ? [] : filter.list1?.map(v => v.trim()).filter(v => v);
        const vehicleTypes = filter.Flag ? [] : filter.listInt1;
    
        const query = { TrackDate: { $gte: d1, $lte: d2 } };

        if (vehicles.length > 0) {
          query.VehicleNo = { $in: vehicles };
        }
        
        if (vehicleTypes.length > 0) {
          query.VehicleType = { $in: vehicleTypes };
        }
    
        const trackDetails = await db.collection("TrackDetails").aggregate([
          { $match: query },
          {
            $lookup: {
              from: "ItemMaster",
              localField: "VehicleNo",
              foreignField: "VehicleNo",
              as: "vehicleInfo",
            },
          },
          {
            $addFields: {
              VehicleName: { $arrayElemAt: ["$vehicleInfo.ItemName", 0] },
            },
          },
          {
            $project: {
              _id: 0,
              TrackDate: 1,
              VehicleNo: 1,
              DevId: 1,
              DriverName: 1,
              MobileNo: 1,
              Department: 1,
              VehicleType: 1,
              DistanceKM: 1,
              Running: 1,
              Idle: 1,
              StartTime: 1,
              EndTime: 1,
              StartLoc: 1,
              EndLoc: 1,
              FuelConsumption: 1,
              FuelAlloted: { $ifNull: ["$FuelAlloted", "0"] },
              OpeningBalance: { $ifNull: ["$OpeningBalance", "0"] },
              StopTime: 1,
              ModelNo: 1,
              KmPerLitre: 1,
              LitrePerHr: 1,
              AvgSpeed: 1,
              MaxSpeed: 1,
              RunningIdleTime: 1,
              FuelBalance: 1,
              VehicleName: 1,
            },
          },
          {
            $group: {
              _id: "$VehicleNo",
              VehicleNo: { $first: "$VehicleNo" },
              VehicleName: { $first: "$VehicleName" },
              TrackDate: { $first: "$TrackDate" },
              FuelAlloted: { $sum: { $toDouble: "$FuelAlloted" } },
              LitrePerHr: { $first: "$LitrePerHr" },
              KmPerLitre: { $first: "$KmPerLitre" },
              RunTimeinSec: { $sum: { $toDouble: "$RunningIdleTime" } },
              TotDays: { $sum: 1 },
            },
          },
          { $sort: { TrackDate: -1 } },
        ]).toArray();
    
        return trackDetails;
      } catch (error) {
        console.error("Error fetching vehicle fuel data:", error);
        throw new Error("Database query failed");
      }
}

export { VehicleFuelDateRange }