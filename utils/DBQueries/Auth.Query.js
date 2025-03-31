import {
  UserPermission,
  RolePermission,
  Menu,
  AspNetRoles,
  EmpMaster,
  AspNetUsers,
} from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "../apiResponse/index.js";
import { getTenantDBModels } from "../../db/index.js";
import formattedData from "../dotnet-like-format/dotnetLikeData.js";


//-----------------loginQuery-------->
export const loginQuery = async (model) => {
  const { AspNetUsers, EmpMaster, AspNetRoles } = await getTenantDBModels();
  try {
    const { username, password } = model;
    console.log(model);

    let response;
    // Find user by username
    // console.log("req.db", req.db)
    // const AspNetUsers = req.db.models("AspNetUsers");
    // const AspNetUsers = mongoose.model("AspNetUsers");
    const user = await AspNetUsers.findOne({ UserName: username });
    // console.log("user is", user)
    // // console.log("real user", user)
    if (!user) {
      throw new ApiErrorResponse(
        StatusCodes.UNAUTHORIZED,
        "Invalid Username or Password"
      );
    }

    // Check password
    // const isPasswordValid = await user.isValidPassword(password);
    // console.log("isPasswordValid: ",isPasswordValid)
    // if (!isPasswordValid) {
    //   return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Invalid Username or Password"));
    // }

    // AspUser => EmpMaster => RoleId
    const empRoleId = await EmpMaster.findOne({ UserId: user.Id }).select(
      "RoleId"
    );
    // console.log("empROleid", empRoleId)
    // // Fetch user roles
    const roles = await AspNetRoles.find({
      Id: {
        $in: [empRoleId.RoleId],
        // ["82763a68-4d8d-4358-96a5-c2d2981e3d0a"]
        // emp.RoleId
      },
    });
    // console.log("roles: ", roles)
    const rolesString = roles.map((role) => role.Name);
    // console.log("rolesString", rolesString)
    // return rolesString;

    // Fetch user permissions
    // const userPermissions = await UserPermission.find({UserId: user.Id}).lean();
    // console.log("userPermissions: ", userPermissions)
    // if (!userPermissions) {
    //     return next(StatusCodes.BAD_REQUEST, "Failed to fetch user permissions");
    // }

    const userPermissions = await GetUserPermissionMasterQuery({
      userId: user.Id,
      // user.Id
    });
    // console.log("user permission:", userPermissions)
    if (!userPermissions) {
      throw new ApiErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Failed to fetch user permissions"
      );
    }

    // Generate JWT Token
    const authClaims = {
      id: user.Id,
      username: user.UserName,
      roles: rolesString,
    };
    // console.log(userPermissions);
    // const token = jwt.sign(authClaims, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "5y", // Token expires in 5 years
    // });

    response = {
      // status: 1,
      // message: "Login Successful",

      // message: "Login Successful",

      token: user.generateAccessToken(),
      expiration: Number(process.env.ACCESS_TOKEN_EXPIRY) / 1000, // 5 years
      isSuccess: true,
      message: "Login Successful",
      data: {
        userDetail: {
          id: user.Id,
          userName: user.UserName,
          email: user.Email,
          phoneNumber: user.PhoneNumber,
          roles: rolesString, // ["User"]//
        },
        permissions: userPermissions?.data, //formattedData(userPermissions),
      },
    };
    // console.log("response from query", response)
    return { response: response, refreshToken: user.generateRefreshToken() };
  } catch (error) {
    console.log("Login Error: ", error);
    throw new ApiErrorResponse(
      error.StatusCode,
      error.ErrorMessage || error.message
    );
    // return next(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
    // return res.status(500).json({ status: "Failed", message: "An error occurred during login", error: error.message });
  }
};

//---------------RegisterQuery---------->

