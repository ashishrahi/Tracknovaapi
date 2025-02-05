import { UnitMaster } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";

/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const AddUpdateUnitMasterQuery = async (modal) => {
  try {
    // Validate required fields
    if (!modal.unitName || modal.unitName.trim() === "") {
        return {
            isSuccess: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Unit Name is required"
        };
    }

    // Check if the unit exists based on UnitId
    const existingUnit = await UnitMaster.findOne({ UnitId: modal.unitId });

    if (existingUnit) {
        // Update existing unit
        existingUnit.UnitName = modal.unitName || existingUnit.UnitName;
        existingUnit.UnitShortname = modal.unitShortname || existingUnit.UnitShortname;
        existingUnit.UpdatedBy = modal.updatedBy || existingUnit.UpdatedBy;

        await existingUnit.save();

        return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: "Unit Master data updated successfully",
            data: existingUnit
        };
    } 

    // Assign a new UnitId if necessary
    let newUnitId = modal.unitId;

    if (!newUnitId || newUnitId <= 0) {
        const unitIds = await UnitMaster.find().select("UnitId").lean();
        newUnitId = unitIds.length > 0 ? Math.max(...unitIds.map(unit => unit.UnitId)) + 1 : 1;
    }

    // Check if the UnitName already exists
    const existingUnitByName = await UnitMaster.findOne({ UnitName: modal.unitName });
    if (existingUnitByName) {
        return {
            isSuccess: false,
            statusCode: StatusCodes.CONFLICT,
            message: "Unit Name already exists"
        };
    }

    // Create and save the new unit
    const newUnit = new UnitMaster({
        UnitId: newUnitId,
        UnitName: modal.unitName,
        UnitShortname: modal.unitShortname,
        CreatedBy: modal.createdBy,
        UpdatedBy: modal.updatedBy
    });

    await newUnit.save();

    return {
        isSuccess: true,
        statusCode: StatusCodes.CREATED,
        message: "Unit Master data added successfully",
        data: newUnit
    };

} catch (error) {
    console.error(`Error in AddUpdateUnitMasterQuery:`, error);
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
    if (modal.unitId == -1) {
      const data = await UnitMaster.find();
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "List of Unit Master Data fetched successfully",
        data: data,
      };
    } else {
      const x = await UnitMaster.findOne({ UnitId: modal.unitId });
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `Unit Master data with id ${modal.unitId} fetched successfully`,
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
