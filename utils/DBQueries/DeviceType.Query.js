import { StatusCodes } from "http-status-codes";
import { DeviceType } from "../../modals/DeviceType.modal.js"; 

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
          isSuccess:true,
          statusCode: StatusCodes.OK,
          message:`${model.pageNo} of ${model.pageSize} Device types fetched successfully`,
          data:deviceTypes,
          pageNo:pageNo,
          pageSize:pageSize,
          rowCount:rowCount,
         };
          
      } catch (err) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Error fetching DeviceType data',
          error: err.message,
        };
      }

}

