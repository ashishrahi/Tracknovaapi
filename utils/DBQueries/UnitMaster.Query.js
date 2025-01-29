import { UnitMaster } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const AddUpdateUnitMasterQuery = async (modal) => {
    try {
        // Validate the UnitName
        if (!modal.UnitName || modal.UnitName.trim() === "") {
            return {
                isSuccess: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: "Unit Name is required"
            };
        }
    
        // Check if the unit exists based on UnitId
        const existingUnit = await UnitMaster.findOne({ UnitId: modal.UnitId });
        if (existingUnit) {
            // Update existing unit with new data
            if (modal.UnitName) existingUnit.UnitName = modal.UnitName;
            if (modal.UnitShortname) existingUnit.UnitShortname = modal.UnitShortname;
            await existingUnit.save();
    
            return {
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: "Unit Master data updated successfully",
                data: existingUnit
            };
        } else {
            // Handle the case where the unit doesn't exist and a new unit is being added
            let tempUnitId = 0;
    
            // Generate new UnitId if necessary
            if (!modal.UnitId || modal.UnitId === -1 || modal.UnitId === 0) {
                const unitIds = await UnitMaster.find().select('UnitId');
                if (unitIds.length > 0) {
                    const maxUnitId = Math.max(...unitIds.map(unit => unit.UnitId));
                    tempUnitId = maxUnitId + 1;
                } else {
                    tempUnitId = 1;
                }
                modal.UnitId = tempUnitId;
            }
    
            // Check if the UnitName already exists
            const existingUnitByName = await UnitMaster.findOne({ UnitName: modal.UnitName });
            if (existingUnitByName) {
                return {
                    isSuccess: false,
                    statusCode: StatusCodes.CONFLICT,
                    message: "Unit Name already exists"
                };
            }
    
            // Create and save the new unit
            const newUnit = new UnitMaster(modal);
            await newUnit.save();
    
            return {
                isSuccess: true,
                statusCode: StatusCodes.CREATED,
                message: `Unit Master data added successfully`,
                data: newUnit
            };
        }
    } catch (error) {
        return {
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Error in AddUpdateUnitMasterQuery: ${error.message}`
        };
    }
    
};

/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const GetUnitMasterQuery = async (modal) => {
  try {
    if (modal.UnitId == -1) {
      const data = await UnitMaster.find();
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "List of Unit Master Data fetched successfully",
        data: data,
      };
    } else {
      const x = await UnitMaster.findOne({ UnitId: modal.UnitId });
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `Unit Master data with id ${modal.UnitId} fetched successfully`,
        data: x,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Error in GetUnitMasterQuery: ${error.message}`,
    };
  }
};

/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const DeleteUnitMasterQuery = async (modal) => {
  try {
    const units = await UnitMaster.find({ UnitId: modal.UnitId });
    if (units.length > 0) {
      await UnitMaster.deleteMany({ UnitId: modal.UnitId });
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `UnitMaster with id ${modal.UnitId} deleted successfully`,
      };
    } else {
      return {
        isSuccess: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: `UnitMaster with id ${modal.UnitId} not found`,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Error in DeleteUnitMasterQuery: ${error.message}`,
    };
  }
};
