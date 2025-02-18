import { trackDetailsNT } from '../../utils/DBQueries/VehicleMovingControllerPipeline.js';
import { ItemMaster } from '../../modals/index.js';
import moment from 'moment';

async function VehicleFuelDateRange(filter) {
  try {
    const retd = [];

    // Date handling (same as before)
    const d1 = new Date(filter.date1);
    const d2 = new Date(filter.date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(23, 59, 59, 999);

    // Build query conditions (same as before)
    const queryConditions = {
      TrackDate: { $gte: d1, $lte: d2 }
    };

    if (!filter.Flag) {
      if (filter.list1 && filter.list1.length) {
        queryConditions.VehicleNo = {
          $in: filter.list1.map(v => v.trim()).filter(v => v)
        };
      }
      if (filter.listInt1 && filter.listInt1.length) {
        queryConditions.VehicleType = { $in: filter.listInt1 };
      }
    }

    // Fetch track details (same as before)
    const lisret1 = await trackDetailsNT(queryConditions);
    // console.log('lisret1:', lisret1); // Debug: Check if track details are fetched correctly.

    // Get vehicle information (same as before)
    const vehitm = await ItemMaster.find({ ItemFlag: 'V' }).lean();
    // console.log('ItemMaster:', vehitm); // Debug: Check if vehicle info is fetched correctly.

    // Enrich with vehicle names (same as before)
    lisret1.forEach(item => {
      const vehicle = vehitm.find(v => v.VehicleNo === item.VehicleNo);
      item.vehicleName = vehicle ? vehicle.ItemName : '';
    });

    // Process vehicle aggregates using object grouping
    const parseDecimal128 = (value) => {
      if (typeof value === "object" && value !== null && "$numberDecimal" in value) {
        return parseFloat(value.$numberDecimal);
      }
      return value;
    };

    const vehicleGroups = {};

    lisret1.forEach(item => {
      const vehicleNo = item.VehicleNo;

      if (!vehicleGroups[vehicleNo]) {
        vehicleGroups[vehicleNo] = {
          VehicleNo: vehicleNo,
          VehicleName: item.vehicleName,
          TrackDate: item.TrackDate,
          FuelAlloted: parseFloat(item.FuelAlloted) || 0,
          LitrePerHr: parseFloat(item.LitrePerHr),
          KmPerLitre: parseFloat(item.KmPerLitre),
          AvgSpeed: parseFloat(item.AvgSpeed),
          MaxSpeed: parseFloat(item.MaxSpeed),
          DistanceKM: parseFloat(item.DistanceKM),
          FuelBalance: parseFloat(item.FuelBalance) || 0,
          Details: []
        };
      }

      vehicleGroups[vehicleNo].Details.push({
        ...item,
        LitrePerHr: parseFloat(item.LitrePerHr),
        KmPerLitre: parseFloat(item.KmPerLitre),
        AvgSpeed: parseFloat(item.AvgSpeed),
        MaxSpeed: parseFloat(item.MaxSpeed),
        DistanceKM: parseFloat(item.DistanceKM),
        FuelBalance: parseFloat(item.FuelBalance) || 0
      });
    });

    // console.log('vehicleGroups:', vehicleGroups); // Debug: Check the aggregated vehicle data.

    // Map the vehicle data to listVehtrk
    const listVehtrk = Object.values(vehicleGroups).map(vehicleData => {
      const details = vehicleData.Details;

      if (!details || details.length === 0) {
        // console.log(`No details for vehicle ${vehicleData.VehicleNo}`);
        return null; // Return null if no details exist
      }

      const aggregate = {
        VehicleNo: vehicleData.VehicleNo,
        VehicleName: vehicleData.VehicleName,
        TrackDate: vehicleData.TrackDate,
        TotDays: details.length,
        TotFuelAllot: details.reduce((sum, d) => {
          const fuelAlloted = parseFloat(d.FuelAlloted) || 0;
          return sum + fuelAlloted;
        }, 0),
        FuelConsumption: details.reduce((sum, d) => {
          const fuelConsumption = parseFloat(d.FuelConsumption) || 0;
          return sum + fuelConsumption;
        }, 0),
        ActualDistance: details.reduce((sum, d) => {
          const distanceKM = d.DistanceKM || 0;
          return sum + distanceKM;
        }, 0),
        RunTimeSeconds: details.reduce((sum, d) => {
          return sum + (d.RunningTime || 0);
        }, 0),
        LitrePerHr: vehicleData.LitrePerHr,
        KmPerLitre: vehicleData.KmPerLitre
      };

      let balanceFuel = aggregate.TotFuelAllot - aggregate.FuelConsumption;
      let currentAllot = parseFloat(vehicleData.FuelAlloted) || 0;
      while (balanceFuel < 0 && currentAllot > 0) {
        balanceFuel += currentAllot / 2;
        aggregate.TotFuelAllot += currentAllot / 2;
      }
      aggregate.BalanceFuel = balanceFuel;

      const duration = moment.duration(aggregate.RunTimeSeconds, 'seconds');
      aggregate.RunTimeFormatted =
        `${Math.floor(duration.asHours())}Hrs :: ${duration.minutes()}Min :: ${duration.seconds()}Sec`;

      if (aggregate.KmPerLitre > 0) {
        aggregate.DistanceAsAllot = aggregate.TotFuelAllot * aggregate.KmPerLitre;
        aggregate.BalanceDist = aggregate.DistanceAsAllot - aggregate.ActualDistance;
      }

      return aggregate;
    }).filter(item => item !== null); // Filter out null values

    // console.log('listVehtrk:', listVehtrk); // Debug: Check if the final list is populated correctly.

    // Format dates (same as before)
    listVehtrk.forEach(item => {
      item.TrackDate = moment(item.TrackDate).startOf('day').toDate();
    });

    // console.log('Formatted listVehtrk:', listVehtrk); // Debug: Final formatted data.

    return {
      data: listVehtrk
    };

  } catch (ex) {
    // console.error('Error in VehicleFuelDateRange:', ex.message);
    return {
      status: 'failed',
      message: ex.message
    };
  }
}

export { VehicleFuelDateRange };
