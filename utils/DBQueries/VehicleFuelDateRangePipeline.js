async function VehicleFuelDateRange(filter){
    try {
      const { date1, date2, list1, listInt1, Flag } = filter;
  debugger;
      // Convert dates
      const d1 = new Date(date1);
      const d2 = new Date(date2);
  
      let vehicleNumbers = [];
      let vehicleTypes = [];
  
      // Process vehicle numbers
      if (!Flag) {
          vehicleNumbers = list1.filter(veh => veh.trim() !== "").map(veh => veh.trim());
      }
  
      // Process vehicle types
      if (!Flag) {
          vehicleTypes = listInt1;
      }
  
      // Fetch vehicle tracking details from MongoDB


      const vehicleTracks = await VehicleTrack.find({
          trackDate: { $gte: d1, $lte: d2 },
          vehicleNo: { $in: vehicleNumbers },
          vehicleType: { $in: vehicleTypes },
      });
  
      
      
      
      
      
      
      // Fetch vehicle names from ItemMaster collection
      const itemMasterData = await ItemMaster.find({ itemFlag: "V" });
  
      // Map vehicle names to tracking details
      const processedTracks = vehicleTracks.map(track => {
          const matchingItem = itemMasterData.find(item => item.vehicleNo === track.vehicleNo);
          return {
              ...track._doc,
              VehicleName: matchingItem ? matchingItem.itemName || "" : "",
              RunTimeinSec: convertToSeconds(track.RunningIdleTime),
          };
      });
  
      // Aggregate vehicle tracking details
      let aggregatedTracks = [];
      processedTracks.forEach(track => {
          let existingVehicle = aggregatedTracks.find(v => v.VehicleNo === track.VehicleNo);
          if (!existingVehicle) {
              aggregatedTracks.push({
                  VehicleNo: track.VehicleNo,
                  VehicleName: track.VehicleName,
                  TrackDate: track.TrackDate,
                  FuelAlloted: track.FuelAlloted,
                  LitrePerHr: track.LitrePerHr,
                  KmPerLitre: track.KmPerLitre,
                  RunTimeinSec: track.RunTimeinSec,
              });
          }
      });
  
      // Calculate additional metrics
      aggregatedTracks = aggregatedTracks.map(veh => {
          const vehicleData = processedTracks.filter(v => v.VehicleNo === veh.VehicleNo);
  
          veh.TotDays = vehicleData.length;
          veh.TotFuelAllot = vehicleData.reduce((sum, v) => sum + (parseFloat(v.FuelAlloted) || 0), 0);
          veh.FuelConsumption = vehicleData.reduce((sum, v) => sum + (parseFloat(v.FuelConsumption) || 0), 0).toFixed(2);
          veh.BalanceFuel = veh.TotFuelAllot - parseFloat(veh.FuelConsumption || 0);
          veh.ActualDistance = vehicleData.reduce((sum, v) => sum + (parseFloat(v.DistanceKM) || 0), 0);
          veh.RunTimeinSec = vehicleData.reduce((sum, v) => sum + (parseFloat(v.RunTimeinSec) || 0), 0);
  
          return veh;
      });
  
      res.json({ success: true, data: aggregatedTracks });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
  }
  
  // Convert H:M:S format to seconds
  const convertToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(/[: ]+/);
  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }
  
  export { VehicleFuelDateRange }