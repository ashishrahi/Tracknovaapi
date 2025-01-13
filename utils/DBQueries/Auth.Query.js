import { Menu,UserPermission } from "../../modals/index.js";

//////////////////////////////////////////////  GetUserPermissionQuery  ////////////////////////////////////////////////////////////////

export const GetUserPermissionQuery = async (userId) => {
    try {
      const aggregationPipeline = [
        {
          $match: {
            ...(userId !== '-2' && { UserId: userId }),
          },
        },
        {
          $lookup: {
            from: 'Menu',
            localField: 'MenuId',
            foreignField: 'MenuId',
            as: 'MenuDetails',
          },
        },
        {
          $unwind: {
            path: '$MenuDetails',
            preserveNullAndEmptyArrays: true, // Optional, based on your data
          },
        },
        {
          $lookup: {
            from: 'Menu',
            localField: 'ParentId',
            foreignField: 'MenuId',
            as: 'ParentMenuDetails',
          },
        },
        {
          $unwind: {
            path: '$ParentMenuDetails',
            preserveNullAndEmptyArrays: true, // Optional, based on your data
          },
        },
        {
          $project: {
            _id: 0,
            MenuId: '$MenuDetails._id',
            MenuName: '$MenuDetails.MenuName',
            IsAdd: '$IsAdd',
            IsEdit: '$IsEdit',
            IsDel: '$IsDel',
            IsView: '$IsView',
            IsPrint: '$IsPrint',
            IsExport: '$IsExport',
            IsRelease: '$IsRelease',
            IsPost: '$IsPost',
            Path: '$MenuDetails.PageUrl',
            Icon: '$MenuDetails.Icon',
            DisplayNo: '$MenuDetails.DisplayNo',
            ParentId: '$ParentMenuDetails._id',
            ParentMenuName: '$ParentMenuDetails.MenuName',
            ParentDisplayNo: '$ParentMenuDetails.DisplayNo',
          },
        },
        {
          $group: {
            _id: '$ParentId',
            ParentMenuName: { $first: '$ParentMenuName' },
            ParentDisplayNo: { $first: '$ParentDisplayNo' },
            ChildMenu: {
              $push: {
                MenuId: '$MenuId',
                MenuName: '$MenuName',
                IsAdd: '$IsAdd',
                IsEdit: '$IsEdit',
                IsDel: '$IsDel',
                IsView: '$IsView',
                IsPrint: '$IsPrint',
                IsExport: '$IsExport',
                IsRelease: '$IsRelease',
                IsPost: '$IsPost',
                Path: '$Path',
                Icon: '$Icon',
                DisplayNo: '$DisplayNo',
              },
            },
          },
        },
        {
          $sort: { ParentDisplayNo: 1 },
        },
      ];
  
      // Execute aggregation query
      const result = await UserPermission.aggregate(aggregationPipeline);
  
      if (result.length > 0) {
        return { ParentMenu: result };
      } else {
        return { message: 'No user permissions found' };
      }
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  };
  
//////////////////////////////////////////////// addUpdateUserPermissionMasterQuery //////////////////////////////////

export const AddUpdateUserPermissionMasterQuery = async (userId, userPermission) => {
  try {
    // Validate input
    if (!userPermission || userPermission.length === 0) {
      throw new Error("No permissions provided for update.");
    }

    console.log("Input Data Received:", { userId, userPermission });

    // Delete existing permissions
    const deleteResult = await UserPermission.deleteMany({ userId });
    console.log("Deleted Existing Permissions:", deleteResult);

    // Prepare new permissions
    const newPermissions = userPermission.map(permission => ({
      userId,
      MenuId: permission.MenuId,
      IsAdd: permission.IsAdd || false,
      IsDel: permission.IsDel || false,
      IsEdit: permission.IsEdit || false,
      IsExport: permission.IsExport || false,
      IsPost: permission.IsPost || false,
      IsPrint: permission.IsPrint || false,
      IsRelease: permission.IsRelease || false,
      IsView: permission.IsView || false,
      // ParentId: permission.ParentId || null,
    }));

    console.log("Prepared Permissions:", newPermissions);

    if (newPermissions.length === 0) {
      throw new Error("No valid permissions to insert.");
    }

    // Insert new permissions
    try {
      const result = await UserPermission.insertMany(newPermissions);
      console.log("Insert Result:", result);
      return result;
    } catch (err) {
      console.error("Error during insertMany:", err.message);
      throw err;
    }
  } catch (error) {
    console.error("Error in AddUpdateUserPermissionMasterQuery:", error.message);
    throw new Error(error.message);
  }
};


//////////////////////////////////////////////  GetUserPermissionMaster  ////////////////////////////////////////////////////////////////
