import { UnitMaster } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";
import { getTenantDBModels } from "../../db/index.js";

/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const AddUpdateUnitMasterQuery = async (modal) => {
  try {
    const { UnitMaster } = await getTenantDBModels();

    // Validate required fields
    if (!modal.unitName || modal.unitName.trim() === "") {
      return {
        isSuccess: false,
        internalSuccess: "",
        mesg: "Unit Name is required",
      };
    }

    // Check if the unit exists based on UnitId
    const existingUnit = await UnitMaster.findOne({ UnitId: modal.unitId });

    if (existingUnit) {
      // Update existing unit
      existingUnit.UnitName = modal.unitName;
      existingUnit.UnitShortname = modal.unitShortname;
      existingUnit.UpdatedBy = modal.updatedBy;

      const unit = await existingUnit.save();

      const UpdatedData = {
        unitId: unit.UnitId,
        unitName: unit.UnitName,
        unitShortname: unit.UnitShortname,
        createdBy: unit.CreatedBy,
        updatedBy: unit.UpdatedBy,
      };

      return {
        isSuccess: true,
        internalSuccess: "",
        mesg: `Unit Master ${UpdatedData.unitName} data updated successfully`,
        insertedId: "",
        data: UpdatedData,
      };
    }

    // Assign a new UnitId if necessary
    let newUnitId = modal.unitId;

    if (!newUnitId || newUnitId <= 0) {
      const unitIds = await UnitMaster.find().select("UnitId").lean();
      newUnitId =
        unitIds.length > 0
          ? Math.max(...unitIds.map((unit) => unit.UnitId)) + 1
          : 1;
    }

    // Check if the UnitName already exists
    const existingUnitByName = await UnitMaster.findOne({
      UnitName: modal.unitName,
    });
    if (existingUnitByName) {
      return {
        isSuccess: false,
        internalSuccess: "",
        mesg: "Unit Name already exists",
      };
    }

    // Create and save the new unit
    const newUnit = new UnitMaster({
      UnitId: newUnitId,
      UnitName: modal.unitName,
      UnitShortname: modal.unitShortname,
      CreatedBy: modal.createdBy,
      UpdatedBy: modal.updatedBy,
    });

    await newUnit.save();

    const newData = {
      unitId: newUnit.UnitId,
      unitName: newUnit.UnitName,
      unitShortname: newUnit.UnitShortname,
      createdBy: newUnit.CreatedBy,
      updatedBy: newUnit.UpdatedBy,
    };

    return {
      isSuccess: true,
      internalSuccess: "",
      mesg: `Unit Master ${newData.unitName} data added successfully`,
      insertedId: "",
      data: newData,
    };
  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: "",
      mesg: `Error in AddUpdateUnitMasterQuery: ${error.message}`,
    };
  }
};

/////////////////////////////////////////// ImportUnitsQuery //////////////////////////////////////////////////////////////////

export const ImportUnitsQuery = async (modal) => {
  try {
    const { UnitMaster } = await getTenantDBModels();
    let inserted = 0;
    let skipped = 0;
    //Iteration of Model
    for (const unit of modal) {
      const existing = await UnitMaster.findOne({ UnitName: unit.unitName });
      //  Check Unit exist
      if (existing) {
        skipped++;
        continue;
      }

      // Find lastUnit and increment value
      const lastUnit = await UnitMaster.findOne().sort({ UnitId: -1 }).limit(1);
      const nextUnitId = lastUnit ? lastUnit.UnitId + 1 : 1;

      // Insert new Unit
      await UnitMaster.create({
        UnitId: nextUnitId,
        UnitName: unit.unitName,
        UnitShortname: unit.unitShortname,
      });
      inserted++;
    }
    return {
      isSuccess: true,
      mesg: `CSV import successful`,
      inserted,
      skipped,
    };


  } catch (error) {
    console.error("CSV Import Failed:", error);
    return {
      isSuccess: false,
      statusCode: 500,
      msg: error.message,
    };
  }
};

/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const GetUnitMasterQuery = async (modal) => {
  try {
    const { UnitMaster } = await getTenantDBModels();

    if (modal.unitId == -1) {
      const data = await UnitMaster.find();

      const datList = data.map((unit) => {
        return {
          unitId: unit.UnitId,
          unitName: unit.UnitName,
          unitShortname: unit.UnitShortname,
          createdBy: unit.CreatedBy,
          updatedBy: unit.UpdatedBy,
          createdOn: unit.createdAt,
          updatedOn: unit.updatedAt,
        };
      });

      return {
        isSuccess: true,
        internalSuccess: StatusCodes.OK,
        mesg: "List of Unit Master Data fetched successfully",
        insertedId: "",
        data: datList,
      };
    } else {
      const x = await UnitMaster.findOne({ UnitId: modal.unitId });
      return {
        isSuccess: true,
        internalSuccess: StatusCodes.OK,
        mesg: `Unit Master data with id ${modal.unitId} fetched successfully`,
        insertedId: "",
        data: x,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: `Error in GetUnitMasterQuery: ${error.message}`,
    };
  }
};

/////////////////////////////////////////// AddUpdateTaxMasterQuery //////////////////////////////////////////////////////////////////

export const DeleteUnitMasterQuery = async (modal) => {
  try {
    const { UnitMaster } = await getTenantDBModels();

    const units = await UnitMaster.find({ UnitId: modal.unitId });
    const unit = units.map((u)=>u.UnitName)
    if (units.length > 0) {
      await UnitMaster.deleteMany({ UnitId: modal.unitId });
      return {
        isSuccess: true,
        internalSuccess: StatusCodes.OK,
        mesg: `${unit} has been deleted successfully`,
      };
    } else {
      return {
        isSuccess: false,
        internalSuccess: StatusCodes.NOT_FOUND,
        mesg: `UnitMaster with id ${modal.unitId} not found`,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      internalSuccess: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg: `Error in DeleteUnitMasterQuery: ${error.message}`,
    };
  }
};
