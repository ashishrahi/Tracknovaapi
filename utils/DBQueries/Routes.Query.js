import { Route,RouteAreaBinDetail,BinLocation,RouteAreaDetail} from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

////////////////////////////////////////// AddUpdateRoutesQuery //////////////////////////////////////////////////////////////////

export const AddUpdateRoutesQuery = async (model) => {
    try {
        if (model.routeID === 0) {
          // Check if route already exists
          const existingRoute = await Route.findOne({ RouteName: model.routeName });
          if (existingRoute) {
            return {
              status: 0,
              message: `Route with ${existingRoute.RouteName} name already exists!`,
            };
          }
    
          // Create new route ID by incrementing the last RouteID
          const lastRoute = await Route.findOne({}).sort({ RouteID: -1 });
          model.routeID = (lastRoute?.RouteID || 0) + 1;
    
          const newRoute = new Route({
            RouteID: model.routeID,
            RouteName: model.routeName || '',
            RouteDate: model.routeDate,
            UpdatedBy: model.updatedBy,
            Description: model.description,
            CreatedBy: model.createdBy,
          });
    
          await newRoute.save();
    
          if (model.RouteAreaDetail && model.RouteAreaDetail.length > 0) {
            let routeDetailID = await RouteAreaDetail.findOne({}).sort({ RouteDetailId: -1 });
            let routeBinDetailID = await RouteAreaBinDetail.findOne({}).sort({ RouteDetailBinId: -1 });
    
            routeDetailID = routeDetailID?.RouteDetailId || 0;
            routeBinDetailID = routeBinDetailID?.RouteDetailBinId || 0;
    
            for (const area of model.RouteAreaDetail) {
              routeDetailID += 1;
              const routeAreaDetail = new RouteAreaDetail({
                RouteDetailId: routeDetailID,
                RouteID: model.routeID,
                CreatedBy: model.createdBy,
                UpdatedBy: model.updatedBy,
                AreaID: area.areaID,
              });
    
              await routeAreaDetail.save();
    
              if (model.routeAreaDetail && model.routeAreaDetail.length > 0) {
                const routeBins = model.RouteAreaBinDetail.filter(bin => bin.AreaID === area.areaID);
    
                for (const bin of routeBins) {
                  routeBinDetailID += 1;
                  const routeAreaBinDetail = new RouteAreaBinDetail({
                    RouteDetailBinId: routeBinDetailID,
                    RouteDetailId: routeDetailID,
                    RouteID: model.routeID,
                    Timing: bin.timing,
                    SerialNo: bin.serialNo,
                    BinSelect: bin.binSelect,
                    BinID: bin.binID,
                    AreaID: bin.areaID,
                    CreatedBy: model.createdBy,
                    UpdatedBy: model.updatedBy,
                  });
    
                  await routeAreaBinDetail.save();
                }
              }
            }
          }
    
          return {
            status: 1,
            message: `Route ${newRoute.RouteName} successfully created!`,
            data: model,
          };
        } else {
          // Update existing route
          const existingRoute = await Route.findOne({ RouteID: model.routeID });
          if (!existingRoute) {
            return {
              status: 0,
              message: `Route ${existingRoute.RouteID} not found!`,
            };
          }
    
          existingRoute.RouteDate = model.routeDate;
          existingRoute.Description = model.description;
          existingRoute.RouteName = model.routeName;
          existingRoute.CreatedBy = model.createdBy;
          existingRoute.UpdatedBy = model.updatedBy;
    
          await existingRoute.save();
    
          // Remove existing details before updating
          await RouteAreaDetail.deleteMany({ RouteID: model.routeID });
          await RouteAreaBinDetail.deleteMany({ RouteID: model.routeID });
    
          if (model.RouteAreaDetail && model.RouteAreaDetail.length > 0) {
            let routeDetailID = await RouteAreaDetail.findOne({}).sort({ RouteDetailId: -1 });
            let routeBinDetailID = await RouteAreaBinDetail.findOne({}).sort({ RouteDetailBinId: -1 });
    
            routeDetailID = routeDetailID?.RouteDetailId || 0;
            routeBinDetailID = routeBinDetailID?.RouteDetailBinId || 0;
    
            for (const area of model.RouteAreaDetail) {
              routeDetailID += 1;
              const routeAreaDetail = new RouteAreaDetail({
                RouteDetailId: routeDetailID,
                RouteID: model.routeID,
                CreatedBy: model.createdBy,
                UpdatedBy: model.UpdatedBy,
                AreaID: area.areaID,
              });
    
              await routeAreaDetail.save();
    
              const routeBins = model.RouteAreaBinDetail.filter(bin => bin.AreaID === area.areaID);
              for (const bin of routeBins) {
                routeBinDetailID += 1;
                const routeAreaBinDetail = new RouteAreaBinDetail({
                  RouteDetailBinId: routeBinDetailID,
                  RouteDetailId: routeDetailID,
                  RouteID: model.routeID,
                  Timing: bin.timing,
                  SerialNo: bin.serialNo,
                  BinSelect: bin.binSelect,
                  BinID: bin.binID,
                  AreaID: bin.areaID,
                  CreatedBy: model.createdBy,
                  UpdatedBy: model.updatedBy,
                });
    
                await routeAreaBinDetail.save();
              }
            }
          }
    
          return {
            status: 1,
            message: `Route ${Route.RouteName} successfully updated!`,
            data: model,
          };
        }
      } catch (error) {
        return {
          status: 0,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message,
        };
      }
}


