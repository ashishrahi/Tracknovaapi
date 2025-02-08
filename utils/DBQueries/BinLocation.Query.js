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
    } = model;

    if (!binLocName || !binLocCode) {
return{
  status: false,
  message: "Bin Location Name and Code are required"
}
    }

    if (!binLocID || binLocID === 0 || binLocID === "") {
        // Insert logic
        const existingBin = await BinLocation.findOne({ BinLocName:binLocName });

        if (existingBin) {
          return{
            status: 0,
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

const newData ={
            binLocID: newBin.BinLocID,
            binLocName:newBin.BinLocName,
            binLocCode:newBin.BinLocCode,
            zoneID:newBin.ZoneID,
            areaID:newBin.AreaID,
            rfid: newBin.RFID,
            latitude:newBin.Latitude,
            longitude:newBin.Longitude,
            locationName:newBin.LocationName,
            locImage:newBin.LocImage,
            description:newBin.Description,
            createdBy:newBin.CreatedBy,
            updatedBy:newBin.UpdatedBy,
          }



return{
  status: 1,
  message: "Bin Location Added Successfully",
  data: newData
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
    // Extract pageNo and pageSize from the model
    let { pageNo, pageSize } = model;

    // If pageNo or pageSize are missing, throw an error
    if (pageNo === undefined || pageSize === undefined) {
        throw new Error('Page number and page size must be provided');
    }

    // Ensure pageNo and pageSize are valid integers
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);

    if (isNaN(pageNo) || pageNo < 0) {
        throw new Error('Invalid page number');
    }
    if (isNaN(pageSize) || pageSize < 0) {
        throw new Error('Invalid page size');
    }

    // Building the filter query dynamically based on the filters provided in the model
    const filterQuery = {};

    if (model.filters?.BinLocName) {
        filterQuery.BinLocName = { $regex: model.filters.BinLocName, $options: 'i' };
    }

    if (model.filters?.ZoneID) {
        filterQuery.ZoneID = model.filters.ZoneID;
    }

    if (model.filters?.AreaID) {
        filterQuery.AreaID = model.filters.AreaID;
    }

    // Define the aggregation pipeline
    const aggregationPipeline = [
        { $match: filterQuery },
        {
            $lookup: {
                from: 'AreaWardMaster',
                localField: 'AreaID',
                foreignField: 'AreaID',
                as: 'AreaWardMaster',
            },
        },
        { $unwind: { path: '$AreaWardMaster', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'ZoneMaster',
                localField: 'ZoneID',
                foreignField: 'ZoneID',
                as: 'ZoneMaster',
            },
        },
        { $unwind: { path: '$ZoneMaster', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                binLocID:"$BinLocID",
                binLocName: { $ifNull: ['$BinLocName', ''] },
                binLocCode: { $ifNull: ['$BinLocCode', ''] },
                zoneID: 1,
                rfid: 1,
                latitude: 1,
                longitude: 1,
                locationName: { $ifNull: ['$LocationName', ''] },
                locImage: 1,
                description: { $ifNull: ['$Description', ''] },
                createdBy: 1,
                updatedBy: 1,
                areaID: 1,
                areaWardMaster: {
                    areaID: '$AreaWardMaster.AreaID',
                    areaName: { $ifNull: ['$AreaWardMaster.AreaName', ''] },
                    wardNumber: { $ifNull: ['$AreaWardMaster.WardNumber', ''] },
                    zoneID: '$AreaWardMaster.ZoneID',
                    createdBy: { $ifNull: ['$AreaWardMaster.CreatedBy', ''] },
                    updatedBy: { $ifNull: ['$AreaWardMaster.UpdatedBy', ''] },
                },
                zoneMaster: {
                    zoneID: '$ZoneMaster.ZoneID',
                    zoneName: { $ifNull: ['$ZoneMaster.ZoneName', ''] },
                    zoneAbbrevation: { $ifNull: ['$ZoneMaster.ZoneAbbrevation', ''] },
                    createdBy: { $ifNull: ['$ZoneMaster.CreatedBy', ''] },
                    updatedBy: { $ifNull: ['$ZoneMaster.UpdatedBy', ''] },
                },
            },
        },
    ];

    // Fetch all data if pageNo = 0 and pageSize = 0
    if (!(pageNo === 0 && pageSize === 0)) {
        aggregationPipeline.push(
            { $skip: (pageNo - 1) * pageSize },
            { $limit: pageSize }
        );
    }

    // Get total count of documents
    const totalCount = await BinLocation.countDocuments(filterQuery);

    // Execute aggregation query
    const result = await BinLocation.aggregate(aggregationPipeline);

    if (result.length > 0) {
        return {
            status: 1,
            message: 'Bin Locations retrieved successfully',
            data: result,
            rowCount: totalCount
        };
    } else {
        return {
            status: 0,
            message: 'No Bin Locations found',
            data: [],
        };
    }
} catch (error) {
    return {
        status: 0,
        message: error.message,
    };
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
                status: 0,
                message: `Bin Location not found`,
            };
        }

        // Remove the bin location
        await BinLocation.findOneAndDelete({ BinLocID: binLocID });

        return {
             status: 1,
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

