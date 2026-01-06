const mongoose = require('mongoose');

const budgetLineItemSchema = new mongoose.Schema({
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
  district: String,
  period: String,
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  narration: String
});

const budgetSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  budgetNo: {
    type: String,
    required: true,
    unique: true
  },
  approvedDate: {
    type: Date,
    required: true
  },
  approvedBy: String,
  lineItems: [budgetLineItemSchema],
  totalAmount: {
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

// Validation: totalAmount must equal sum of lineItems.amount
budgetSchema.pre('save', function(next) {
  const calculatedTotal = this.lineItems.reduce((sum, item) => sum + item.amount, 0);
  if (Math.abs(this.totalAmount - calculatedTotal) > 0.01) {
    return next(new Error('Total amount must equal sum of line items'));
  }
  next();
});

module.exports = mongoose.model('Budget', budgetSchema);

