import { StatusCodes } from "http-status-codes";
import { Menu } from "../../modals/index.js";
import { getTenantDBModels } from "../../db/index.js";

//////////////////////// AddUpdateMenuMasterQuery /////////////////////

export const AddUpdateMenuMasterQuery = async (model) => {
  try {
    const { Menu } = await getTenantDBModels();

    if (model.menuId < 0) {
      return {
        isSuccess: 0,
        internalSuccess: "",
        mesg: "MenuId should be zero or greater than zero",
        insertedId: "",
      };
    }

    if (!model.menuName || model.menuName.trim() === "") {
      return {
        isSuccess: 0,
        internalSuccess: "",
        mesg: "Menu Name is required",
        insertedId: "",
      };
    }

    // Check if menu exists
    const existingMenu = await Menu.findOne({ MenuId: model.menuId });
    if (existingMenu) {
      // Update the existing menu using $set operator
      const updatedMenu = await Menu.findOneAndUpdate(
        { MenuId: model.menuId },
        {
          $set: {
            MenuName: model.menuName,
            ParentId: model.parentId,
            PageUrl: model.pageUrl,
            Icon: model.icon,
            DisplayNo: model.displayNo,
            childId: model.childId,
            parentName: model.parentName,
            IsMenu: model.isMenu ?? existingMenu.IsMenu, // If IsMenu is undefined or null, keep the existing value
            IsAdd: model.isAdd,
            IsEdit: model.isEdit,
            IsDel: model.isDel,
            IsView: model.isView,
            IsPrint: model.isPrint,
            IsExport: model.isExport,
            IsRelease: model.isRelease,
            IsPost: model.isPost,
          },
        },
        { new: true }
      );

      const updatedData = {
        menuId: updatedMenu.MenuId,
        menuName: updatedMenu.MenuName,
        parentId: updatedMenu.ParentId,
        pageUrl: updatedMenu.PageUrl,
        icon: updatedMenu.Icon,
        displayNo: updatedMenu.DisplayNo,
        childId: updatedMenu.childId,
        parentName: updatedMenu.parentName,
        isMenu: updatedMenu.IsMenu,
        isAdd: updatedMenu.IsAdd,
        isEdit: updatedMenu.IsEdit,
        isDel: updatedMenu.IsDel,
        isView: updatedMenu.IsView,
        isPrint: updatedMenu.IsPrint,
        isExport: updatedMenu.IsExport,
        isRelease: updatedMenu.IsRelease,
        isPost: updatedMenu.IsPost,
      };

      return {
        isSuccess: true,
        internalSuccess: "",
        mesg: `Menu ${existingMenu.MenuName} Successfully Updated`,
        insertedId: "",
        data: updatedData,
      };
    } else {
      // Check if Menu Name already exists
      const isExists = await Menu.findOne({ MenuName: model.menuName });
      if (isExists) {
        return {
          isSuccess: false,
          internalSuccess: "",
          mesg: `Menu Name ${isExists.MenuName} already exists`,
        };
      }

      // Generate new MenuId
      const lastMenu = await Menu.find().sort({ MenuId: -1 }).limit(1);
      const newMenuId = lastMenu.length > 0 ? lastMenu[0].MenuId + 1 : 1;

      const newMenu = new Menu({
        MenuId: newMenuId,
        MenuName: model.menuName,
        ParentId: model.parentId,
        PageUrl: model.pageUrl,
        Icon: model.icon,
        DisplayNo: model.displayNo,
        childId: model.childId,
        parentName: model.parentName,
        IsMenu: model.isMenu,
        IsAdd: model.isAdd,
        IsEdit: model.isEdit,
        IsDel: model.isDel,
        IsView: model.isView,
        IsPrint: model.isPrint,
        IsExport: model.isExport,
        IsRelease: model.isRelease,
        IsPost: model.isPost,
      });

      await newMenu.save();

      const newData = {
        menuId: newMenu.MenuId,
        menuName: newMenu.MenuName,
        parentId: newMenu.ParentId,
        pageUrl: newMenu.PageUrl,
        icon: newMenu.Icon,
        displayNo: newMenu.DisplayNo,
        childId: newMenu.childId,
        parentName: newMenu.parentName,
        isMenu: newMenu.IsMenu,
        isAdd: newMenu.IsAdd,
        isEdit: newMenu.IsEdit,
        isDel: newMenu.IsDel,
        isView: newMenu.IsView,
        isPrint: newMenu.IsPrint,
        isExport: newMenu.IsExport,
        isRelease: newMenu.IsRelease,
        isPost: newMenu.IsPost,
      };

      return {
        isSuccess: 1,
        internalSuccess: "true",
        mesg: `MenuName ${newMenu.MenuName} Successfully Added`,
        insertedId: "",
        data: newData,
      };
    }
  } catch (error) {
    if (error.code === 11000) {
      return {
        isSuccess: false,
        internalSuccess: "",
        mesg: `Menu Name ${newMenu.MenuName} Already Exists`,
      };
    } else {
      return {
        isSuccess: false,
        internalSuccess: StatusCodes.INTERNAL_SERVER_ERROR,
        mesg: error.message,
      };
    }
  }
};

