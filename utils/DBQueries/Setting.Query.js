////////////////////////////////////////// AddUpdateSettingQuery //////////////////////////////////////////////////////////////////

export const AddUpdateSettingQuery = async (model) => {
 
   try {
        // Check if the setting already exists by ID
        let setting = await Setting.findOne({ Id: model.Id });

        if (setting) {
            // Update existing setting
            if (model.EmailId) setting.EmailId = model.EmailId;
            if (model.EmailSecretKey) setting.EmailSecretKey = model.EmailSecretKey;
            if (model.EmailApiKay) setting.EmailApiKay = model.EmailApiKay;
            if (model.EmailStatus !== undefined) setting.EmailStatus = model.EmailStatus;

            // Save the updated setting
            await setting.save();

           return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: 'Setting Successfully Updated',
            data: setting,
            
           }
        } else {
            // If no setting found, create a new one
            if (model.Id === -1 || model.Id === null || model.Id === 0) {
                // Generate new ID
                const maxId = await Setting.findOne().sort({ Id: -1 }).select('Id');
                model.Id = maxId ? maxId.Id + 1 : 1;
            }

            // Create new setting
            const newSetting = new Setting(model);
            await newSetting.save();

          return{
            isSuccess: true,
            statusCode: StatusCodes.CREATED,
            message: 'Setting Successfully Added',
            Data: newSetting,
            
 
          }
        }
    } catch (ex) {
        result.IsSuccess = false;
        if (ex.name === 'MongoError' && ex.code === 11000) {
            return{
                isSuccess: false,
                statusCode: StatusCodes.OK,
                message: 'Setting with the same ID already exists',
 
            }
        } else {
           return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Error in AddUpdateSettingQuery: ${ex.message}`
           }
        }
    }

}

//////////////////////////////////////////// GetSettingQuery //////////////////////////////////////////////////////////////////

export const GetSettingQuery = async (model) => {

    try {
      let query = Setting.find(); 
  
  
      if (model.Id !== -1) {
        query = query.where('Id').equals(model.Id);
      }
  
      if (model.EmailId !== -1) {
        if (model.EmailId !== 0) {
          query = query.where('EmailId').equals(model.EmailId);
        }
      }
  
      // Execute query and transform the results
      const settings = await query.select('Id EmailId EmailSecretKey EmailApiKay EmailStatus').exec();
  
   
    return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: 'Settings fetched successfully',
        data: settings
      };
    
  
    } catch (err) {
      return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error fetching settings',
        error: err.message
      }
    }
  
}

///////////////////////////////////////////// DeleteSettingQuery //////////////////////////////////////////////////////////////////

export const DeleteSettingQuery = async (model) => {
  
    try {
        const settingsToDelete = await Setting.find({ _id: model.Id });

        if (settingsToDelete.length > 0) {
            await Setting.deleteMany({ _id: model.Id });

            return{
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: 'Settings deleted successfully'
            }
        } else {
            return{
                isSuccess: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: 'No settings found to delete'
            }
        }
    } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error deleting settings',
            error: error.message
        }
    }}
