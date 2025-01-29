import { ZoneMaster } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

//////////////////////////////////////////////// AddUpdateWardMasterQuery /////////////////////////////////////////////////////

export const AddUpdateWardMasterQuery = async (modal) => {

    try {
        // validation of Wardname
        if (!modal.WardName || modal.WardName.trim() === "") {
            return{
                isSuccess: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: "Ward Name is required.",
            }}

      // validation of ZoneID
       if (!modal.ZoneID || modal.ZoneID === -1) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Zone ID is required.",
        }}
        //FindWard By Id
        let existingWard = await WardMaster.findOne({ WardID: modal.WardID });
        if (existingWard) {
            existingWard.ZoneID = modal.ZoneID ?? existingWard.ZoneID;
      existingWard.WardName = modal.WardName?.trim() ?? existingWard.WardName;
      existingWard.WardCode = modal.WardCode?.trim() ?? existingWard.WardCode;
      existingWard.IsActive = modal.IsActive ?? existingWard.IsActive;
      existingWard.SortOrder = modal.SortOrder ?? existingWard.SortOrder;
      existingWard.User_ID = modal.User_ID;
      existingWard.ModifyDt = new Date();

      await existingWard.save();
      return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Ward updated successfully.",
        data: existingWard,
      }}
      else{
        if (!modal.WardID || modal.WardID === -1 || modal.WardID === 0) {
             const maxWard = await WardMaster.findOne().sort({ WardID: -1 }).select("WardID");
        modal.WardID = maxWard ? maxWard.WardID + 1 : 1;
        }

      }
        

    } catch (error) {
      return{
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
  
     return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Ward Master data fetched successfully",
        data: wards,
      };
     
    } catch (error) {
      return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      }
    }
  
}

//////////////////////////////////////////////// DeletetWardMasterQuery /////////////////////////////////////////////////////


export const DeletetWardMasterQuery = async (modal) => {

    try {
        const ward = await WardMaster.find({ WardID: modal.WardID }).lean();
        if (ward && ward.length > 0) {
            await WardMaster.deleteMany({ WardID: modal.WardID });
            return {
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: `WardID ${modal.WardID} Successfully deleted`,
            };
        } else {
            return{
                isSuccess: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: `WardID ${modal.WardID} not found`,
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