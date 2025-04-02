import { StatusCodes } from "http-status-codes";
import { getCentralDBModels } from "../../db/index.js";

export const getCitybyState = async (stateId) => {
  try {
    const { CityMaster } = await getCentralDBModels();


    const stateList = await CityMaster.find({StateId: stateId})
    //  const newList = stateList.map((statename)=>statename.StateName)
    return {
      isSuccess: true,
      internalSuccess: "",
      mesg: "City fetched successfully",
      insertedId: "",
      data: stateList,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
    };
  }
};