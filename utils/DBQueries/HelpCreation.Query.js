import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";

////////////////////////////////////////////////// AddHelpCreationQuery //////////////////////////////////////////////////////////////////

export const AddHelpCreationQuery = async (model) => {
  try {
    const { HelpCreate } = await getTenantDBModels();

    let {
      formatName,
      height,
      width,
      roundedCorner,
      variableBackSide,
      frontDesign,
      backDesign,
      entryDate,
      page_Name,
      ReportFor,
      pageTitleId,
    } = model;
    // Check if a document with the given PageTitleId exists
    let existingEntry = await HelpCreate.findOne({ PageTitleId: pageTitleId });

    if (existingEntry) {
      // Update existing entry
      existingEntry.formatName = formatName;
      existingEntry.height = height;
      existingEntry.width = width;
      existingEntry.roundedCorner = roundedCorner;
      existingEntry.variableBackSide = variableBackSide;
      existingEntry.frontDesign = frontDesign;
      existingEntry.backDesign = backDesign;
      existingEntry.Page_Name = page_Name;

      await existingEntry.save();
      return {
        isSuccess: true,
        internalSuccess: "true",
        mesg: "Record updated successfully",
        insertedId: "",
      };
    } else {
      // Insert new entry
      const lastRecord = await HelpCreate.findOne()
        .sort({ PageTitleId: -1 })
        .exec();
      pageTitleId = (lastRecord?.PageTitleId ?? 0) + 1;
      const newEntry = new HelpCreate({
        formatName,
        height,
        width,
        roundedCorner,
        variableBackSide,
        frontDesign,
        backDesign,
        entryDate,
        Page_Name: page_Name,
        ReportFor,
        PageTitleId: pageTitleId,
      });

      await newEntry.save();

      const newData = {
        formatName: newEntry.formatName,
        height: newEntry.height,
        width: newEntry.width,
        roundedCorner: newEntry.roundedCorner,
        variableBackSide: newEntry.variableBackSide,
        frontDesign: newEntry.frontDesign,
        backDesign: newEntry.backDesign,
        page_Name: newEntry.Page_Name,
        pageTitleId: newEntry.PageTitleId,
      };

      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: "Record added successfully",
        insertedId: "",
        data: newData,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: `Error in AddHelpCreationQuery: ${error.message}`,
    };
  }
};

////////////////////////////////////////////////// GetHelpCreationQuery //////////////////////////////////////////////////////////////////

export const GetHelpCreationQuery = async (model) => {
  try {
    const { HelpCreate } = await getTenantDBModels();
    const { pageTitleId } = model;

    if (pageTitleId === -1) {
      const data = await HelpCreate.find().lean();
      const getData = data.map((help) => {
        return {
          id: help.Id,
          formatName: help.formatName,
          height: help.height,
          width: help.width,
          roundedCorner: help.roundedCorner,
          variableBackSide: help.variableBackSide,
          frontDesign: help.frontDesign,
          backDesign: help.backDesign,
          page_Name: help.Page_Name,
          pageTitleId: help.PageTitleId,
        };
      });
      return {
        isSuccess: true,
        internalSuccess: StatusCodes.OK,
        mesg: "List of Help Creation Data fetched successfully",
        insertedId: "",
        data: getData,
      };
    } else {
      data = await HelpCreate.findOne({ PageTitleId: pageTitleId }).lean();
      if (!data) {
        return {
          isSuccess: false,
          internalSuccess: StatusCodes.NOT_FOUND,
          mesg: `No Help Creation Data found for Page Title Id ${pageTitleId}`,
          insertedId: "",
          data: null,
        };
      }
    }

    return {
      isSuccess: true,
      internalSuccess: StatusCodes.OK,
      mesg: `Help Creation Data ${
        pageTitleId === -1 ? "list" : `of Page Title Id ${pageTitleId}`
      } fetched successfully`,
      insertedId: "",
      data: data,
    };
  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: error.message,
      insertedId: "",
    };
  }
};
