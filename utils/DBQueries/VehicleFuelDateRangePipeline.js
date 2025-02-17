
import {trackDetailsNT} from '../../utils/DBQueries/VehicleMovingControllerPipeline.js'
import { ItemMaster } from '../../modals/index.js';


async function VehicleFuelDateRange(filter){
   
        try {
          const retd = [];

      
          // Date handling
          const d1 = new Date(filter.date1);
          const d2 = new Date(filter.date2);
          d1.setHours(0, 0, 0, 0);
          d2.setHours(23, 59, 59, 999);
      
          // Build query conditions
          const queryConditions = {
            trackDate: { $gte: d1, $lte: d2 }
          };
      
          if (!filter.Flag) {
            if (filter.list1 && filter.list1.length) {
              queryConditions.vehicleNo = { 
                $in: filter.list1?.map(v => v.trim()).filter(v => v) 
              };
            }
            if (filter.listInt1 && filter.listInt1.length) {
              queryConditions.vehicleType = { $in: filter.listInt1 };
            }
          }
        //   console.log("queryConditions:",queryConditions)
      
          // Fetch track details
        //   const lisret1 = await TrackDetail.find(queryConditions).lean();
          const lisret1 = await trackDetailsNT(filter).lean();
          console.log("lisret1:",lisret1)
        //   console.log()
      return;
          // Get vehicle information
          const vehitm = await ItemMaster.find({ itemflag: 'V' }).lean();
      
          // Enrich with vehicle names
          lisret1.forEach(item => {
            const vehicle = vehitm.find(v => v.vehicleno === item.vehicleNo);
            item.vehicleName = vehicle ? vehicle.itemname : '';
          });
      
          // Process vehicle aggregates
          const vehicleMap = new Map();
      
          lisret1.forEach(item => {
            if (!vehicleMap.has(item.vehicleNo)) {
              vehicleMap.set(item.vehicleNo, {
                VehicleNo: item.vehicleNo,
                VehicleName: item.vehicleName,
                TrackDate: item.trackDate,
                FuelAlloted: parseFloat(item.fuelAlloted) || 0,
                LitrePerHr: item.litrePerHr,
                KmPerLitre: item.kmPerLitre,
                Details: []
              });
            }
            vehicleMap.get(item.vehicleNo).Details.push(item);
          });
      
          // Calculate aggregates
          const listVehtrk = [];
          for (const [vehicleNo, vehicleData] of vehicleMap) {
            const details = vehicleData.Details;
            const aggregate = {
              VehicleNo: vehicleNo,
              VehicleName: vehicleData.VehicleName,
              TrackDate: vehicleData.TrackDate,
              TotDays: details.length,
              TotFuelAllot: details.reduce((sum, d) => sum + (parseFloat(d.fuelAlloted) || 0), 0),
              FuelConsumption: details.reduce((sum, d) => sum + (parseFloat(d.fuelConsumption) || 0), 0),
              ActualDistance: details.reduce((sum, d) => sum + (d.distanceKM || 0), 0),
              RunTimeSeconds: details.reduce((sum, d) => {
                const parts = d.runningIdleTime.split(/[^\d]+/);
                return sum + (parseInt(parts[0]) * 3600 )+ (parseInt(parts[1]) * 60) + (parseInt(parts[2]))
              }, 0),
              LitrePerHr: vehicleData.LitrePerHr,
              KmPerLitre: vehicleData.KmPerLitre
            };
      
            // Calculate balance fuel
            let balanceFuel = aggregate.TotFuelAllot - aggregate.FuelConsumption;
            let currentAllot = parseFloat(vehicleData.FuelAlloted) || 0;
            while (balanceFuel < 0 && currentAllot > 0) {
              balanceFuel += currentAllot / 2;
              aggregate.TotFuelAllot += currentAllot / 2;
            }
            aggregate.BalanceFuel = balanceFuel;
      
            // Calculate runtime
            const duration = moment.duration(aggregate.RunTimeSeconds, 'seconds');
            aggregate.RunTimeFormatted = 
              `${Math.floor(duration.asHours())}Hrs :: ${duration.minutes()}Min :: ${duration.seconds()}Sec`;
      
            // Calculate distance metrics
            if (aggregate.KmPerLitre > 0) {
              aggregate.DistanceAsAllot = aggregate.TotFuelAllot * aggregate.KmPerLitre;
              aggregate.BalanceDist = aggregate.DistanceAsAllot - aggregate.ActualDistance;
            }
      
            listVehtrk.push(aggregate);
          }
      
          // Format dates
          listVehtrk.forEach(item => {
            item.TrackDate = moment(item.TrackDate).startOf('day').toDate();
          });
      
         return{ 
            data: listVehtrk
          }
      
        } catch (ex) {
        return  {
            message: ex.message + (ex.innerException ? `;${ex.innerException.message}` : '')
          }
        }
      }
  
  export { VehicleFuelDateRange }