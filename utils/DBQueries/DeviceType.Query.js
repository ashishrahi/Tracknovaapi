import { StatusCodes } from "http-status-codes";
import { DeviceType } from "../../modals/DeviceType.modal.js";
import { getTenantDBModels } from "../../db/index.js";

///////////////////////////////// GetDeviceTypeQuery //////////////////////////////////////////

export const GetDeviceTypeQuery = async (model) => {
  try {
    const { DeviceType } = await getTenantDBModels();
    const { pageNo, pageSize } = model;
    const skip = (pageNo - 1) * pageSize;

    // Query to get DeviceType data
    const deviceTypes = await DeviceType.find()
      .select("-_id")
      .lean()
      .skip(skip)
      .limit(pageSize);

    const deviceTypesList = deviceTypes.map((deviceType) => {
      return {
        id: deviceType.Id,
        dtype: deviceType.dtype,
        CreatedOn: deviceType.createdAt,
        updatedOn: deviceType.updatedAt,
      };
    });

    const rowCount = deviceTypesList.length;
    const msg = rowCount > 0 ? "Data Successfully Fetched" : "No record found";

    return {
      status: 1,
      message: msg,
      data: deviceTypesList,
      rowCount: rowCount,
      pageNo: pageNo,
      pageSize: pageSize,
    };
  } catch (err) {
    return {
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
    };
  }
};
