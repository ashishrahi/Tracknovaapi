import { StatusCodes } from "http-status-codes";
import { DeviceType } from "../../modals/DeviceType.modal.js"; 

///////////////////////////////// GetDeviceTypeQuery //////////////////////////////////////////

export const GetDeviceTypeQuery = async (model) => {
    try {
        // const { pageNo, pageSize } = model;
        // const skip = (pageNo - 1) * pageSize;
    
        // Query to get DeviceType data
        const deviceTypes = await DeviceType.find().select("-_id").lean();
          // .skip(skip)
          // .limit(pageSize);
    
// <<<<<<< HEAD
//         const rowCount = deviceTypes.length;

//         const response = deviceTypes.map((obj) => {
//           let newObj = {};
//           Object.keys(obj).forEach((key) => {
//             let newKey = key.charAt(0).toLowerCase() + key.slice(1);
//             newObj[newKey] = obj[key];
//           });
//           return newObj;
//         });
    
//         return  {
//           message:`Device types fetched successfully`,
//           data:response,
// =======
    const deviceTypesList = deviceTypes.map((deviceType)=>{
      return{
        id:deviceType.Id,
        dtype:deviceType.dtype,
        CreatedOn:deviceType.createdAt,
        updatedOn:deviceType.updatedAt,
      }
    })



        const rowCount = await DeviceType.countDocuments();
    
        return  {
          status:1,
          message:`${model.pageNo} of ${model.pageSize} Device types fetched successfully`,
          data:deviceTypesList,
          pageNo:pageNo,
          pageSize:pageSize,
// >>>>>>> ashish
          rowCount:rowCount,
         };
          
      } catch (err) {
        return {
          isSuccess: 0,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: err.message,
        };
      }

}

