import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";
//////////////////////////////////////////////// AddUpdateWardMasterQuery /////////////////////////////////////////////////////

export const AddUpdateWardMasterQuery = async (modal) => {

  try {
    const { WardMaster } = await getTenantDBModels();
    // validation of Wardname
    if (!modal.wardName || modal.wardName.trim() === "") {
      return {
        isSuccess: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Ward Name is required.",
      }
    }

    // validation of ZoneID
    if (!modal.zoneID || modal.zoneID === -1) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Zone ID is required.",
      }
    }
    //FindWard By Id
    let existingWard = await WardMaster.findOne({ WardID: modal.wardID });
    if (existingWard) {
      existingWard.ZoneID = modal.zoneID ?? existingWard.ZoneID;
      existingWard.WardName = modal.wardName?.trim() ?? existingWard.WardName;
      existingWard.WardCode = modal.wardCode?.trim() ?? existingWard.WardCode;
      existingWard.IsActive = modal.isActive ?? existingWard.IsActive;
      existingWard.SortOrder = modal.sortOrder ?? existingWard.SortOrder;
      existingWard.User_ID = modal.user_ID;
      existingWard.ModifyDt = new Date();

      await existingWard.save();
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Ward updated successfully.",
        data: existingWard,
      }
    }
    else {
      if (!modal.wardID || modal.wardID === -1 || modal.wardID === 0) {
        const maxWard = await WardMaster.findOne().sort({ WardID: -1 }).select("WardID");
        modal.wardID = maxWard ? maxWard.WardID + 1 : 1;
      }

    }


  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "An error occurred while processing the request.",
      error: error.message,
    }

  }
}

//////////////////////////////////////////////// GetWardMasterQuery /////////////////////////////////////////////////////


export const GetWardMasterQuery = async (modal) => {

  try {
    const { WardMaster } = await getTenantDBModels();

    const query = {};

    if (modal.isActive === true) {
      query.isActive = modal.isActive;
    }
    if (modal.wardID !== -1) {
      query.wardID = modal.wardID;
    }
    if (modal.zoneID !== -1) {
      query.zoneID = modal.zoneID;
    }
    if (modal.user_ID !== "-1") {
      query.user_ID = modal.user_ID;
    }

    // Query the database
    const wards = await WardMaster.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "zonemasters", // Collection name in the database
          localField: "zoneID",
          foreignField: "zoneID",
          as: "zoneDetails",
        },
      },
      {
        $addFields: {
          zoneName: { $arrayElemAt: ["$zoneDetails.zoneName", 0] },
        },
      },
      {
        $project: {
          zoneDetails: 0, // Exclude the full details of the zone
        },
      },
    ]);

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: "Ward Master data fetched successfully",
      data: wards,
    };

  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }

}

//////////////////////////////////////////////// DeletetWardMasterQuery /////////////////////////////////////////////////////


export const DeletetWardMasterQuery = async (modal) => {

  try {
    const { WardMaster } = await getTenantDBModels();

    const ward = await WardMaster.find({ WardID: modal.wardID }).lean();
    if (ward && ward.length > 0) {
      await WardMaster.deleteMany({ WardID: modal.wardID });
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `WardID ${modal.wardID} Successfully deleted`,
      };
    } else {
      return {
        isSuccess: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: `WardID ${modal.WardID} not found`,
      }
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }
}