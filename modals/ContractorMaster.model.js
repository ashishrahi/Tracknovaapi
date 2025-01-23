import mongoose from "mongoose";

const ContractorMasterSchema = new mongoose.Schema({
    Id: {
        type: Number,
        required: true,
        unique: true
    },
    ContractorId: {
        type: Number,
        required: true,
        // unique: true
    },
    ItemId: {
        type: Number,
        required: true,
        // unique: true
    },
    Name: {
        type: String,
        required: true,
        // unique: true
    },
}, { timestamps: true, collection: "ContractorMaster"});

const ContractorMaster = mongoose.model("ContractorMaster", ContractorMasterSchema);

export default ContractorMaster;