/////////////////////////  GetMenuMasterQuery //////////////////////////

export const GetMenuMasterQuery = async (model) => {
  try {
    const { Menu } = await getTenantDBModels();

    if (model.menuId === -1) {
      const menuData = await Menu.aggregate([
        {
          $lookup: {
            from: "Menu", // The collection name (case-sensitive)
            localField: "ParentId",
            foreignField: "MenuId",
            as: "ParentMenu",
          },
        },
        {
          $unwind: {
            path: "$ParentMenu",
            preserveNullAndEmptyArrays: false, // Keep entries without a match
          },
        },
        {
          $project: {
            menuId: "$MenuId",
            menuName: "$MenuName",
            parentId: "$ParentId",
            pageUrl: "$PageUrl",
            icon: "$Icon",
            displayNo: "$DisplayNo",
            isMenu: "$IsMenu",
            isAdd: "$IsAdd",
            isEdit: "$IsEdit",
            isDel: "$IsDel",
            isView: "$IsView",
            isPrint: "$IsPrint",
            isExport: "$isExport",
            isRelease: "$IsRelease",
            isPost: "$IsPost",
            // ChildId: 1,
            parentName: "$ParentMenu.MenuName", // Set the parent menu's name
          },
        },
      ]);

      return {
        isSuccess: true,
        internalSuccess: "",
        mesg: "List of Menu Data fetched successfully",
        insertedId: null,
        data: menuData,
      };
    } else {
      // Fetch data based on a specific MenuId
      const menuData = await Menu.findOne({ MenuId: model.menuId }).lean();

      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `Menu ${menuData.MenuName} Details fetched successfully`,
        insertedId: "",
        data: menuData,
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
//////////////////////////  GetParentMenuMasterQuery ///////////////////////////

export const GetParentMenuMasterQuery = async (model) => {
  try {
    const { Menu } = await getTenantDBModels();

    const menus = await Menu.find({ ParentId: 0 }).lean();

    const parentMenuMaster = menus.map((parent) => {
      return {
        menuId: parent.MenuId,
        menuName: parent.MenuName,
        parentId: parent.ParentId,
        pageUrl: parent.PageUrl,
        isMenu: parent.IsMenu,
        icon: parent.Icon,
        displayNo: parent.DisplayNo,
        // isMenu:parent.IsMenu,
        isAdd: parent.IsAdd,
        isEdit: parent.IsEdit,
        isDel: parent.IsDel,
        isView: parent.IsView,
        isPrint: parent.IsPrint,
        isExport: parent.IsExport,
        isRelease: parent.IsRelease,
        childId: parent.childId,
        parentName: parent.parentName,
      };
    });

    return {
      isSuccess: 1,
      internalSuccess: null,
      mesg: "List of Parent Menu Data fetched successfully",
      insertedId: "",
      data: parentMenuMaster,
    };
  } catch (error) {
    return {
      isSuccess: 0,
      internalSuccess: null,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};

/////////////////////////////////// GetChildMenuMasterQuery///////////////////////////////////////

export const GetChildMenuMasterQuery = async (model) => {
  try {
    const { Menu } = await getTenantDBModels();

    const data = await Menu.find({ ParentId: { $ne: 0 } })
      .lean()
      .exec();

    return {
      isSuccess: 1,
      internalSuccess: "",
      mesg: "List of Child Menu Data fetched successfully",
      insertedId: "",
      data: data,
    };
  } catch (error) {
    return {
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};

/////////////////////////////  DeleteMenuMasterQuery ///////////////////////////

export const DeleteMenuMasterQuery = async (model) => {
  try {
    const { Menu } = await getTenantDBModels();

    const menus = await Menu.find({ MenuId: model.menuId }).exec();

    if (menus && menus.length > 0) {
      // Delete the found menus
      await Menu.deleteMany({ MenuId: model.menuId }).exec();

      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `Menu ${model.menuId} deleted successfully`,
      };
    } else {
      return {
        isSuccess: 0,
        internalSuccess: "",
        mesg: `Menu ${model.menuId} not found`,
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
