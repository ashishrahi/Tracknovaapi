import { StateMaster } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

///////////////////////////////////////////////   AddUpdateStateQuery  //////////////////////////////////////////////////////////////////
  
export const AddUpdateStateQuery = async (model) => {
    try {
        // Validate StateName
        if (!model.StateName || model.StateName.trim() === "") {
          return {
            isSuccess: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: "State Name is required",
          };
        }
    
        // Validate StateId
        if (model.StateId == 0) {
          return {
            isSuccess: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: "State Id is required",
          };
        }
    
        // Check if state already exists by StateId
        const existingState = await StateMaster.findOne({ StateId: model.StateId });
    
        if (existingState) {
          // Conflict checks for StateName, StateCode, and CountryId
          if (model.StateName && existingState.StateName === model.StateName) {
            return {
              isSuccess: false,
              statusCode: StatusCodes.CONFLICT,
              message: "State Name already exists",
            };
          }
    
          if (model.StateCode && existingState.StateCode === model.StateCode) {
            return {
              isSuccess: false,
              statusCode: StatusCodes.CONFLICT,
              message: "State Code already exists",
            };
          }
    
          if (model.CountryId && existingState.CountryId === model.CountryId) {
            return {
              isSuccess: false,
              statusCode: StatusCodes.CONFLICT,
              message: "Country already exists",
            };
          }
    
          // Update existing state
          existingState.UpdatedOn = new Date();
          Object.assign(existingState, model);
          await existingState.save();
    
          return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: "State updated successfully",
            data: existingState,
          };
        } else {
          // Add new state
          let tempStateId = model.StateId;
    
          // Auto-generate StateId if invalid or missing
          if (!tempStateId || tempStateId <= 0) {
            const lastState = await StateMaster.find().sort({ StateId: -1 }).limit(1);
            tempStateId = lastState.length > 0 ? lastState[0].StateId + 1 : 1;
          }
    
          const newState = new StateMaster({
            StateId: tempStateId,
            StateName: model.StateName,
            StateCode: model.StateCode,
            CountryId: model.CountryId,
            CreatedOn: model.CreatedOn || new Date(),
            UpdatedOn: model.UpdatedOn || new Date(),
          });
    
          await newState.save();
    
          return {
            isSuccess: true,
            statusCode: StatusCodes.CREATED,
            message: "State added successfully",
            data: newState,
          };
        }
      } catch (error) {
        if (error.code === 11000) {
          return {
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: "State Name or State Code already exists",
          };
        }
    
        return {
          isSuccess: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: `Error in AddUpdateStateQuery: ${error.message}`,
        };
      }
    
    
    
}
/////////////////////////////////////////////////// GetStateQuery //////////////////////////////////////////////////////////////////
    
export const GetStateQuery = async (model) => {
    try {
        // Construct match conditions based on the model
        const matchConditions = {};
    
        if (model.StateId !== -1) {
          matchConditions.StateId = model.StateId;
        }
    
        if (model.CountryId !== -1) {
          if (model.CountryId !== 0) {
            matchConditions.CountryId = model.CountryId;
          }
        }
    
        // Execute the aggregation pipeline
        const states = await StateMaster.aggregate([
          // Step 1: Filter (equivalent to the `Where` clause in LINQ)
          { $match: matchConditions },
    
          // Step 2: Lookup (equivalent to `GroupJoin`)
          {
            $lookup: {
              from: 'countrymasters', // Collection name for CountryMaster
              localField: 'CountryId', // Field in StateMaster
              foreignField: 'CountryId', // Field in CountryMaster
              as: 'countryDetails', // Output array field
            },
          },
    
          // Step 3: Unwind (similar to `DefaultIfEmpty` in LINQ for joins)
          {
            $unwind: {
              path: '$countryDetails',
              preserveNullAndEmptyArrays: true, // Ensure no documents are dropped if no match
            },
          },
    
          // Step 4: Project the desired fields (equivalent to Select in LINQ)
          {
            $project: {
              StateId: 1,
              StateName: 1,
              StateCode: { $ifNull: ['$StateCode', ''] }, // Handle null StateCode
              CountryId: 1,
              CountryName: '$countryDetails.CountryName',
              CreatedBy: 1,
              UpdatedBy: 1,
              CreatedOn: 1,
              UpdatedOn: 1,
            },
          },
        ]);
    
   return{
     isSuccess: true,
     statusCode: StatusCodes.OK,
     message: 'States fetched successfully',
     data: states,
   }
    } catch (err) {
      return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: `Error in AddUpdateStateQuery: ${err.message}`,
      }
      }
}

////////////////////////////////////////////////////// DeleteStateQuery //////////////////////////////////////////////////////////////////

export const DeleteStateQuery = async (model) => {
    

    try {
        // Find the state(s) with the given StateId
        const states = await StateMaster.find({ StateId: model.StateId }).exec();

        if (states && states.length > 0) {
            // Remove the found states
            await StateMaster.deleteMany({ StateId: model.StateId });

            return{
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: `StateId ${model.StateId} successfully deleted`,
            }
        } else {
            return{
                isSuccess: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: `StateId ${model.StateId} not found`,
            }
        }
    } catch (error) {
       return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: `Error in DeleteStateQuery: ${error.message}`,
       }
    }

};

