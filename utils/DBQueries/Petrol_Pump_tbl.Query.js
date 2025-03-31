import { StatusCodes } from "http-status-codes";
import { Petrol_Pump_tbl, ItemMaster } from "../../modals/index.js";
import { getTenantDBModels } from "../../db/index.js";

/////////////////////////////////////// AddUpdatePetrolPumpQuery //////////////////////////////////////////////////////////////////

export const AddUpdatePetrolPumpQuery = async (model) => {
  try {
    const { Petrol_Pump_tbl } = await getTenantDBModels();

    // Check for blank Petrol Pump name
    if (!model.petroPump || model.petroPump.trim() === "") {
      return {
        status: 0,
        message: "Petrol Pump Name is required",
      };
    }

    if (model.id === 0) {
      // Check if record already exists
      const existingPump = await Petrol_Pump_tbl.findOne({
        PetroPump: model.petroPump,
      });
      if (existingPump) {
        return {
          status: 0,
          message: `Petrol Pump Name ${existingPump.PetroPump} already exists`,
        };
      }

      // Generate new ID if needed (Auto-increment logic is optional based on your DB structure)
      const lastPump = await Petrol_Pump_tbl.findOne().sort({ id: -1 });
      model.id = (lastPump?.id || 0) + 1;

      // Create a new Petrol Pump
      const newPump = new Petrol_Pump_tbl({
        id: model.id,
        PetroPump: model.petroPump,
        CityId: model.cityId,
        StateId: model.stateId,
      });
      await newPump.save();

      const NewPump = {
        id: newPump.id,
        petroPump: newPump.PetroPump,
        cityId: newPump.CityId,
        stateId: newPump.StateId,
      };

      return {
        status: 1,
        message: `Petrol Pump ${newPump.PetroPump} Added Successfully`,
        data: NewPump,
      };
    } else {
      // Update existing Petrol Pump
      const updatedPump = await Petrol_Pump_tbl.findOneAndUpdate(
        { id: model.id },
        {
          PetroPump: model.petroPump,
          CityId: model.cityId,
          StateId: model.stateId,
        },
        { new: true, runValidators: true }
      );

      if (!updatedPump) {
        return {
          status: 0,
          message: `Petrol Pump ${updatedPump.PetroPump} not found`,
        };
      }
      return {
        status: 1,
        message: `Petrol Pump ${updatedPump.PetroPump} Updated Successfully`,
        data: updatedPump,
      };
    }
  } catch (error) {
    return {
      status: 0,
      message:
        error.message +
        ";" +
        (error.innerException ? error.innerException : error.message),
    };
  }
};

////////////////////////////////////////  GetPetrolPumpVehicleQuery //////////////////////////////////////////////////////////////////

export const GetPetrolPumpVehicleQuery = async (model) => {
  try {
    const { ItemMaster } = await getTenantDBModels();

    // Define the query to get the required fields
    const query = [
      {
        $match: {
          itemFlag: "V",
          devid: { $ne: null },
        },
      },
      {
        $lookup: {
          from: "FuelCorrection",
          localField: "ItemMasterId",
          foreignField: "ItemMasterId",
          as: "fuelCorrections",
        },
      },

      {
        $addFields: {
          LastFuelCorrDate: {
            $cond: {
              if: { $gt: [{ $size: "$fuelCorrections" }, 0] },
              then: { $arrayElemAt: ["$fuelCorrections.correctionDate", -1] },
              else: new Date("1900-01-01"),
            },
          },
          LatestNTTrackDate: new Date("1900-01-01"), // Placeholder as in the original query
        },
      },
      {
        $project: {
          itemmasterid: 1,
          vehicleNo: 1,
          itemName: 1,
          devid: 1,
          LastFuelCorrDate: 1,
          LatestNTTrackDate: 1,
        },
      },
      { $sort: { vehicleNo: 1 } }, // Sorting by vehicleNo
    ];

    const data = await ItemMaster.aggregate(query); // Use aggregation pipeline

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: "Vehicle data fetched successfully",
      data: data,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  GetPetrolPumpQuery //////////////////////////////////////////////////////////////////

export const GetPetrolPumpQuery = async (model) => {
  try {
    const { Petrol_Pump_tbl } = await getTenantDBModels();

    if (model.id === -1) {
      const data = await Petrol_Pump_tbl.find({}).lean();
      const petrolPump = data.map((pump) => {
        return {
          id: pump.id,
          petroPump: pump.PetroPump,
          cityId: pump.CityId,
          stateId: pump.StateId,
        };
      });
      return {
        status: 1,
        message: "List of Petrol Pump Data fetched successfully",
        data: petrolPump,
      };
    } else {
      // Fetch a specific petrol pump by id
      const result = await Petrol_Pump_tbl.findOne({ id: model.id }).lean();
      if (result.length > 0) {
        return {
          status: 1,
          message: `Details of Petrol Pump ${model.PetroPump} fetched successfully`,
          data: result,
        };
      } else {
        return {
          status: 0,
          message: "No data found for the given id.",
        };
      }
    }
  } catch (error) {
    return {
      status: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        error.message +
        ";" +
        (error.innerException ? error.innerException : error.message),
    };
  }
};

/////////////////////////////////////////////// DeletePetrolPumpQuery //////////////////////////////////////////////////////////////////

export const DeletePetrolPumpQuery = async (model) => {
  try {
    const { Petrol_Pump_tbl } = await getTenantDBModels();

    if (model.id) {
      // Assuming `PetrolPump` is the Mongoose model
      const entity = await Petrol_Pump_tbl.findOne({ id: model.id });

      if (entity) {
        await Petrol_Pump_tbl.findOneAndDelete({ id: model.id });
        return {
          status: 1,
          message: `Petrol Pump ${entity.PetroPump} deleted successfully`,
        };
      } else {
        return {
          status: 0,
          message: `Petrol Pump ${entity.PetroPump} not found`,
        };
      }
    } else {
      return {
        status: 0,
        message: `Invalid Petrol Pump ${entity.PetroPump}`,
      };
    }
  } catch (error) {
    return {
      status: 0,
      message: error.message,
    };
  }
};