export const RegisterQuery = async (model, res) => {
  try {
    const { AspNetUsers } = await getTenantDBModels();

    // Check if user already exists
    const userExists = await AspNetUsers.findOne({ UserName: model.username });

    if (userExists) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(
          new ApiErrorResponse(
            StatusCodes.CONFLICT,
            "UserId or UserName already exists! Try other one."
          )
        );
    }
    console.log("asp user", model);
    // Create new user
    const newUser = new AspNetUsers({
      Id: model.id,
      UserName: model.username,
      Email: model.email,
      PasswordHash: model.password,
      // securityStamp: new Date().toISOString(),
      // role: model.role || "user", // Default role if none provided
    });

    // Save user to database
    const savedNewUser = await newUser.save();
    if (!savedNewUser) {
      throw new ApiErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create a new user."
      );
    }

    return savedNewUser;
    // return res.status(StatusCodes.CREATED).json(new ApiSuccessResponse(true, StatusCodes.CREATED, "User created successfully!", savedNewUser))
  } catch (err) {
    throw err;
    // const error = new Error(err.message);
    // error.status = err.statusCode || StatusCodes.BAD_REQUEST;
    // return next(error);
  }
};

//-------------GetUserPermissionQuery-------->

export const GetUserPermissionQuery = async (model) => {
  try {
    const { RolePermission, UserPermission } = await getTenantDBModels();

    const { userId, roleId } = model || {};

    if (!userId || !roleId) {
      throw new Error("Missing required parameters: userId or roleId");
    }

    // Fetch Role Permissions with Menu details
    const rolePermissions = await RolePermission.aggregate([
      {
        $lookup: {
          from: "Menu",
          localField: "MenuId",
          foreignField: "MenuId",
          as: "menuDetails",
        },
      },
      {
        $unwind: {
          path: "$menuDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          RoleId: roleId,
          IsView: true,
          "menuDetails.IsMenu": true,
        },
      },
      {
        $project: {
          MenuId: "$menuDetails.MenuId",
          MenuName: "$menuDetails.MenuName",
          ParentId: "$menuDetails.ParentId",
          IsAdd: "$IsAdd",
          IsEdit: "$IsEdit",
          IsDel: "$IsDel",
          IsView: "$IsView",
          IsPrint: "$IsPrint",
          IsExport: "$IsExport",
          IsRelease: "$IsRelease",
          IsPost: "$IsPost",
        },
      },
    ]);

    // Fetch User-Specific Permissions
    const userPermissions = await UserPermission.find({ UserId: userId });

    // Merge Role and User Permissions
    const result = rolePermissions.map((rolePermission) => {
      const userPermission = userPermissions.find(
        (u) => u.MenuId.toString() === rolePermission.MenuId.toString()
      );
      return {
        UserId: userId,
        MenuId: rolePermission.MenuId,
        MenuName: rolePermission.MenuName,
        ParentId: rolePermission.ParentId,
        IsAdd: userPermission?.IsAdd ?? rolePermission.IsAdd ?? 0,
        IsEdit: userPermission?.IsEdit ?? rolePermission.IsEdit ?? 0,
        IsDel: userPermission?.IsDel ?? rolePermission.IsDel ?? 0,
        IsView: userPermission?.IsView ?? rolePermission.IsView ?? 0,
        IsPrint: userPermission?.IsPrint ?? rolePermission.IsPrint ?? 0,
        IsExport: userPermission?.IsExport ?? rolePermission.IsExport ?? 0,
        IsRelease: userPermission?.IsRelease ?? rolePermission.IsRelease ?? 0,
        IsPost: userPermission?.IsPost ?? rolePermission.IsPost ?? 0,
      };
    });

    // Sort the result by MenuName
    result.sort((a, b) => a.MenuName.localeCompare(b.MenuName));

    // Return the successful response
    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: "User Permission Details fetched successfully",
      data: result,
      rowCount: result.length,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////// addUpdateUserPermissionMasterQuery //////////////////////////////////

export const AddUpdateUserPermissionMasterQuery = async (
  userId, // It is a uuid
  userPermission // it is a array of permissions
) => {
  try {
    const { UserPermission } = await getTenantDBModels();

    const deleted = await UserPermission.deleteMany({ UserId: userId });
    console.log("userPermission", userPermission);
    const newPermissions = userPermission.map((permission) => ({
      UserId: permission.userId,
      ParentId: permission.parentId,
      MenuId: permission.menuId,
      IsAdd: permission.isAdd || false,
      IsDel: permission.isDel || false,
      IsEdit: permission.isEdit || false,
      IsExport: permission.isExport || false,
      IsPost: permission.isPost || false,
      IsPrint: permission.isPrint || false,
      IsRelease: permission.isRelease || false,
      IsView: permission.isView || false,
    }));

    if (newPermissions.length === 0) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.NOT_IMPLEMENTED,
        message: "No permission found",
      };
    }

    const result = await UserPermission.insertMany(newPermissions);

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: "User Permission Details updated successfully",
      data: result,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: error.statusCode || StatusCodes.BAD_REQUEST,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  GetUserPermissionMaster  ////////////////////////////////////////////////////////////////

export const GetUserPermissionMasterQuery = async (modal) => {
  try {
    const { UserPermission } = await getTenantDBModels();
    const { userId } = modal;

    if (userId === "-1") {
      const usersPermission = await UserPermission.find().lean();

      return {
        isSuccess: 1,
        id: userId,
        createUpdate: "",
        msg: "User Permission Details fetched successfully",
        data: usersPermission.length,
      };
    } else {
      const data = await UserPermission.aggregate([
        {
          $match: {
            UserId: userId,
          },
        },
        {
          $lookup: {
            from: "Menu", // MenuMasters collection name
            localField: "MenuId",
            foreignField: "MenuId",
            as: "menuDetails",
          },
        },
        { $unwind: "$menuDetails" }, // Flatten the menuDetails array
        {
          $lookup: {
            from: "Menu",
            localField: "ParentId",
            foreignField: "MenuId",
            as: "parentMenuDetails",
          },
        },
        {
          $unwind: {
            path: "$parentMenuDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            UserId: 1,
            MenuId: 1,
            MenuName: "$menuDetails.MenuName",
            ParentId: 1,
            ParentMenuName: "$parentMenuDetails.MenuName",
            IsAdd: 1,
            IsEdit: 1,
            IsDel: 1,
            IsView: 1,
            IsPrint: 1,
            IsExport: 1,
            IsRelease: 1,
            IsPost: 1,
          },
        },
        {
          $sort: { MenuId: 1 },
        },
      ]);
      // Convert first letter of each key to lowercase for every object in the array
      const formatedData = formattedData(data);
      return {
        isSuccess: 1,
        id: userId,
        createUpdate: "",
        msg: "User Permission Details fetched successfully",
        data: formatedData,
      };
    }
  } catch (error) {
    return {
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: error.message,
    };
  }
};

//////////////////////////////////////////////  GetUserPermissionList  ////////////////////////////////////////////////////////////////

export const GetUserPermissionListQuery = async (modal) => {
  try {
    const { userId } = modal;
    const { UserPermission } = await getTenantDBModels();

    const userPermissions = await UserPermission.aggregate([
      {
        $match: {
          UserId: userId,
        },
      },
      {
        $group: {
          _id: "$UserId", // Group by UserId
        },
      },
      {
        $lookup: {
          from: "AspNetUsers", // Collection name for users
          localField: "_id", // Field in the UserPermission collection
          foreignField: "Id", // Matching field in the users collection
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "EmpMaster", // Collection name for role masters
          localField: "userDetails.Id", // Field in the users collection
          foreignField: "UserId", // Matching field in the role masters collection
          as: "roleDetails",
        },
      },
      {
        $unwind: {
          path: "$roleDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          UserId: "$_id",
          RoleId: "$roleDetails.RoleId",
          UserName: "$userDetails.UserName",
        },
      },
    ]);

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: "User Permission List fetched successfully",
      data: userPermissions,
    };
  } catch (error) {
    return {
      isSuccess: "failed",
      statusCode: 500,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  DeleteUserPermissionMaster  ////////////////////////////////////////////////////////////////

export const DeleteUserPermissionMasterQuery = async (modal) => {
  try {
    const { userId } = modal;
    const { UserPermission } = await getTenantDBModels();

    const permissions = await UserPermission.find({ UserId: userId });

    if (permissions.length > 0) {
      await UserPermission.deleteMany({ UserId: userId });

      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `UserId ${userId} Successfully deleted`,
      };
    } else {
      return {
        isSuccess: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: `UserId ${userId} does not exist`,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  AddUpdateRoleMaster  ////////////////////////////////////////////////////////////////

export const AddUpdateRoleMasterQuery = async (modal) => {
  // const { roleId, roleName, normalizedRoleName, rolePermissions } = modal;
  const { AspNetRoles } = await getTenantDBModels();

  // try {
  //   let roleMaster = await AspNetRoles.findOne({Id: roleId });

  //   // Check if the role exists
  //   if (roleMaster) {
  //     // Role exists, update it
  //     roleMaster.Id = roleId
  //     roleMaster.Name = roleName;
  //     roleMaster.NormalizedName = normalizedRoleName; // You can customize this

  //     await roleMaster.save();

  //     const updatedRole = {
  //       id: roleMaster.Id,
  //       name: roleMaster.Name,
  //       normalizedName: roleMaster.NormalizedName,
  //     }

  //     // Remove old permissions and add new ones
  //     await RolePermission.deleteMany({RoleId: roleId });

  //     const permissions = rolePermissions.map(permission => ({
  //       ...permission,
  //       roleId
  //     }));
  //     const data = await RolePermission.insertMany(permissions);

  //     return{
  //       status: 1,
  //       message: `Role ${roleName} updated successfully`,
  //       data: updatedRole
  //     }
  //   } else {
  //     // Role doesn't exist, create a new role
  //     const newRoleMaster = new AspNetRoles({
  //       Id: crypto.randomUUID(),
  //       Name:roleName,
  //       NormalizedName: normalizedRoleName
  //     });

  //     await newRoleMaster.save();

  //     const insertedRole = {
  //       id: newRoleMaster.Id,
  //       name: newRoleMaster.Name,
  //       normalizedName: newRoleMaster.NormalizedName,
  //     }

  //     // Insert permissions

  //     const permissions = rolePermissions.map(permission => ({
  //       ...permission,
  //       roleId: newRoleMaster.roleId
  //     }));
  //      await RolePermission.insertMany(permissions);

  //    return{
  //     status: 1,
  //      message: `Role ${roleName} created successfully`,
  //      data:insertedRole

  //     }
  //    }

  // } catch (err) {
  //  return{
  //    status: 0,
  //    message: err.message,
  //  }
  // }

  try {
    let rtd = { isSuccess: false, mesg: "" };

    // Check if role already exists (when adding a new role)

    if (!modal.roleId) {
      const roleExists = await AspNetRoles.findOne({ Name: modal.roleName });
      if (roleExists) {
        throw new ApiErrorResponse(
          StatusCodes.CONFLICT,
          "Role already exists!"
        );
        // rtd.mesg = "Role already exists!";
        // return rtd;
      }
    }
    // If updating an existing role
    let updatedRole;

    if (modal.roleId) {
      updatedRole = await AspNetRoles.findOneAndUpdate(
        { Id: modal.roleId },
        {
          $set: {
            Name: modal?.roleName || undefined,
            NormalizedName: modal?.roleName?.toUpperCase() || undefined,
          },
        },
        { new: true, upsert: false }
      );

      if (!updatedRole) {
        throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Role not found!");
        // rtd.mesg = "Role not found!";
        // return rtd;
      }
      // First delete all the permissions
      await RolePermission.deleteMany({
        RoleId: modal.roleId,
      });

      // const alert = modal.rolePermissions.filter((menu) => menu.menuName = "Alert")
      // console.log("Alert is:",alert);

      // Update role permissions efficiently
      const bulkOpsForUpdatingPermission = modal?.rolePermissions?.map(
        (perm) => {
          const updateFields = {
            RoleId: modal.roleId,
            MenuId: perm.menuId,
            ParentId: perm.parentId,
            IsAdd: perm.isAdd,
            IsEdit: perm.isEdit,
            IsDel: perm.isDel,
            IsView: perm.isView,
            IsPrint: perm.isPrint,
            IsExport: perm.isExport,
            IsPost: perm.isPost,
            IsRelease: perm.isRelease,
          };

          return updateFields;
        }
      );

      if (bulkOpsForUpdatingPermission.length > 0) {
        await RolePermission.insertMany(bulkOpsForUpdatingPermission);
      }
    } else {
      // Insert new role
      console.log("for upsert permission", modal);
      modal.Id = crypto.randomUUID();
      updatedRole = new AspNetRoles({
        Id: modal.Id,
        Name: modal.roleName,
        NormalizedName: modal.roleName.toUpperCase(),
      });
      await updatedRole.save();

      if (modal.rolePermissions?.length > 0) {
        const bulkOps = modal?.rolePermissions?.map((perm) => ({
          insertOne: {
            document: {
              RoleId: modal.Id,
              MenuId: perm.menuId,
              ParentId: perm.parentId,
              IsAdd: perm.isAdd,
              IsEdit: perm.isEdit,
              IsDel: perm.isDel,
              IsView: perm.isView,
              IsPrint: perm.isPrint,
              IsExport: perm.isExport,
              isPost: perm.isPost,
              IsRelease: perm.isRelease,
            },
          },
        }));

        await RolePermission.bulkWrite(bulkOps);
      }
    }

    // Insert new role permissions using bulkWrite

    rtd.isSuccess = true;
    rtd.mesg = modal.roleId ? "Successfully Updated" : "Successfully Added";
    return rtd;
  } catch (error) {
    console.log(error);
    throw new ApiErrorResponse(error.StatusCode, error.ErrorMessage);
  }
};

//////////////////////////////////////////////  GetRoleMaster  ////////////////////////////////////////////////////////////////

export const GetRoleMasterQuery = async () => {
  try {
    const roles = await AspNetRoles.find().sort({ Name: 1 });

    const roleList = roles.map((role) => {
      return {
        id: role.Id,
        name: role.Name,
        normalizedName: role.NormalizedName,
      };
    });

    return {
      status: 1,
      message: "Roles fetched successfully",
      data: roleList,
    };
  } catch (error) {
    return {
      status: 0,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  Delete / RoleMaster  ////////////////////////////////////////////////////////////////

export const DeleteRoleMasterQuery = async (modal) => {
  try {
    const { RoleId } = modal;
    // console.log('RoleId: ', RoleId);
    const roleExists = await AspNetRoles.findOne({ Id: RoleId });

    if (!roleExists) {
      return {
        status: 0,
        message: `RoleID  Not Found!`,
      };
    }

    // Delete the role
    await AspNetRoles.findOneAndDelete({ Id: RoleId });

    await RolePermission.deleteMany({ RoleID: RoleId });

    return {
      status: 1,
      message: `RoleID  deleted successfully`,
    };
  } catch (error) {
    return {
      status: 0,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  AddUpdate / RolePermissionMaster  ////////////////////////////////////////////////////////////////

export const AddUpdateRolePermissionMasterQuery = async (modal) => {
  try {
    const { roleId } = modal;

    // Validation: RoleId required
    if (!roleId || roleId === "0") {
      return {
        isSuccess: 0,
        internalSuccess: "Created",
        mesg: "Role ID is required",
        insertedId: "",
        data,
      };
    }

    // Check if role exists
    let role = await RolePermission.findOne({ RoleId: roleId });

    if (role) {
      // Update role
      role.RoleId = roleId;
      await role.save();

      const updatedRole = {
        roleId: role.RoleId,
        menuId: role.MenuId,
        parentMenuId: role.ParentId,
        isAdd: role.IsAdd,
        isDel: role.IsDel,
        isEdit: role.IsEdit,
        isExport: role.IsExport,
        isPost: role.IsPost,
        isPrint: role.IsPrint,
        isRelease: role.IsRelease,
        isView: role.IsView,
        menuName: role.MenuName,
      };

      return {
        isSuccess: 1,
        internalSuccess: "true",
        mesg: "Role details updated successfully",
        insertedId: "",
        data: updatedRole,
      };
    } else {
      // Generate new RoleId
      let tempZoneID = 1;
      if (modal.roleId === "-1" || modal.roleId === "0") {
        const maxRole = await RolePermission.find()
          .sort({ RoleId: -1 })
          .limit(1);
        tempZoneID = maxRole.length ? parseInt(maxRole[0].RoleId) + 1 : 1;
      }

      // Create new role
      const newRole = new RolePermission({
        RoleId: tempZoneID.toString(),
        MenuId: modal.menuId,
        ParentId: modal.parentId,
        IsAdd: modal.IsAdd,
        IsDel: modal.IsDel,
        IsEdit: modal.IsEdit,
        IsExport: modal.IsExport,
        IsPost: modal.IsPost,
        IsPrint: modal.IsPrint,
        IsRelease: modal.IsRelease,
        IsView: modal.IsView,
        MenuName: modal.menuName,
      });
      await newRole.save();

      const newRolePermission = {
        roleId: tempZoneID,
        menuId: newRole.MenuId,
        parentId: newRole.ParentId,
        isAdd: newRole.IsAdd,
        isDel: newRole.IsDel,
        isEdit: newRole.IsEdit,
        isExport: newRole.IsExport,
        isPost: newRole.IsPost,
        isPrint: newRole.IsPrint,
        isRelease: newRole.IsRelease,
        isView: newRole.IsView,
        menuName: newRole.MenuName,
      };
      return {
        isSuccess: 1,
        internalSuccess: "Created",
        mesg: `Role ${tempZoneID} Created Successfully  `,
        insertedId: "",
        data: newRolePermission,
      };
    }
  } catch (error) {
    return {
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};

//////////////////////////////////////////////  Get / RolePermissionMaster  ////////////////////////////////////////////////////////////////

export const GetRolePermissionMasterQuery = async (modal) => {
  try {
    const { RoleId } = modal;

    if (RoleId === "-1") {
      const data = await RolePermission.find({}).lean();
      const roleList = data.map((role) => {
        return {
          roleId: role.RoleId,
          isAdd: role.IsAdd,
          isDel: role.IsDel,
          isEdit: role.IsEdit,
          isExport: role.IsExport,
          isPost: role.IsPost,
          isPrint: role.IsPrint,
          isRelease: role.IsRelease,
          isView: role.IsView,
          menuName: role.MenuName,
        };
      });

      return {
        isSuccess: true,
        internalSuccess: "",
        mesg: "Role Permission fetched successfully",
        insertedId: "",
        data: roleList,
      };
    } else {
      const data = await RolePermission.findOne({ RoleId: RoleId }).lean();
      const oneData = {
        roleId: data.RoleId,
        isAdd: data.IsAdd,
        isDel: data.IsDel,
        isEdit: data.IsEdit,
        isExport: data.IsExport,
        isPost: data.IsPost,
        isPrint: data.IsPrint,
        isRelease: data.IsRelease,
        isView: data.IsView,
        menuName: role.MenuName,
      };
      return {
        isSuccess: true,
        internalSuccess: "",
        mesg: `RoleID ${data.RoleId} Details of Role Permission fetched successfully`,
        insertedId: "",
        data: oneData,
      };
    }
  } catch (error) {
    return {
      isSuccess: 0,
      internalSuccess: "",
      mesg: error.message,
    };
  }
};

//////////////////////////////////////////////  Get / RolePermission  ////////////////////////////////////////////////////////////////

export const GetRolePermissionQuery = async (modal) => {
  // try {
  const { RoleId } = modal;
  let data;

  if (RoleId !== "-1") {
    data = await RolePermission.aggregate([
      {
        $match: {
          RoleId: RoleId,
        },
      },
      {
        $lookup: {
          // ✅ Join with RolePermission table
          from: "Menu",
          localField: "MenuId",
          foreignField: "MenuId",
          as: "permissions",
        },
      },
      {
        $unwind: {
          path: "$permissions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          // ✅ Return required fields and set default permissions to 0
          _id: 0,
          RoleId: 1,
          MenuId: 1,
          MenuName: "$permissions.MenuName",
          ParentId: 1,
          IsAdd: 1,
          IsEdit: 1,
          IsDel: 1,
          IsView: 1,
          IsPrint: 1,
          IsExport: 1,
          IsRelease: 1,
          IsPost: 1,
        },
      },
      {
        $sort: {
          MenuName: 1,
        },
      },
    ]);

    return {
      status: 1,
      message: `RoleID ${data.RoleId} Details of Role Permission fetched successfully`,
      data: formattedData(data),
      rowCount: data?.length,
    };
  } else {
    data = await Menu.find().sort({ MenuName: 1 }).lean();

    // const newData = data.map((role) => {
    //   return {
    //     roleId: role.RoleId,
    //     menuId: role.MenuId,
    //     parentMenuId: role.ParentId,
    //     isAdd: role.IsAdd,
    //     isDel: role.IsDel,
    //     isEdit: role.IsEdit,
    //     isExport: role.IsExport,
    //     isPost: role.IsPost,
    //     isPrint: role.IsPrint,
    //     isRelease: role.IsRelease,
    //     isView: role.IsView,
    //     menuName: role.MenuName
    //   }
    // })

    const rowCount = data.length;

    return {
      status: 1,
      message: `RoleID ${data.RoleId} Details of Role Permission fetched successfully`,
      data: formattedData(data),
      rowCount: rowCount,
    };

    // } catch (error) {
    //   return{
    //     status: 0,
    //     message: error.message,
    //   }
    // }
  }
};
