import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";
import { validateStateMaster } from "../validation/stateMasterValidation.js";

///////////////////////////////////////////////   AddUpdateStateQuery  //////////////////////////////////////////////////////////////////

export const AddUpdateStateQuery = async (model) => {
  try {
    // Joi validation
    let { error } = validateStateMaster(model);

    // Joi Error Message
    if (error) {
      return {
        isSuccess: false,
        internalSuccess: false,
        mesg: error.details[0].message,
      };
    }
    // Tenant Database
    const { StateMaster } = await getTenantDBModels();
    //  Destructure of model
    const { stateId, stateName, stateCode, countryId, createdBy, updatedBy } =
      model;

    // Duplicity of State
    const duplicityState = await StateMaster.findOne({
      StateName: { $regex: new RegExp(`^${stateName}$`, "i") },
      StateId: { $ne: stateId },
    });
    if (duplicityState) {
      return{
        isSuccess: false,
        internalSuccess: true,
        mesg: `"${duplicityState.StateName}" state already exist`,
      }
    }

    // Existence of State by StateId
    let state = await StateMaster.findOne({ StateId: stateId });

    if (state) {
      // Update existing state
      if (stateName) state.StateName = stateName;
      if (stateCode) state.StateCode = stateCode;
      if (countryId) state.CountryId = countryId;
      if (createdBy) state.CreatedBy = createdBy;
      if (updatedBy) state.UpdatedBy = updatedBy;

      await state.save();

      const updateState = {
        stateId: state.StateId,
        stateName: state.StateName,
        stateCode: state.StateCode,
        countryId: state.CountryId,
        createdBy: state.CreatedBy,
        updatedBy: state.UpdatedBy,
      };

      return {
        isSuccess: true,
        internalSuccess: true,
        mesg: `${updateState.stateName} State Successfully Updated`,
        insertedId: state.StateId,
        data: updateState,
      };
    } else {
      // Generate a new stateId if not provided
      let newStateId = stateId;
      if (stateId === -1 || stateId === null || stateId === 0) {
        const lastState = await StateMaster.findOne().sort({ StateId: -1 });
        newStateId = lastState ? lastState.StateId + 1 : 1;
      }

      const newState = new StateMaster({
        StateId: newStateId,
        StateName: stateName,
        StateCode: stateCode,
        CountryId: countryId,
        CreatedBy: createdBy,
        UpdatedBy: updatedBy,
      });

      await newState.save();

      const newlyState = {
        stateId: newState.StateId,
        stateName: newState.StateName,
        stateCode: newState.StateCode,
        countryId: newState.CountryId,
        createdBy: newState.CreatedBy,
        updatedBy: newState.UpdatedBy,
      };

      return {
        isSuccess: true,
        internalSuccess: true,
        mesg: `State ${newState.StateName} Successfully Added`,
        insertedId: newState.StateId,
        data: newlyState,
      };
    }
  } catch (error) {
    if (error.code === 11000) {
      return {
        isSuccess: false,
        internalSuccess: false,
        mesg: "State Name Already Exists",
        insertedId: null,
        data: null,
      };
    }
    return {
      isSuccess: false,
      internalSuccess: false,
      mesg: error.message,
      insertedId: null,
      data: null,
    };
  }
};

///////////////////////////////////////////////   ImportStatesQuery  //////////////////////////////////////////////////////////////////

export const ImportStatesQuery = async (model) => {
  try {
    const { StateMaster, CountryMaster } = await getTenantDBModels();

    let inserted = 0;
    let skipped = 0;

    if (!Array.isArray(model) || model.length === 0) {
      throw new Error("Invalid input: model must be a non-empty array.");
    }

    for (const state of model) {
      const { countryName, stateName, stateCode, createdBy, updatedBy } = state;

      if (!countryName || !stateName || !stateCode) {
        skipped++;
        continue;
      }

      // Check for existing state
      const existing = await StateMaster.findOne({ StateName: stateName });
      if (existing) {
        skipped++;
        continue;
      }

      // Find country ID
      const country = await CountryMaster.findOne({ CountryName: countryName });
      if (!country) {
        skipped++;
        continue;
      }

      // Get next StateId
      const lastState = await StateMaster.findOne()
        .sort({ StateId: -1 })
        .limit(1);
      const nextStateId = lastState ? lastState.StateId + 1 : 1;

      await StateMaster.create({
        StateId: nextStateId,
        StateName: stateName.trim(),
        StateCode: stateCode,
        CountryId: country.CountryId,
        CreatedBy: createdBy || null,
        UpdatedBy: updatedBy || null,
      });

      inserted++;
    }

    return {
      isSuccess: true,
      mesg: `CSV import successful`,
      inserted,
      skipped,
    };
  } catch (error) {
    console.error("CSV Import Failed:", error);
    return {
      isSuccess: false,
      statusCode: 500,
      mesg: error.message,
    };
  }
};

