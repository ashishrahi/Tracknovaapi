import { getTenantDBModels } from "../../db/index.js";


async function trackDetailsNT(trackFilter) {
  try {

   const { SummaryNT, } = await getTenantDBModels()
    console.log("trackFilter", trackFilter)
    
    let results = await SummaryNT.find(trackFilter).lean();
    console.log("results", results.slice(0,3))
   
    // Process records similar to SQL updates
    results = results?.map((doc) => {
      if (doc.StartLoc === "demo") doc.StartLoc = "";
      if (doc.EndLoc === "demo") doc.EndLoc = "";
      if (doc.DistanceKM === 0 && doc.RunningTime === 0 && doc.IdleTime === 0) {
        doc.StartTime = "";
        doc.EndTime = "";
      }
      doc.FuelBalance = (doc.FuelAlloted || 0) - (doc.FuelConsumption || 0);

     return doc;
    });

    return results;
  } catch (error) {
    throw new Error(error.message)
  }
}

async function VehicleMovingStatusdetnew(body){
    const response = { Status: 'Failed', Message: '', Data: [] };
    
        try {
            const { ItemMaster, } = await getTenantDBModels()

            const filter = body;
            
    
            // Convert dates to MongoDB-compatible format
            const startDate = new Date(filter.date1)
            const endDate = new Date(filter.date2)
    // console.log("startDate:",startDate)
    // console.log("endDate:",endDate)
            // Step 1: Filter vehicles based on input criteria
            let vehicleFilter = { ItemFlag: 'V' }; // Assuming 'v' indicates vehicles
            if (filter.str1) {
                vehicleFilter.VehicleNo = filter.str1; // Filter by vehicle number
            }
            if (filter.intnotnullvalue1 > 0) {
                vehicleFilter.EmpId = filter.intnotnullvalue1; // Filter by employee ID
            }
            if (filter.intnotnullvalue2 > 0) {
                vehicleFilter.VehicleTypeId = filter.intnotnullvalue2; // Filter by vehicle type ID
            }
    
            // Fetch relevant vehicles
            const vehicles = await ItemMaster.find(vehicleFilter).lean();

            // console.log('vehicles:',vehicles)
            // return res.json({vehicles})
            const devIds = vehicles.map(v => v.devid).filter(devid => devid); // Extract DevIds
            // console.log("devIds", devIds);
    
            // Step 2: Fetch track details for the filtered vehicles within the date range
            const trackFilter = {
                DevID:  { "$in": devIds }  , // Filter by DevIds
                TrackDate: { "$gte" : startDate, "$lte": endDate }
            };

            // console.log('trackFilter:',trackFilter)

            // Add additional filters if provided
            if (filter.list1 && filter.list1.length > 0) {
                trackFilter.VehicleNo = { "$in": filter.list1 } ; // Filter by vehicle numbers
            }
            if (filter.listInt1 && filter.listInt1.length > 0) {
                trackFilter.VehicleTypeID = { "$in": filter.listInt1 } ; // Filter by vehicle type IDs
            }
    
            const trackDetails = await trackDetailsNT(trackFilter); 
            // console.log("trackDetails", trackDetails)
            // Step 3: Transform track details into the desired format

            // console.log('trackDetails:',trackDetails)
          

            const transformedData = trackDetails.map(track => {
                const runningTime = track.Running ? track.Running.split(/[\s:]+/) : [0, 0, 0];
                const runningInSec = (parseInt(runningTime[0]) * 3600) + (parseInt(runningTime[1]) * 60) + parseInt(runningTime[2]);
    
                return {
                    TrackDate: track.TrackDate,
                    VehicleNo: track.VehicleNo || 'NA',
                    DevId: track.DevID,
                    DriverName: track.DriverName,
                    MobileNo: track.MobileNo,
                    Department: track.Department,
                    VehicleType: track.VehicleType || 'NA',
                    DistanceKM: String(track.DistanceKM) || 0,
                    Running: track.Running,
                    hr: parseInt(runningTime[0]),
                    min: parseInt(runningTime[1]),
                    sec: parseInt(runningTime[2]),
                    runninginsec: runningInSec,
                    Idle: track.Idle,
                    StartTime: track.StartTime,
                    EndTime: track.EndTime,
                    StartLoc: track.StartLoc,
                    EndLoc: track.EndLoc,
                    FuelConsumption: track.FuelConsumption || '0.00',
                    FuelAlloted: track.FuelAlloted || '0.00',
                    OpeningBalance: track.OpeningBalance || '0',
                    StopTime: track.StopTime,
                    ModelNo: track.ModelNo || 'NA',
                    KmPerLitre: parseInt(track.KmPerLitre) || 0,
                    LitrePerHr: parseInt(track.LitrePerHr) || 0,
                    AvgSpeed: parseInt(track.AvgSpeed) || 0,
                    MaxSpeed: parseInt(track.MaxSpeed) || 0,
                    RunningIdleTime: parseInt(track.RunningIdleTime),
                    DriverMob: `${track.DriverName}\nMobile:[${track.MobileNo}]`,
                    DepartVtype: `${track.Department}\nVehicleType:[${track.VehicleType}]`,
                    VehicleDev: `${track.VehicleNo}\nDeviceId:[${track.DevId}]`,
                };
            });
    
            // Step 4: Apply additional filtering based on Condition2 and intvalue4
            if (filter.Condition2 && filter.intvalue4 > 0) {
                const vehicleCounts = {};
                transformedData.forEach(track => {
                    vehicleCounts[track.VehicleNo] = (vehicleCounts[track.VehicleNo] || 0) + 1;
                });
    
                const filteredData = transformedData.filter(track => vehicleCounts[track.VehicleNo] <= filter.intvalue4);
               
               
                response.Data = filteredData;
            } else {
                response.Data = transformedData;
            }
            response.Status = 'Success';
            response.Message = 'Data retrieved successfully';
           return response;
        } catch(err) {
            throw new Error(err.message);
        }
}

export { trackDetailsNT, VehicleMovingStatusdetnew };
