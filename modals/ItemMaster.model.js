import mongoose from "mongoose";

const ItemMasterSchema = new mongoose.Schema(
  {
    ItemMasterId: { type: Number, required: true },
    ItemName: {
      type: String,
      required: true,
      trim: true,
      set: (value) => {
        return value
          .split(" ") // Split string into words
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ) // Capitalize each word
          .join(" ");
      },
    },
    ItemCode: { type: String },
    ItemCategoryId: { type: Number },
    ItemFlag: { type: String, uppercase: true, trim: true },
    ItemTypeId: { type: Number },
    EmpId: { type: Number },
    TaxId: { type: Number },
    PurchaseYear: { type: Number },
    UnitId: { type: Number },
    ModelNo: { type: String },
    SerialNo: { type: String },
    VehicleNo: { type: String, required: true },
    ChesisNo: { type: String },
    QCApplicable: { type: Boolean },
    HSNCode: { type: String },
    VehicleWeight: { type: Number },
    DepreciationRate: { type: Number },
    CreatedBy: { type: String },
    UpdatedBy: { type: String },
    CreatedOn: { type: Date },
    UpdatedOn: { type: Date },
    VehicleTypeId: { type: Number },
    FuelTypeId: { type: Number },
    BrandTypeId: { type: Number },
    Mileage: { type: Number },
    VZoneID: { type: Number },
    devid: { type: String },
    KmPerLitre: { type: Number },
    LitrePerHr: { type: Number },
    ZoneName: { type: String },
    rfid: { type: String },
    NTRecord: { type: String },
    TankCapacity: { type: Number },
    Rfid2: { type: String },
    FuelAlloted: { type: Number },
    SimNo: { type: String, required: true, trim: true},
    deptId: { type: Number },
    DeviceTypeId: { type: Number },
    SimType: { type: String },
    SimCompany: { type: String },
  },
  { collection: "ItemMaster" }
);

export const ItemMaster = mongoose.model("ItemMaster", ItemMasterSchema);
