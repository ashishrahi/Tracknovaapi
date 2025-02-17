import { trackDetailsNT } from "../../utils/DBQueries/VehicleMovingControllerPipeline.js";
import { ItemMaster } from "../../modals/index.js";

async function VehicleFuelDateRange(filter) {
    try {
        const { date1, date2, list1, listInt1, Flag } = filter;

        // Convert dates properly
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
            throw new Error("Invalid date format");
        }

        const matchStage = {
            $match: {
                trackDate: { $gte: d1, $lte: d2 },
                ...(Flag ? {} : { vehicleNo: { $in: list1 } }),
                ...(Flag ? {} : { vehicleType: { $in: listInt1 } })
            }
        };

        const aggregationPipeline = [
            matchStage,
            {
                $lookup: {
                    from: "itemmasters",
                    localField: "vehicleNo",
                    foreignField: "vehicleno",
                    as: "vehicleDetails"
                }
            },
            {
                $unwind: {
                    path: "$vehicleDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$vehicleNo",
                    vehicleName: { $first: "$vehicleDetails.itemname" },
                    trackDates: { $push: "$trackDate" },
                    totalFuelAlloted: { $sum: { $toDouble: "$fuelAlloted" } },
                    totalFuelConsumption: { $sum: { $toDouble: "$fuelConsumption" } },
                    totalDays: { $sum: 1 },
                    avgKmPerLitre: { $avg: "$KmPerLitre" },
                    avgLitrePerHr: { $avg: "$LitrePerHr" },
                    maxSpeed: { $max: "$MaxSpeed" }
                }
            },
            {
                $project: {
                    vehicleNo: "$_id",
                    vehicleName: 1,
                    totalFuelAlloted: 1,
                    totalFuelConsumption: 1,
                    totalDays: 1,
                    avgKmPerLitre: 1,
                    avgLitrePerHr: 1,
                    maxSpeed: 1
                }
            }
        ];

        const results = await TrackDetailModel.aggregate(aggregationPipeline);

        return results;
    } catch (error) {
        console.error("Error fetching vehicle fuel data:", error.message);
        return { error: error.message };
    }
}

export { VehicleFuelDateRange };
