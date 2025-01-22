import { BinLocation,Route,RouteAreaBinDetail } from "../../modals/index.js";

import { StatusCodes } from "http-status-codes";


////////////////////////////// AddUpdateBinLocationQuery //////////////////////////////////////////


export const AddUpdateBinManageQuery = async (model) => {
  try {
    const results = []; 

    for (const cmd of model.RouteAreaBinDetailCmd) {
      const existingBinDetail = await RouteAreaBinDetail.findOne({
        RouteDetailBinId: cmd.RouteDetailBinId,
      });

      if (existingBinDetail) {
        const updatedBinDetail = await RouteAreaBinDetail.findOneAndUpdate(
          { RouteDetailBinId: cmd.RouteDetailBinId },
          {
            RouteDetailBinId: cmd.RouteDetailBinId,
            RouteDetailId: cmd.RouteDetailId,
            BinID: cmd.BinID,
            RouteID: cmd.RouteID,
            AreaID: cmd.AreaID,
            SerialNo: cmd.SerialNo,
            Timing: cmd.Timing,
            CreatedBy: cmd.CreatedBy,
            UpdatedBy: cmd.UpdatedBy,
            CreatedOn: cmd.CreatedOn,
            UpdatedOn: cmd.UpdatedOn,
          },
          { new: true }
        );


        results.push({
          action: 'updated',
          message: `Successfully updated ${cmd.RouteDetailBinId}.`,
          data: updatedBinDetail,
        });
        return{
          isSuccess: 'success',
          statusCode: StatusCodes.OK,
          message: `Successfully updated ${cmd.RouteDetailBinId}.`,
          data: updatedBinDetail,
        }
      } else {
        // Create a new document
        const newBinDetail = new RouteAreaBinDetail({
          RouteDetailBinId: cmd.RouteDetailBinId,
          RouteDetailId: cmd.RouteDetailId,
          BinID: cmd.BinID,
          RouteID: cmd.RouteID,
          AreaID: cmd.AreaID,
          SerialNo: cmd.SerialNo,
          Timing: cmd.Timing,
          CreatedBy: cmd.CreatedBy,
          UpdatedBy: cmd.UpdatedBy,
          CreatedOn: cmd.CreatedOn,
          UpdatedOn: cmd.UpdatedOn,
        });

        await newBinDetail.save();
        results.push({
          action: 'added',
          message: `"${newBinDetail.RouteDetailBinId}" has been successfully added.`,
          data: newBinDetail,
        });
      }
    }

    // Aggregate results
    const addedCount = results.filter((item) => item.action === 'added').length;
    const updatedCount = results.filter((item) => item.action === 'updated').length;

    return {
      isSuccess: 'success',
      statusCode: StatusCodes.OK,
      message: `Successfully added ${addedCount} record(s) and updated ${updatedCount} record(s).`,
      data: results,
    };
  } catch (err) {
    return {
      isSuccess: 'failed',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
    };
  }
  };

////////////////////////////// GetBinManageQuery //////////////////////////////////////////


export const GetBinManageQuery = async (model) => {

  try {
  const { pageNo, pageSize} = model;
    const pipeline = [
      {
        $lookup: {
          from: 'RouteAreaBinDetail',
          localField: 'RouteID',
          foreignField: 'RouteID',
          as: 'RouteAreaBinDetail',
        },
      },
      { $unwind: { path: '$RouteAreaBinDetail', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'BinLocation',
          localField: 'RouteAreaBinDetail.BinID',
          foreignField: 'BinLocID',
          as: 'RouteAreaBinDetail.BinLocation',
        },
      },
      { $unwind: { path: '$RouteAreaBinDetail.BinLocation', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          RouteID: 1,
          RouteName: { $ifNull: ['$RouteName', ''] },
          Description: { $ifNull: ['$Description', ''] },
          RouteDate: { $ifNull: ['$RouteDate', null] },
          CreatedBy: { $ifNull: ['$CreatedBy', ''] },
          UpdatedBy: { $ifNull: ['$UpdatedBy', ''] },
          CreatedOn: { $ifNull: ['$CreatedOn', null] },
          UpdatedOn: { $ifNull: ['$UpdatedOn', null] },
          'RouteAreaBinDetail.RouteDetailBinId': 1,
          'RouteAreaBinDetail.RouteID': 1,
          'RouteAreaBinDetail.BinLocation': {
            BinLocID: { $ifNull: ['$RouteAreaBinDetail.BinLocation.BinLocID', null] },
            BinLocName: { $ifNull: ['$RouteAreaBinDetail.BinLocation.BinLocName', ''] },
            BinLocCode: { $ifNull: ['$RouteAreaBinDetail.BinLocation.BinLocCode', ''] },
            Latitude: { $ifNull: ['$RouteAreaBinDetail.BinLocation.Latitude', null] },
            Longitude: { $ifNull: ['$RouteAreaBinDetail.BinLocation.Longitude', null] },
            LocationName: { $ifNull: ['$RouteAreaBinDetail.BinLocation.LocationName', ''] },
            LocImage: { $ifNull: ['$RouteAreaBinDetail.BinLocation.LocImage', null] },
            Description: { $ifNull: ['$RouteAreaBinDetail.BinLocation.Description', ''] },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          RouteID: { $first: '$RouteID' },
          RouteName: { $first: '$RouteName' },
          Description: { $first: '$Description' },
          RouteDate: { $first: '$RouteDate' },
          CreatedBy: { $first: '$CreatedBy' },
          UpdatedBy: { $first: '$UpdatedBy' },
          CreatedOn: { $first: '$CreatedOn' },
          UpdatedOn: { $first: '$UpdatedOn' },
          RouteAreaBinDetail: { $push: '$RouteAreaBinDetail' },
        },
      },
      { $skip: (pageNo - 1) * pageSize },
      { $limit: parseInt(pageSize, 10) },
    ];

    const data = await Route.aggregate(pipeline);
    const rowCount = await Route.countDocuments();
    return { 
      isSuccess:'success',
      statusCode: StatusCodes.OK,
      message: 'Data fetched successfully',
      data: data,
      pageNo:pageNo, 
      pageSize:pageSize,
      rowCount:rowCount };
      
  } catch (error) {
    throw new Error(`Error in GetBinManageQuery: ${error.message}`);
  }
};