/////////////////////////////////////////// GetRoutesQuery //////////////////////////////////////////////////////////////////

export const GetRoutesQuery = async (model) => {
  try {
    const { where, pageNo, pageSize } = model;

    // Ensure RouteID is an ObjectId to prevent buffer issues
    if (where?.RouteID && typeof where.RouteID === 'string') {
        where.RouteID = new mongoose.Types.ObjectId(where.RouteID);
    }

    let pipeline = [
        { $match: where || {} }, // Default to empty filter if `where` is undefined

        // Lookup RouteAreaBinDetail
        {
            $lookup: {
                from: 'RouteAreaBinDetail',
                let: { routeId: '$RouteID' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$RouteID', '$$routeId'] } } },
                    {
                        $lookup: {
                            from: 'BinLocation',
                            let: { binId: '$BinID' },
                            pipeline: [
                                { $match: { $expr: { $eq: ['$BinLocID', '$$binId'] } } }
                            ],
                            as: 'binLocation'
                        }
                    }
                ],
                as: 'routeAreaBinDetail'
            }
        },

        // Lookup RouteAreaDetail
        {
            $lookup: {
                from: 'RouteAreaDetail',
                let: { routeDetailId: '$routeAreaBinDetail.RouteDetailId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$RouteDetailId', '$$routeDetailId'] } } }
                ],
                as: 'routeAreaDetail'
            }
        },

        {
            $facet: {
                data: pageNo > 0 && pageSize > 0
                    ? [{ $skip: (pageNo - 1) * pageSize }, { $limit: pageSize }]
                    : [],
                rowCount: [{ $count: 'total' }]
            }
        }
    ];

    // Execute aggregation
    const result = await Route.aggregate(pipeline).exec(); // No need for `.lean()`

    // Extract data and total count
    const rawData = result[0]?.data || [];
    const rowCount = result[0]?.rowCount?.[0]?.total || 0;

    // Function to convert keys to lowercase first letter
    function formatKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => formatKeys(item));
        } else if (obj !== null && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                    key.charAt(0).toLowerCase() + key.slice(1), 
                    formatKeys(value)
                ])
            );
        }
        return obj;
    }

    const formattedData = formatKeys(rawData);

    return {
        status: 1,
        message: 'routes fetched successfully',
        data: formattedData,
        pageNo,
        pageSize,
        rowCount
    };
} catch (err) {
    return {
        status: 0,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message
    };
}

      }

//////////////////////////////////////////// DeleteRoutesQuery //////////////////////////////////////////////////////////////////

export const DeleteRoutesQuery = async (model) => {
    try {
        const routeInAreaDetail = await RouteAreaDetail.findOne({ RouteID: model.routeID });
        if (routeInAreaDetail) {
          return {
            status: 0,
            message: `Route ID ${routeInAreaDetail.RouteID} is used in RouteAreaDetail, so it can't be deleted.`,
          };
        }
    
        // Check if RouteID is used in RouteAreaBinDetail
        const routeInBinDetail = await RouteAreaBinDetail.findOne({ RouteID: model.routeID });
        if (routeInBinDetail) {
          return {
            status: 0,
            message: "Route ID is used in RouteAreaBinDetail, so it can't be deleted.",
          };
        }
    
        // Find the route to delete
        const route = await Route.findOne({ RouteID: model.routeID });
        if (!route) {
          return {
            status: 0,
            message: ` Route ${route.RouteID} not found`,
          };
        }
    
        // Delete the route
        await Route.deleteOne({ RouteID: model.routeID });
    
        return {
          status: 1,
          message: `Route ${model.routeID} deleted successfully`,
        };
      } catch (error) {
        return {
          status: 0,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message,
        };
      }
      }
    
