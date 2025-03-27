import { StateMaster } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

///////////////////////////////////////////////   AddUpdateStateQuery  //////////////////////////////////////////////////////////////////

export const AddUpdateStateQuery = async (model) => {
  try {
    const { stateId, stateName, stateCode, countryId, createdBy, updatedBy } =
      model;

    if (!stateName) {
      return {
        isSuccess: false,
        internalSuccess: false,
        mesg: "State Name is required",
        insertedId: null,
        data: null,
      };
    }
    if (!stateId || stateId === 0) {
      return {
        isSuccess: false,
        internalSuccess: false,
        mesg: "State ID is required",
        insertedId: null,
        data: null,
      };
    }

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

///////////////////////////////////////////////   AddUpdateStateQuery  //////////////////////////////////////////////////////////////////

export const GetStatebyCountryQuery = async (model) => {
  try {
    const { CountryId } = model;
    const stateList = await StateMaster.find({CountryId:CountryId})
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
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};

/////////////////////////////////////////////////// GetStateQuery //////////////////////////////////////////////////////////////////

export const GetStateQuery = async (model) => {
  try {
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
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: `Error in AddUpdateStateQuery: ${err.message}`,
    };
  }
};

/////////////////////////////////////////////////// GetStateQuery //////////////////////////////////////////////////////////////////

export const GetStatesByCountryQuery = async (CountryId) => {
  try {
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
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: `Error in AddUpdateStateQuery: ${err.message}`,
    };
  }
};

////////////////////////////////////////////////////// DeleteStateQuery //////////////////////////////////////////////////////////////////

export const DeleteStateQuery = async (model) => {
  try {
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
        statusCode: StatusCodes.NOT_FOUND,
        mesg: `StateId ${model.stateId} not found`,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: `Error in DeleteStateQuery: ${error.message}`,
    };
  }
};
