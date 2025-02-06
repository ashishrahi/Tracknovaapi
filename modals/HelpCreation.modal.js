import mongoose from 'mongoose';



const helpCreateSchema = new mongoose.Schema({

  Id: { type: Number, required: true, unique: true }, 
  formatName: { type: String, required: true, maxlength: 300 },
  height: { type: mongoose.Decimal128, required: true },
  width: { type: mongoose.Decimal128, required: true },
  roundedCorner: { type: String, required: true, default: 'N', enum: ['Y', 'N'] },
  variableBackSide: { type: String, required: true, default: 'N', enum: ['Y', 'N'] },
  frontDesign: { type: String, required: true },
  backDesign: { type: String, default: null },
  entryDate: { type: Date, default: Date.now },
  Page_Name: { type: String, maxlength: 100, default: null },
  ReportFor: { type: String, maxlength: 20, default: null },
  PageTitleId: { type: Number, default: null },
}, { timestamps: true });



export const HelpCreate = mongoose.model('HelpCreate', helpCreateSchema);

