import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";

////////////////////////////// AddUpdateBinManageQuery ////////////////////////////////////

export const AddUpdateBinManageQuery = async (model) => {
  try {
    const { RouteAreaBinDetail } = await getTenantDBModels();
    const results = [];

    // Loop over routeAreaBinDetailCmd for processing
    for (const cmd of model.routeAreaBinDetailCmd) {
      const {
        routeDetailBinId,
        routeDetailId,
        binID,
        routeID,
        areaID,
        serialNo,
        timing,
        createdBy,
        updatedBy,
      } = cmd;

      const existingBinDetail = await RouteAreaBinDetail.findOne({
        RouteDetailBinId: routeDetailBinId,
      });

      if (existingBinDetail) {
        const updatedBinDetail = await RouteAreaBinDetail.findOneAndUpdate(
          { RouteDetailBinId: routeDetailBinId },
          {
            RouteDetailBinId: routeDetailBinId,
            RouteDetailId: routeDetailId,
            BinID: binID,
            RouteID: routeID,
            AreaID: areaID,
            SerialNo: serialNo,
            Timing: timing,
            CreatedBy: createdBy,
            UpdatedBy: updatedBy,
          },
          { new: true }
        );

        results.push({
          action: "updated",
          message: `Successfully updated ${routeDetailBinId}.`,
          data: updatedBinDetail,
        });
      } else {
        // If bin detail doesn't exist, create a new document
        const newBinDetail = new RouteAreaBinDetail({
          RouteDetailBinId: routeDetailBinId,
          RouteDetailId: routeDetailId,
          BinID: binID,
          RouteID: routeID,
          AreaID: areaID,
          SerialNo: serialNo,
          Timing: timing,
          CreatedBy: createdBy,
          UpdatedBy: updatedBy,
        });

        await newBinDetail.save();
        results.push({
          action: "added",
          message: `${newBinDetail.RouteDetailBinId} has been successfully added.`,
          data: newBinDetail,
        });
      }
    }

    // Aggregate results after loop
    const addedCount = results.filter((item) => item.action === "added").length;
    const updatedCount = results.filter(
      (item) => item.action === "updated"
    ).length;

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: `Successfully added ${addedCount} record(s) and updated ${updatedCount} record(s).`,
      data: results,
    };
  } catch (err) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
    };
  }
};

////////////////////////////// GetBinManageQuery //////////////////////////////////////////

export const GetBinManageQuery = async (model) => {
  try {
    const { Route } = await getTenantDBModels();

    const { pageNo, pageSize } = model;
    const pipeline = [
      {
        $lookup: {
          from: "routeareabindetail",
          localField: "routeid",
          foreignField: "routeid",
          as: "routeareabindetail",
        },
      },
      {
        $unwind: {
          path: "$routeareabindetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "binlocation",
          localField: "routeareabindetail.binid",
          foreignField: "binlocid",
          as: "routeareabindetail.binlocation",
        },
      },
      {
        $unwind: {
          path: "$routeareabindetail.binlocation",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          routeid: 1,
          routename: { $ifNull: ["$routename", ""] },
          description: { $ifNull: ["$description", ""] },
          routedate: { $ifNull: ["$routedate", null] },
          createdby: { $ifNull: ["$createdby", ""] },
          updatedby: { $ifNull: ["$updatedby", ""] },
          createdon: { $ifNull: ["$createdon", null] },
          updatedon: { $ifNull: ["$updatedon", null] },
          "routeareabindetail.routedetailbinid": 1,
          "routeareabindetail.routeid": 1,
          "routeareabindetail.binlocation": {
            binlocid: {
              $ifNull: ["$routeareabindetail.binlocation.binlocid", null],
            },
            binlocname: {
              $ifNull: ["$routeareabindetail.binlocation.binlocname", ""],
            },
            binloccode: {
              $ifNull: ["$routeareabindetail.binlocation.binloccode", ""],
            },
            latitude: {
              $ifNull: ["$routeareabindetail.binlocation.latitude", null],
            },
            longitude: {
              $ifNull: ["$routeareabindetail.binlocation.longitude", null],
            },
            locationname: {
              $ifNull: ["$routeareabindetail.binlocation.locationname", ""],
            },
            locimage: {
              $ifNull: ["$routeareabindetail.binlocation.locimage", null],
            },
            description: {
              $ifNull: ["$routeareabindetail.binlocation.description", ""],
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          routeid: { $first: "$routeid" },
          routename: { $first: "$routename" },
          description: { $first: "$description" },
          routedate: { $first: "$routedate" },
          createdby: { $first: "$createdby" },
          updatedby: { $first: "$updatedby" },
          createdon: { $first: "$createdon" },
          updatedon: { $first: "$updatedon" },
          routeareabindetail: { $push: "$routeareabindetail" },
        },
      },
    ];

    // Apply pagination only if pageNo and pageSize are greater than 0
    if (pageNo > 0 && pageSize > 0) {
      pipeline.push(
        { $skip: (pageNo - 1) * pageSize },
        { $limit: parseInt(pageSize, 10) }
      );
    }

    const data = await Route.aggregate(pipeline);
    const rowCount = await Route.countDocuments();

    return {
      status: 1,
      message: "Data fetched successfully",
      data: data,
      pageNo: pageNo,
      pageSize: pageSize,
      rowCount: rowCount,
    };
  } catch (error) {
    return {
      status: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};
