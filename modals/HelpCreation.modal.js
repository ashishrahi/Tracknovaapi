import mongoose from 'mongoose';

export const HelpCreateSchema = new mongoose.Schema({
  formatName: {
    type: String,
    maxlength: 300,
  },
  height: {
    type: Number,
  },
  width: {
    type: Number,
  },
  roundedCorner: {
    type: String,
    // enum: ['Y', 'N'],
    default: 'N',
  },
  variableBackSide: {
    type: String,
    // enum: ['Y', 'N'],
    default: 'N',
  },
  frontDesign: {
    type: String,
  },
  backDesign: {
    type: String,
  },
  entryDate: {
    type: Date,
    default: Date.now,
  },
  Page_Name: {
    type: String,
    maxlength: 100,
  },
  ReportFor: {
    type: String,
    maxlength: 20,
  },
  PageTitleId: {
    type: Number,
  },
}, { timestamps: false, collection:'HelpCreate' });

export const HelpCreate = mongoose.model('HelpCreate', HelpCreateSchema);

