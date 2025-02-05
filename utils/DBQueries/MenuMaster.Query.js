import { StatusCodes } from "http-status-codes";
import { Menu } from "../../modals/index.js";


//////////////////////// AddUpdateMenuMasterQuery /////////////////////


export const AddUpdateMenuMasterQuery = async (model) => {
    
    try {
    if (model.menuId < 0) {
        return {
            isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'MenuId should be zero or greater than zero',
        };
    }

    if (!model.menuName || model.menuName.trim() === '') {
        return {
            isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Menu Name is required',
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
                }
            },
            { new: true }
        );

        return {
            isSuccess: true,
            statusCode: StatusCodes.CREATED,
            message: `Menu ${existingMenu.MenuName} Successfully Updated`,
            data: updatedMenu,
        };
    } else {
        // Check if Menu Name already exists
        const isExists = await Menu.findOne({ MenuName: model.menuName });
        if (isExists) {
            return {
                isSuccess: false,
                statusCode: StatusCodes.CONFLICT,
                message: `Menu Name ${isExists.MenuName} already exists`,
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

        return {
            isSuccess: true,
            statusCode: StatusCodes.CREATED,
            message: `MenuName ${newMenu.MenuName} Successfully Added`,
            data: newMenu,
        };
    }
} catch (error) {
    if (error.code === 11000) {
        return {
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: `Menu Name ${newMenu.MenuName} Already Exists`,
        };
    } else {
        return {
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        };
    }
}

    
    
}

/////////////////////////  GetMenuMasterQuery //////////////////////////



export const GetMenuMasterQuery = async (model) => {
   
       try {
        
        if (model.menuId === -1) {
          const menuData = await Menu.aggregate([
            {
              $lookup: {
                from: 'Menu', // The collection name (case-sensitive)
                localField: 'ParentId',
                foreignField: 'MenuId',
                as: 'ParentMenu',
              },
            },
            {
              $unwind: {
                path: '$ParentMenu',
                preserveNullAndEmptyArrays: true, // Keep entries without a match
              },
            },
            {
              $project: {
                MenuId: 1,
                MenuName: 1,
                ParentId: 1,
                PageUrl: 1,
                Icon: 1,
                DisplayNo: 1,
                IsMenu: 1,
                IsAdd: 1,
                IsEdit: 1,
                IsDel: 1,
                IsView: 1,
                IsPrint: 1,
                IsExport: 1,
                IsRelease: 1,
                IsPost: 1,
                ChildId: 1,
                ParentName: '$ParentMenu.MenuName', // Set the parent menu's name
              },
            },
          ]);
    
          

          return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'List of Menu Data fetched successfully',
            data: menuData,
          }
        } else {
          // Fetch data based on a specific MenuId
          const menuData = await Menu.findOne({ MenuId: model.menuId }).lean();
    
          return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: `Menu ${menuData.MenuName} Details fetched successfully`,
            data: menuData,
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
//////////////////////////  GetParentMenuMasterQuery ///////////////////////////

export const GetParentMenuMasterQuery = async (model) => {
 
    try {
       
        const menus = await Menu.find({ ParentId: 0 }).lean();
        
        return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'List of Parent Menu Data fetched successfully',
            data: menus,
        }
    } catch (error) {
     
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        }
    }

}


/////////////////////////////////// GetChildMenuMasterQuery///////////////////////////////////////



export const GetChildMenuMasterQuery = async (model) => {
   
       try {
        const data = await Menu.find({ ParentId: { $ne: 0 } }).lean().exec();
       
       return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'List of Child Menu Data fetched successfully',
            data: data,
        }
      } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
        }
      }
    
}


/////////////////////////////  DeleteMenuMasterQuery ///////////////////////////



export const DeleteMenuMasterQuery = async (model) => {

  try {
    const menus = await Menu.find({ MenuId: model.menuId }).exec();

    if (menus && menus.length > 0) {
      // Delete the found menus
      await Menu.deleteMany({ MenuId: model.menuId }).exec();

      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `Menu ${model.menuId} deleted successfully`,
      };
   
    } else {
      return{
        isSuccess: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: `Menu ${model.menuId} not found`,
      }
    }
  } catch (error) {
 
    return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
    }
  }

};
