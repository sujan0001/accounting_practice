const mongoose = require('mongoose');

const generalLedgerSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  ledgerName: {
    type: String,
    required: true,
    trim: true
  },
  alias: {
    type: String,
    required: true,
    trim: true
  },
  ledgerGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LedgerGroup',
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

generalLedgerSchema.index({ project: 1, ledgerName: 1 }, { unique: true });

module.exports = mongoose.model('GeneralLedger', generalLedgerSchema);

