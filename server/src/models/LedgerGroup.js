const mongoose = require('mongoose');

const ledgerGroupSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  alias: {
    type: String,
    required: true,
    trim: true
  },
  accountType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccountType',
    required: true
  },
  remarks: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ledgerGroupSchema.index({ project: 1, groupName: 1 }, { unique: true });

module.exports = mongoose.model('LedgerGroup', ledgerGroupSchema);

