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
              isSuccess: false,
              statusCode: StatusCodes.CONFLICT,
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
            isSuccess: true,
            statusCode: StatusCodes.CREATED,
            message: `Route ${newRoute.RouteName} successfully created!`,
            data: model,
          };
        } else {
          // Update existing route
          const existingRoute = await Route.findOne({ RouteID: model.routeID });
          if (!existingRoute) {
            return {
              isSuccess: false,
              statusCode: StatusCodes.NOT_FOUND,
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
            isSuccess: true,
            statusCode: StatusCodes.CREATED,
            message: `Route ${Route.RouteName} successfully updated!`,
            data: model,
          };
        }
      } catch (error) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message,
        };
      }
}


/////////////////////////////////////////// GetRoutesQuery //////////////////////////////////////////////////////////////////

export const GetRoutesQuery = async (model) => {
    try {
        const { where, parameterValues, pageNo, pageSize } = model;
        let pipeline = [
          {
            $match: where 
          },
          {
            $lookup: {
              from: 'RouteAreaBinDetail', // Assuming 'RouteAreaBinDetail' is a separate collection
              localField: 'RouteID',
              foreignField: 'RouteID',
              as: 'RouteAreaBinDetail'
            }
          },
          {
            $unwind: '$RouteAreaBinDetail' // Flatten the array if necessary
          },
          {
            $lookup: {
              from: 'BinLocation', // Assuming 'BinLocation' is another collection
              localField: 'RouteAreaBinDetail.BinID',
              foreignField: 'BinLocID',
              as: 'outeAreaBinDetail.BinLocation'
            }
          },
          {
            $lookup: {
              from: 'RouteAreaDetail', // Assuming 'RouteAreaDetail' is another collection
              localField: 'RouteAreaBinDetail.RouteDetailId',
              foreignField: 'RouteDetailId',
              as: 'RouteAreaDetail'
            }
          },
          {
            $facet: {
              data: [
                { $skip: (pageNo - 1) * pageSize },
                { $limit: pageSize },
              ],
              rowCount: [{ $count: 'total' }] // Count total rows for pagination
            }
          }
        ];
    
        // Execute aggregation
        const result = await Route.aggregate(pipeline);
    
        // Extract data and total count
        const data = result[0].data;
        const totalCount = result[0].rowCount.length > 0 ? result[0].rowCount[0].total : 0;
    
        return {
            isSuccess:true,
            statusCode: StatusCodes.OK,
            message: "Routes fetched successfully",
            data: data,
            pageNo: pageNo,
            pageSize: pageSize,
            rowCount: totalCount,
         
        };
      } catch (err) {
        return {
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message,
          };
        }
      }

//////////////////////////////////////////// DeleteRoutesQuery //////////////////////////////////////////////////////////////////

export const DeleteRoutesQuery = async (model) => {
    try {
        const routeInAreaDetail = await RouteAreaDetail.findOne({ RouteID: model.RouteID });
        if (routeInAreaDetail) {
          return {
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: `Route ID ${routeInAreaDetail.RouteID} is used in RouteAreaDetail, so it can't be deleted.`,
          };
        }
    
        // Check if RouteID is used in RouteAreaBinDetail
        const routeInBinDetail = await RouteAreaBinDetail.findOne({ RouteID: model.RouteID });
        if (routeInBinDetail) {
          return {
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: "Route ID is used in RouteAreaBinDetail, so it can't be deleted.",
          };
        }
    
        // Find the route to delete
        const route = await Route.findOne({ RouteID: model.RouteID });
        if (!route) {
          return {
            isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: "Route not found",
          };
        }
    
        // Delete the route
        await Route.deleteOne({ RouteID: model.RouteID });
    
        return {
          isSuccess: true,
          statusCode: StatusCodes.OK,
          message: `Route ${model.RouteID} deleted successfully`,
        };
      } catch (error) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error deleting route",
          error: error.message || error, // Include error message if available
        };
      }
      }
    
