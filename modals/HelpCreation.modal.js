import mongoose from 'mongoose';

const HelpCreateSchema = new mongoose.Schema({
  formatName: {
    type: String,
    required: true,
    maxlength: 300,
  },
  height: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  roundedCorner: {
    type: String,
    // enum: ['Y', 'N'],
    default: 'N',
    required: true,
  },
  variableBackSide: {
    type: String,
    // enum: ['Y', 'N'],
    default: 'N',
    required: true,
  },
  frontDesign: {
    type: String,
    required: true,
  },
  backDesign: {
    type: String,
  },
  entryDate: {
    type: Date,
    default: Date.now,
    required: true,
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

