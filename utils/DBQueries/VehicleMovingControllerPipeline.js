
import { SummaryNT } from "../../modals/index.js";

async function getVehicleTrack(trackFilter) {
  try {

    console.log("trackFilter", trackFilter)
    
    let results = await SummaryNT.find(trackFilter);
   
    // Process records similar to SQL updates
    results = results.map((doc) => {
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

export { getVehicleTrack };
