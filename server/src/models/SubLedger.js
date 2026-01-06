const mongoose = require('mongoose');

const subLedgerSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  subLedgerName: {
    type: String,
    required: true,
    trim: true
  },
  alias: {
    type: String,
    required: true,
    trim: true
  },
  generalLedger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GeneralLedger',
    required: true
  },
  openingBalance: {
    type: Number,
    default: 0
  },
  openingBalanceType: {
    type: String,
    enum: ['debit', 'credit'],
    default: 'debit'
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

subLedgerSchema.index({ project: 1, subLedgerName: 1 }, { unique: true });

module.exports = mongoose.model('SubLedger', subLedgerSchema);

