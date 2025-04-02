import { StatusCodes } from "http-status-codes";
import { getCentralDBModels } from "../../db/index.js";

export const getStatebyCountry = async (countryId) => {
  try {
    console.log("countryId", countryId)
    const { StateMaster } = await getCentralDBModels();


    const stateList = await StateMaster.find({CountryId: countryId})
    //  const newList = stateList.map((statename)=>statename.StateName)
    return {
      isSuccess: true,
      internalSuccess: "",
      mesg: "States fetched successfully",
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