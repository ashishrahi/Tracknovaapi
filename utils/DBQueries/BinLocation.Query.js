import { BinLocation } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

////////////////////////////// AddUpdateBinLocationQuery //////////////////////////////////////////


export const AddUpdateBinLocationQuery = async (model) => {
 

  try {
    if (!model.BinLocID || model.BinLocID === 0) {
      // Check if the record already exists by BinLocName
      const existingRecord = await BinLocation.findOne({ BinLocName: model.BinLocName });
      if (existingRecord) {
        return {
          isSuccess: true,
          status: StatusCodes.CONFLICT,
          message: 'Record Already Exists!',
          data: existingRecord,
        };
      }

      // Calculate the next BinLocID
      const lastRecord = await BinLocation.findOne().sort({ BinLocID: -1 });
      model.BinLocID = (lastRecord?.BinLocID || 0) + 1;

      // Create a new bin location
      const newBinLocation = new BinLocation(model);
      await newBinLocation.save();

      return {
        isSuccess: true,
        statusCode: StatusCodes.CREATED,
        message: `New BinLocation ${newBinLocation.BinLocName} Added Successfully`,
        data: newBinLocation,
      };
    } else {
      // Update existing record using findOneAndUpdate
      const updatedEntity = await BinLocation.findOneAndUpdate(
        { BinLocID: model.BinLocID },
        model, 
        { new: true, runValidators: true } 
      );

      if (!updatedEntity) {
        return {
          isSuccess: false,
          status: StatusCodes.NOT_FOUND,
          message: `${BinLocId} of Bin location not found!`,
          data: model,
        };
      }

      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `${BinLocID} of BinLocation Update Successfully`,
        data: updatedEntity,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
    };
  }
  };
  
////////////////////////////// GetBinLocationQuery //////////////////////////////////////////


export const GetBinLocationQuery = async (model) => {
  try {
    // Extract pageNo, pageSize, filters, and sort from the model
    let { pageNo, pageSize, filters = {}, sort = { CreatedOn: 1 } } = model;

    // If pageNo or pageSize are missing from the model, throw an error or handle it accordingly
    if (!pageNo || !pageSize) {
      throw new Error('Page number and page size must be provided');
    }

    // Ensure pageNo and pageSize are valid integers
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);

    // If pageNo or pageSize are not valid numbers, throw an error or handle it accordingly
    if (isNaN(pageNo) || pageNo < 1) {
      throw new Error('Invalid page number');
    }
    if (isNaN(pageSize) || pageSize < 1) {
      throw new Error('Invalid page size');
    }

    // Building the filter query dynamically based on the filters provided in the model
    const filterQuery = {};

    if (filters.BinLocName) {
      filterQuery.BinLocName = { $regex: filters.BinLocName, $options: 'i' }; // Case-insensitive search
    }

    if (filters.ZoneID) {
      filterQuery.ZoneID = filters.ZoneID;
    }

    if (filters.AreaID) {
      filterQuery.AreaID = filters.AreaID;
    }

    // Define the aggregation pipeline with dynamic filter, pagination, and sorting
    const aggregationPipeline = [
      {
        $match: filterQuery, // Apply dynamic filters here
      },
      {
        $lookup: {
          from: 'AreaWardMaster',
          localField: 'AreaID',
          foreignField: 'AreaID',
          as: 'AreaWardMaster',
        },
      },
      {
        $unwind: {
          path: '$AreaWardMaster',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'ZoneMaster',
          localField: 'ZoneID',
          foreignField: 'ZoneID',
          as: 'ZoneMaster',
        },
      },
      {
        $unwind: {
          path: '$ZoneMaster',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          BinLocID: 1,
          BinLocName: { $ifNull: ['$BinLocName', ''] },
          BinLocCode: { $ifNull: ['$BinLocCode', ''] },
          ZoneID: 1,
          RFID: 1,
          Latitude: 1,
          Longitude: 1,
          LocationName: { $ifNull: ['$LocationName', ''] },
          LocImage: 1,
          Description: { $ifNull: ['$Description', ''] },
          CreatedBy: 1,
          UpdatedBy: 1,
          CreatedOn: { $ifNull: ['$CreatedOn', new Date(0)] },
          UpdatedOn: { $ifNull: ['$UpdatedOn', new Date(0)] },
          AreaID: 1,
          AreaWardMaster: {
            AreaID: '$AreaWardMaster.AreaID',
            AreaName: { $ifNull: ['$AreaWardMaster.AreaName', ''] },
            WardNumber: { $ifNull: ['$AreaWardMaster.WardNumber', ''] },
            ZoneID: '$AreaWardMaster.ZoneID',
            CreatedBy: { $ifNull: ['$AreaWardMaster.CreatedBy', ''] },
            UpdatedBy: { $ifNull: ['$AreaWardMaster.UpdatedBy', ''] },
            CreatedOn: { $ifNull: ['$AreaWardMaster.CreatedOn', new Date(0)] },
            UpdatedOn: { $ifNull: ['$AreaWardMaster.UpdatedOn', new Date(0)] },
          },
          ZoneMaster: {
            ZoneID: '$ZoneMaster.ZoneID',
            ZoneName: { $ifNull: ['$ZoneMaster.ZoneName', ''] },
            ZoneAbbrevation: { $ifNull: ['$ZoneMaster.ZoneAbbrevation', ''] },
            CreatedBy: { $ifNull: ['$ZoneMaster.CreatedBy', ''] },
            UpdatedBy: { $ifNull: ['$ZoneMaster.UpdatedBy', ''] },
            CreatedOn: { $ifNull: ['$ZoneMaster.CreatedOn', new Date(0)] },
            UpdatedOn: { $ifNull: ['$ZoneMaster.UpdatedOn', new Date(0)] },
          },
        },
      },
      {
        $skip: (pageNo - 1) * pageSize, // Skip for pagination
      },
      {
        $limit: pageSize, // Limit for pagination
      },
    ];

    // Get total count of documents for pagination
    const totalCount = await BinLocation.countDocuments();

    // Execute aggregation query
    const result = await BinLocation.aggregate(aggregationPipeline);

    if (result.length > 0) {
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: 'Bin Locations retrieved successfully',
        data: result,
        pageNo: pageNo,
        pageSize: pageSize,
        rowCount: totalCount,
      };
    } else {
      return{
        isSuccess: false,
        statusCode: StatusCodes.NO_CONTENT,
        message: 'No Bin Locations found',
        data: [],
        pageNo: pageNo,
        pageSize: pageSize,
        rowCount: totalCount,
      }
    }
  } catch (error) {
   return{
     isSuccess: false,
     statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
     message: error.message,
   }
  }
}

////////////////////////////// DeleteBinLocationQuery //////////////////////////////////////////


export const DeleteBinLocationQuery = async (model) => {
  
  try {
    const { BinLocID, AreaID } = model
        if (AreaID !== 0) {
            const entity = await BinLocation.findOne({BinLocID:BinLocID});

            if (!entity) {
                return {
                    isSuccess: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: `BinLocID ${BinLocID} of Bin Location not found`,
                };
            }

            // Remove the bin location
            await BinLocation.findOneAndDelete({BinLocID:BinLocID});
        }

        return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: `BinLocID ${BinLocID} Deleted Successfully`,
        };
    } catch (error) {
        return {
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Server Error',
        };
    }
};

