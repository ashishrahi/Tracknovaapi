import { HelpCreate } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";



////////////////////////////////////////////////// AddHelpCreationQuery //////////////////////////////////////////////////////////////////


export const AddHelpCreationQuery = async (model) => {

    try {
        const {
            Id,
          formatName,
          height,
          width,
          roundedCorner,
          variableBackSide,
          frontDesign,
          backDesign,
          entryDate,
          page_Name:pageName,
          ReportFor,
          pageTitleId,
        } = model;
    
        // Check if a document with the given PageTitleId exists
        let existingEntry = await HelpCreate.findOne({ PageTitleId:pageTitleId });
    
        if (existingEntry) {
          // Update existing entry
          existingEntry.formatName = formatName;
          existingEntry.height = height;
          existingEntry.width = width;
          existingEntry.roundedCorner = roundedCorner;
          existingEntry.variableBackSide = variableBackSide;
          existingEntry.frontDesign = frontDesign;
          existingEntry.backDesign = backDesign;
          existingEntry.Page_Name = pageName;
    
          await existingEntry.save();
          return{
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: "Record updated successfully",
            data: existingEntry
          }
        } else {
          // Insert new entry
          const newEntry = new HelpCreate({
            Id:Id,
            formatName,
            height,
            width,
            roundedCorner,
            variableBackSide,
            frontDesign,
            backDesign,
            entryDate,
            Page_Name:pageName,
            ReportFor,
            pageTitleId,
          });
    
          await newEntry.save();
         return{
            isSuccess: true,
            statusCode: StatusCodes.CREATED,
            message: "Record added successfully",
            data: newEntry
 
         }
        }
      } catch (error) {
        return{
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Error in AddHelpCreationQuery: ${error.message}`
        }
      }

}


////////////////////////////////////////////////// GetHelpCreationQuery //////////////////////////////////////////////////////////////////

export const GetHelpCreationQuery = async (model) => {
   try {
        const { pageTitleId } = model;


        if (pageTitleId === -1) {
          const data = await HelpCreate.find().lean();
            return{
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: 'List of Help Creation Data fetched successfully',
                data: data,
            }
        } else {
            data = await HelpCreate.findOne({PageTitleId:pageTitleId }).lean();
            if (!data) {
                return {
                    isSuccess: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: `No Help Creation Data found for Page Title Id ${pageTitleId}`,
                    data: null,
                };
            }
        }

        return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: `Help Creation Data ${pageTitleId === -1 ? 'list' : `of Page Title Id ${pageTitleId}`} fetched successfully`,
            data: data,
        };
    } catch (error) {
        return {
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error fetching Help Creation Data',
            error: error.message,
        };
    }
}
