const mongoose = require('mongoose');

const accountTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  nature: {
    type: String,
    enum: ['debit', 'credit'],
    required: true
  },
  reportCategory: {
    type: String,
    enum: ['balance_sheet', 'income_statement'],
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('AccountType', accountTypeSchema);

