import { BinLocation,Route,RouteAreaBinDetail } from "../../modals/index.js";




////////////////////////////// AddUpdateBinLocationQuery //////////////////////////////////////////


export const AddUpdateBinManageQuery = async (model) => {
 
    try {
      // Loop through RouteAreaBinDetailCmd items
      for (let i = 0; i < model.RouteAreaBinDetailCmd.length; i++) {
        const cmd = model.RouteAreaBinDetailCmd[i];
  
        // Check if the record exists
        let binDetail = await RouteAreaBinDetail.findOne({ RouteDetailBinId: cmd.RouteDetailBinId });
  
        if (binDetail) {
          // Update existing record
          binDetail = await RouteAreaBinDetail.findByIdAndUpdate(binDetail._id, {
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
          }, { new: true });
        } else {
          // Create new record
          binDetail = new RouteAreaBinDetail({
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
          await binDetail.save();
        }
  
        // Add the bin detail to the response data
        res.data = model;
      }
  
      res.status = 'Success';
      res.message = 'Successfully added or updated bin manage details';
    } catch (err) {
      res.status = 'Failed';
      res.message = err.message;
    }
  
    return res;
  };

////////////////////////////// GetBinManageQuery //////////////////////////////////////////


export const GetBinManageQuery = async (filter) => {

  try {
  const { pageNo, pageSize} = filter;
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

    const result = await Route.aggregate(pipeline);
    const rowCount = await Route.countDocuments();
    return { result, rowCount };
  } catch (error) {
    throw new Error(`Error in GetBinManageQuery: ${error.message}`);
  }
};

