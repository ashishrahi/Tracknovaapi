import { BinLocation } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

////////////////////////////// AddUpdateBinLocationQuery //////////////////////////////////////////


export const AddUpdateBinLocationQuery = async (model) => {
  try {
    const {
        binLocID,
        binLocName,
        binLocCode,
        zoneID,
        areaID,
        rfid,
        latitude,
        longitude,
        locationName,
        locImage,
        description,
        createdBy,
        updatedBy,
        createdOn,
        updatedOn
    } = model;

    if (!binLocName || !binLocCode) {
return{
  isSuccess: false,
  statusCode: StatusCodes.BAD_REQUEST,
  message: "Bin Location Name and Code are required"
}
    }

    if (!binLocID || binLocID === 0 || binLocID === "") {
        // Insert logic
        const existingBin = await BinLocation.findOne({ BinLocName:binLocName });

        if (existingBin) {
          return{
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: "Bin Location Name already exists"
          }
        }

        const lastBin = await BinLocation.findOne().sort({ BinLocID: -1 });
        const newBinLocID = lastBin ? lastBin.BinLocID + 1 : 1;

        const newBin = new BinLocation({
            BinLocID: newBinLocID,
            BinLocName:binLocName,
            BinLocCode:binLocCode,
            ZoneID:zoneID,
            AreaID:areaID,
            RFID:rfid,
            Latitude:latitude,
            Longitude:longitude,
            LocationName:locationName,
            LocImage:locImage,
            Description:description,
            CreatedBy:createdBy,
            UpdatedBy:updatedBy,
        });

        await newBin.save();
return{
  isSuccess: true,
  statusCode: StatusCodes.CREATED,
  message: "Bin Location Added Successfully",
  data: newBin
}

    } else {
        // Update logic
        const updatedBin = await BinLocation.findOneAndUpdate(
            { binLocID },
            {
                binLocName,
                binLocCode,
                zoneID,
                areaID,
                rfid,
                latitude,
                longitude,
                locationName,
                locImage,
                description,
                updatedBy,
                updatedOn: new Date()
            },
            { new: true }
        );

        if (!updatedBin) {
           return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Internal error. Try again"
           }
        }
             return{
              isSuccess: true,
              statusCode: StatusCodes.OK,
              message: "Bin Location Updated Successfully",
              data: updatedBin
             }
    }
} catch (error) {
    return{
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message
    }
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
    const { binLocID, areaID } = model;

    if (areaID !== 0) {
        const entity = await BinLocation.findOne({ BinLocID: binLocID });

        if (!entity) {
            return {
                isSuccess: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: `Bin Location not found`,
            };
        }

        // Remove the bin location
        await BinLocation.findOneAndDelete({ BinLocID: binLocID });

        return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: `BinLocID ${binLocID} Deleted Successfully`,
        };
    }

    return {
        isSuccess: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Invalid areaID, deletion not allowed`,
    };
} catch (error) {
    return {
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
    };
}

};

