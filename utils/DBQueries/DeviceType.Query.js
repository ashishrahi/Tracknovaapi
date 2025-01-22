import { DeviceType } from "../../modals/DeviceType.model.js"; 

///////////////////////////////// GetDeviceTypeQuery //////////////////////////////////////////

export const GetDeviceTypeQuery = async (model) => {
    try {
        const { pageNo, pageSize } = model;
        const skip = (pageNo - 1) * pageSize;
    
        // Query to get DeviceType data
        const deviceTypes = await DeviceType.find()
          .skip(skip)
          .limit(pageSize);
    
        const rowCount = await DeviceType.countDocuments();
    
        return  {
          isSuccess:'success',
          statusCode: 200,
          message:`${model.pageNo} of ${model.pageSize} Device types fetched successfully`,
          data:deviceTypes,
          pageNo:pageNo,
          pageSize:pageSize,
          rowCount:rowCount,
         };
          
      } catch (err) {
        console.error(err);
        return {
          status: 'failed',
          message: 'An error occurred while fetching device types.',
        };
      }

}

