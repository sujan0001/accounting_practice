require('dotenv').config();
const mongoose = require('mongoose');
const AccountType = require('../models/AccountType');
const connectDB = require('../config/database');

const accountTypes = [
  { 
    name: 'Asset', 
    code: 'AS', 
    nature: 'debit', 
    reportCategory: 'balance_sheet', 
    order: 1 
  },
  { 
    name: 'Liability', 
    code: 'LI', 
    nature: 'credit', 
    reportCategory: 'balance_sheet', 
    order: 2 
  },
  { 
    name: 'Equity', 
    code: 'EQ', 
    nature: 'credit', 
    reportCategory: 'balance_sheet', 
    order: 3 
  },
  { 
    name: 'Revenue', 
    code: 'RE', 
    nature: 'credit', 
    reportCategory: 'income_statement', 
    order: 4 
  },
  { 
    name: 'Expense', 
    code: 'EX', 
    nature: 'debit', 
    reportCategory: 'income_statement', 
    order: 5 
  }
];

async function seedAccountTypes() {
  try {
    await connectDB();
    
    // Clear existing account types
    await AccountType.deleteMany({});
    console.log('Cleared existing account types');

    // Insert account types
    await AccountType.insertMany(accountTypes);
    console.log('Seeded account types successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding account types:', error);
    process.exit(1);
  }
}

seedAccountTypes();

