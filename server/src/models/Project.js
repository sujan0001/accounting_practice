const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  alias: {
    type: String,
    required: true,
    trim: true
  },
  panNo: String,
  financialYearFrom: {
    type: Date,
    required: true
  },
  financialYearTo: Date,
  status: {
    type: String,
    enum: ['ongoing', 'completed'],
    default: 'ongoing'
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for uniqueness per organization
projectSchema.index({ organization: 1, projectName: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);

