const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  serialNo: {
    type: Number,
    required: true
  },
  generalLedger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GeneralLedger',
    required: true
  },
  subLedger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubLedger'
  },
  debitAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  creditAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  narration: String
});

const journalVoucherSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  voucherNo: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  narration: String,
  entries: [journalEntrySchema],
  totalDebit: {
    type: Number,
    required: true,
    min: 0
  },
  totalCredit: {
    type: Number,
    required: true,
    min: 0
  },
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

// CRITICAL VALIDATION: Debit must equal Credit (double-entry principle)
journalVoucherSchema.pre('save', function(next) {
  // Recalculate totals
  this.totalDebit = this.entries.reduce((sum, e) => sum + e.debitAmount, 0);
  this.totalCredit = this.entries.reduce((sum, e) => sum + e.creditAmount, 0);

  // Check balance (allow 0.01 difference for floating point)
  if (Math.abs(this.totalDebit - this.totalCredit) > 0.01) {
    return next(new Error('Journal voucher must be balanced: Total Debit must equal Total Credit'));
  }

  // Check that each entry has either debit OR credit (not both)
  for (let entry of this.entries) {
    if (entry.debitAmount > 0 && entry.creditAmount > 0) {
      return next(new Error('Entry cannot have both debit and credit amounts'));
    }
    if (entry.debitAmount === 0 && entry.creditAmount === 0) {
      return next(new Error('Entry must have either debit or credit amount'));
    }
  }

  next();
});

module.exports = mongoose.model('JournalVoucher', journalVoucherSchema);

