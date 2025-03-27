import mongoose from "mongoose";

const TaxMasterSchema = new mongoose.Schema(
  {
    TaxId: {
      type: Number,
      required: true,
      unique: true,
    },
    TaxName: {
      type: String,
      required: true,
      trim: true
    },
    TaxPercentage: {
      type:Number,
      required: true,
      trim: true
    },
    EffectiveDate: {
        type: mongoose.Schema.Types.Date,
        required: true,
      },
    CreatedBy: {
      type: String,
      // required: true,
      trim: true
    },
    UpdatedBy: {
      type: String,
      trim: true
    },
  },
  { timestamps: true, collection:  "TaxMaster"}
);

const TaxMaster = mongoose.model("TaxMaster", TaxMasterSchema);

export default TaxMaster;