///////////////////////////////////////////////   AddUpdateStateQuery  //////////////////////////////////////////////////////////////////

export const GetStatebyCountryQuery = async (model) => {
  try {
    const { StateMaster } = await getTenantDBModels();

    const { CountryId } = model;
    const stateList = await StateMaster.find({ CountryId: CountryId });
    //  const newList = stateList.map((statename)=>statename.StateName)
    return {
      isSuccess: true,
      internalSuccess: "",
      mesg: "States fetched successfully",
      insertedId: "",
      data: stateList,
    };
  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};

/////////////////////////////////////////////////// GetStateQuery //////////////////////////////////////////////////////////////////

export const GetStateQuery = async (model) => {
  try {
    const { StateMaster } = await getTenantDBModels();

    // Construct match conditions based on the model
    const matchConditions = {};

    if (model.stateId !== -1) {
      matchConditions.StateId = model.StateNametateId;
    }

    if (model.countryId !== -1) {
      if (model.CountryId !== 0) {
        matchConditions.CountryId = model.countryId;
      }
    }

    // Execute the aggregation pipeline
    const states = await StateMaster.aggregate([
      // Step 1: Filter (equivalent to the `Where` clause in LINQ)
      { $match: matchConditions },

      // Step 2: Lookup (equivalent to `GroupJoin`)
      {
        $lookup: {
          from: "CountryMaster", // Collection name for CountryMaster
          localField: "CountryId", // Field in StateMaster
          foreignField: "CountryId", // Field in CountryMaster
          as: "countryDetails", // Output array field
        },
      },

      // Step 3: Unwind (similar to `DefaultIfEmpty` in LINQ for joins)
      {
        $unwind: {
          path: "$countryDetails",
          preserveNullAndEmptyArrays: true, // Ensure no documents are dropped if no match
        },
      },

      // Step 4: Project the desired fields (equivalent to Select in LINQ)
      {
        $project: {
          stateId: "$StateId",
          stateName: "$StateName",
          stateCode: { $ifNull: ["$StateCode", ""] }, // Handle null StateCode
          countryId: "$CountryId",
          countryName: "$countryDetails.CountryName",
          createdBy: "$CreatedBy",
          updatedBy: "$UpdatedBy",
          createdOn: "$CreatedOn",
          updatedOn: "$UpdatedOn",
        },
      },
    ]);

    return {
      isSuccess: true,
      internalSuccess: "",
      mesg: "States fetched successfully",
      insertedId: "",
      data: states,
    };
  } catch (err) {
    return {
      isSuccess: false,
      internalSuccess: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: `Error in AddUpdateStateQuery: ${err.message}`,
    };
  }
};

/////////////////////////////////////////////////// GetStateQuery //////////////////////////////////////////////////////////////////

export const GetStatesByCountryQuery = async (CountryId) => {
  try {
    const { StateMaster } = await getTenantDBModels();

    // console.log("Model:",model)
    const states = await StateMaster({ CountryId: CountryId });
    return {
      isSuccess: true,
      internalSuccess: "",
      mesg: "States fetched successfully",
      insertedId: "",
      data: states,
    };
  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: `Error in AddUpdateStateQuery: ${err.message}`,
    };
  }
};

////////////////////////////////////////////////////// DeleteStateQuery //////////////////////////////////////////////////////////////////

export const DeleteStateQuery = async (model) => {
  try {
    const { StateMaster } = await getTenantDBModels();

    // Find the state(s) with the given StateId
    const states = await StateMaster.find({ StateId: model.stateId }).exec();

    if (states && states.length > 0) {
      // Remove the found states
      await StateMaster.deleteMany({ StateId: model.stateId });

      return {
        isSuccess: true,
        internalSuccess: "",
        mesg: `StateId ${model.stateId} successfully deleted`,
      };
    } else {
      return {
        isSuccess: false,
        internalSuccess: StatusCodes.NOT_FOUND,
        mesg: `StateId ${model.stateId} not found`,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: `Error in DeleteStateQuery: ${error.message}`,
    };
  }
};
