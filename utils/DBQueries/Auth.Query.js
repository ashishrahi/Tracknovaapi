import {
  UserPermission,
  RolePermission,
  Menu,
  AspNetRoles,
  EmpMaster,
  AspNetUsers
} from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "../apiResponse/index.js";
import jwt from "jsonwebtoken"
import formattedData from "../dotnet-like-format/dotnetLikeData.js";


//-----------------loginQuery-------->
export const loginQuery = async (model, next) => {
  try {
    const { username, password } = model;

    // Find user by username
    const user = await AspNetUsers.findOne({ UserName: username });
    console.log("real user", user)
    // if (!user) {
    //     return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Invalid Username or Password"));
    // }

    // Check password
    // const isPasswordValid = await user.isValidPassword(password);
    // console.log("isPasswordValid: ",isPasswordValid)
    // if (!isPasswordValid) {
    //   return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Invalid Username or Password"));
    // }
    
    // AspUser => EmpMaster => RoleId
    // const emp = await EmpMaster.findOne({UserId: user.Id});
    // // Fetch user roles
    const roles = await AspNetRoles.find(
      { Id: { $in: 
        ["82763a68-4d8d-4358-96a5-c2d2981e3d0a"]
       // emp.RoleId

       } }
    );
    const rolesString = roles.map(role => role.Name)
    console.log("rolesString", rolesString)
    // return rolesString;

    // Fetch user permissions
    // const userPermissions = await UserPermission.find({UserId: user.Id});
    // if (!userPermissions) {
    //     return next(StatusCodes.BAD_REQUEST, "Failed to fetch user permissions");
    // }

    const userPermissions = await  GetUserPermissionMasterQuery({userId: '82763a68-4d8d-4358-96a5-c2d2981e3d0a'
      // user.Id
    })
    if (!userPermissions) {
      return next(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Failed to fetch user permissions"));
    }

    // Generate JWT Token
    const authClaims = {
        id: user.Id,
        username: user.UserName,
        roles: rolesString,
    };
    // console.log(userPermissions);
    const token = jwt.sign(authClaims, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5y", // Token expires in 5 years
    });
    let response;
     response = {
        // status: 1,
        // message: "Login Successful",
       
        // message: "Login Successful",
        
          token:  token,
          expiration: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // 5 years
          isSuccess: true,
          message: "Login Successful",
          data: {
            userDetail: {
              id: user.Id,
              userName: user.UserName,
              email: user.Email,
              phoneNumber: user.PhoneNumber,
              roles: ["User"]// rolesString,
        },
        permissions: formattedData(userPermissions?.data),
          }
          
        
    };

    return response;
} catch (error) {
  // console.log("Login Error: ", error);
  return next(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
    // return res.status(500).json({ status: "Failed", message: "An error occurred during login", error: error.message });
}


  //-----------------OLD CODE
//   try {
//     const { username, password } = model;
//     if( !username || !password || !(username && password) ){
//       throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please provide valid username & password")
//     }
//     // Find user in MongoDB
//     const user = await AspNetUsers.findOne({ UserName: username });

//     if (!user) {
//         throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid username or password");
//     }

//     // Compare password with hashed password in DB
//     const isMatch = await user.isValidPassword(password);
//     if (!isMatch) {
//       throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid username or password");
//     }

//     const accessToken = await user.generateAccessToken();
//     const refreshToken = await user.generateRefreshToken();

//     return {
//         status: "Success",
//         message: "Login successful",
//         accessToken: accessToken,
//         refreshToken: refreshToken
//     };
// } catch (error) {
//     throw error;
// }

}

//---------------RegisterQuery---------->

export const RegisterQuery = async (model, res) => {
  try {
    // Check if user already exists
    const userExists = await AspNetUsers.findOne({ UserName: model.username });

    if (userExists) {
      return res.status(StatusCodes.CONFLICT).json(new ApiErrorResponse( StatusCodes.CONFLICT, "User already exists!")) ;
    }

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
      { $unwind: {
        path: "$menuDetails",
        preserveNullAndEmptyArrays: true
      } },
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
  userId,
  userPermission
) => {
  try {
    const deleted = await UserPermission.deleteMany({ UserId: userId });

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
    const { userId } = modal;

    if (userId === "-1") {
      const usersPermission = await UserPermission.find().lean();

      return {
        isSuccess: 1,
        id: userId,
        createUpdate:"",
        msg: "User Permission Details fetched successfully",
        data: usersPermission,
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
        { $unwind:{
          path: "$parentMenuDetails",
          preserveNullAndEmptyArrays: true,}
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
      ]);
     // Convert first letter of each key to lowercase for every object in the array
const formatedData = formattedData(data)
      return {
        isSuccess: 1,
        id: userId,
        createUpdate:"",
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
        $unwind:{ 
          path:"$userDetails",
          preserveNullAndEmptyArrays: false
        }
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
          UserId: '$_id',
         RoleId: '$roleDetails.RoleId',
         UserName: '$userDetails.UserName',
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
  const { roleId, roleName,normalizedRoleName,rolePermissions } = modal;
  try {
    let roleMaster = await AspNetRoles.findOne({Id: roleId });

    // Check if the role exists
    if (roleMaster) {
      // Role exists, update it
      roleMaster.Id = roleId
      roleMaster.Name = roleName;
      roleMaster.NormalizedName =normalizedRoleName; // You can customize this

      await roleMaster.save();


      const updatedRole = {
        id: roleMaster.Id,
        name: roleMaster.Name,
        normalizedName: roleMaster.NormalizedName,
      }



      // Remove old permissions and add new ones
      await RolePermission.deleteMany({RoleId: roleId });

      const permissions = rolePermissions.map(permission => ({
        ...permission,
        roleId
      }));
      const data = await RolePermission.insertMany(permissions);


      return{
        status: 1,
        message: `Role ${roleName} updated successfully`,
        data: updatedRole
      }
    } else {
      // Role doesn't exist, create a new role
      const newRoleMaster = new AspNetRoles({
        Id: crypto.randomUUID(),
        Name:roleName,
        NormalizedName: normalizedRoleName
      });

      await newRoleMaster.save();

      const insertedRole = {
        id: newRoleMaster.Id,
        name: newRoleMaster.Name,
        normalizedName: newRoleMaster.NormalizedName,
      }
      


      // Insert permissions

      const permissions = rolePermissions.map(permission => ({
        ...permission,
        roleId: newRoleMaster.roleId
      }));
       await RolePermission.insertMany(permissions);


     return{
      status: 1,
       message: `Role ${roleName} created successfully`,
       data:insertedRole

      }
     }
    
  } catch (err) {
   return{
     status: 0,
     message: err.message,
   }
  }
  };


//////////////////////////////////////////////  GetRoleMaster  ////////////////////////////////////////////////////////////////

export const GetRoleMasterQuery = async () => {
  try {
    const roles = await AspNetRoles.find().sort({ Name: 1 });

    const roleList = roles.map((role)=>{
      return{
        id: role.Id,
        name: role.Name,
        normalizedName:role.NormalizedName
      }
    })

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
    console.log('RoleId: ', RoleId);
    const roleExists = await AspNetRoles.findOne({Id: RoleId });

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
       return{
        isSuccess: 0,
        internalSuccess:"Created",
        mesg: "Role ID is required",
        insertedId:"",
        data
       }
    }

    // Check if role exists
    let role = await RolePermission.findOne({ RoleId:roleId });

    if (role) {
        // Update role
        role.RoleId = roleId;
        await role.save();

const updatedRole ={
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
  menuName: role.MenuName
}


        return{
          isSuccess: 1,
          internalSuccess: "true",
          mesg: "Role details updated successfully",
          insertedId:"",
          data: updatedRole,
        }
    } else {
        // Generate new RoleId
        let tempZoneID = 1;
        if (modal.roleId === "-1" || modal.roleId === "0") {
            const maxRole = await RolePermission.find().sort({ RoleId: -1 }).limit(1);
            tempZoneID = maxRole.length ? parseInt(maxRole[0].RoleId) + 1 : 1;
        }

        // Create new role
        const newRole = new RolePermission({ RoleId: tempZoneID.toString(),
          MenuId:modal.menuId,
          ParentId:modal.parentId,
          IsAdd: modal.IsAdd,
          IsDel: modal.IsDel,
          IsEdit: modal.IsEdit,
          IsExport: modal.IsExport,
          IsPost: modal.IsPost,
          IsPrint: modal.IsPrint,
          IsRelease: modal.IsRelease,
          IsView: modal.IsView,
          MenuName:modal.menuName
         });
        await newRole.save();

const newRolePermission = {
  roleId: tempZoneID,
  menuId:newRole.MenuId,
  parentId:newRole.ParentId,
  isAdd: newRole.IsAdd,
  isDel: newRole.IsDel,
  isEdit: newRole.IsEdit,
  isExport: newRole.IsExport,
  isPost: newRole.IsPost,
  isPrint: newRole.IsPrint,
  isRelease: newRole.IsRelease,
  isView: newRole.IsView,
  menuName:newRole.MenuName
}
    return{
          isSuccess: 1,
          internalSuccess: "Created",
          mesg: `Role ${tempZoneID} Created Successfully  `,
          insertedId:"",
          data: newRolePermission,
        }
    }
} catch (error) {
    return{
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    }
}
};

//////////////////////////////////////////////  Get / RolePermissionMaster  ////////////////////////////////////////////////////////////////

export const GetRolePermissionMasterQuery = async (modal) => {
  try {
    const { roleId } = modal;

    if (roleId === "-1") {
      const data = await RolePermission.find({}).lean();
      const roleList = data.map((role)=>{
        return{
          roleId: role.RoleId,
          isAdd: role.IsAdd,
          isDel:role.IsDel,
          isEdit:role.IsEdit,
          isExport:role.IsExport,
          isPost:role.IsPost,
          isPrint:role.IsPrint,
          isRelease:role.IsRelease,
          isView:role.IsView,
          menuName:role.MenuName
        }
      })

      return {
        isSuccess: true,
        internalSuccess:"",
        mesg: "Role Permission fetched successfully",
        insertedId:"",
        data: roleList,
      };
    } else {
      const data = await RolePermission.findOne({ RoleId: roleId }).lean();
      const oneData ={
        roleId: data.RoleId,
        isAdd: data.IsAdd,
        isDel:data.IsDel,
        isEdit:data.IsEdit,
        isExport:data.IsExport,
        isPost:data.IsPost,
        isPrint:data.IsPrint,
        isRelease:data.IsRelease,
        isView:data.IsView,
        menuName:role.MenuName

      }
      return {
        isSuccess: true,
        internalSuccess:"",
        mesg: `RoleID ${data.RoleId} Details of Role Permission fetched successfully`,
        insertedId:"",
        data: oneData,
      };
    }
  } catch (error) {
    return {
      isSuccess: 0,
      internalSuccess:"",
      mesg: error.message,
    };
  }
};

//////////////////////////////////////////////  Get / RolePermission  ////////////////////////////////////////////////////////////////

export const GetRolePermissionQuery = async (modal) => {
  try {
    const { RoleId } = modal;
    let data;

    // if (RoleId === "-1") {
      data = await Menu.aggregate([
        {
            $match: { IsMenu: true } // Filtering menus that are actual menus
        },
        {
            $lookup: {
                from: "RolePermission",
                let: { menuId: "$MenuId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$MenuId", "$$menuId"] },
                                    { $eq: ["$RoleId", RoleId] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                          IsAdd: { $ifNull: ["$IsAdd", 0] },
                          IsEdit: { $ifNull: ["$IsEdit", 0] },
                          IsDel: { $ifNull: ["$IsDel", 0] },
                          IsView: { $ifNull: ["$IsView", 0] },
                          IsPrint: { $ifNull: ["$IsPrint", 0] },
                          IsExport: { $ifNull: ["$IsExport", 0] },
                          IsRelease: { $ifNull: ["$IsRelease", 0] },
                          IsPost: { $ifNull: ["$IsPost", 0] }
                        }
                    }
                ],
                as: "rolePermission"
            }
        },
        {
            $unwind: {
                path: "$rolePermission",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
              _id: 0,
              roleId: RoleId,
              menuId: "$MenuId",
              menuName: "$MenuName",
              parentId: "$ParentId",
              isAdd: { $ifNull: ["$rolePermission.IsAdd", 0] },
              isEdit: { $ifNull: ["$rolePermission.IsEdit", 0] },
              isDel: { $ifNull: ["$rolePermission.IsDel", 0] },
              isView: { $ifNull: ["$rolePermission.IsView", 0] },
              isPrint: { $ifNull: ["$rolePermission.IsPrint", 0] },
              isExport: { $ifNull: ["$rolePermission.IsExport", 0] },
              isRelease: { $ifNull: ["$rolePermission.IsRelease", 0] },
              isPost: { $ifNull: ["$rolePermission.IsPost", 0] }
            }
        },
        {
            $sort: { MenuName: 1 } // Ordering by MenuName
        }
    ]);

    return{
      status: 1,
      message: `RoleID ${data.RoleId} Details of Role Permission fetched successfully`,
      data: data,
      rowCount:data?.length

    }

    return;
    // } else {
        data = await RolePermission.find({ RoleId: RoleId }).lean();

        const newData = data.map((role)=>{
          return{
            roleId: role.RoleId,
            menuId: role.MenuId,
            parentMenuId: role.ParentId,
            isAdd: role.IsAdd,
            isDel:role.IsDel,
            isEdit: role.IsEdit,
            isExport: role.IsExport,
            isPost: role.IsPost,
            isPrint: role.IsPrint,
            isRelease: role.IsRelease,
            isView: role.IsView,
            menuName: role.MenuName
          }
        })

        const rowCount = data.length;

        return{
          status: 1,
          message: `RoleID ${data.RoleId} Details of Role Permission fetched successfully`,
          data: newData,
          rowCount:rowCount

        }
    

  
} catch (error) {
  return{
    status: 0,
    message: error.message,
  }
}
};
