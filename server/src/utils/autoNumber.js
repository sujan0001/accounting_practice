const Budget = require('../models/Budget');
const JournalVoucher = require('../models/JournalVoucher');

/**
 * Generate next budget number (BUD-001, BUD-002, ...)
 */
async function generateBudgetNo() {
  const lastBudget = await Budget.findOne().sort({ budgetNo: -1 });
  
  if (!lastBudget) {
    return 'BUD-001';
  }

  const lastNumber = parseInt(lastBudget.budgetNo.split('-')[1]);
  const nextNumber = lastNumber + 1;
  return `BUD-${String(nextNumber).padStart(3, '0')}`;
}

/**
 * Generate next journal voucher number (JV-001, JV-002, ...)
 */
async function generateVoucherNo() {
  const lastVoucher = await JournalVoucher.findOne().sort({ voucherNo: -1 });
  
  if (!lastVoucher) {
    return 'JV-001';
  }

  const lastNumber = parseInt(lastVoucher.voucherNo.split('-')[1]);
  const nextNumber = lastNumber + 1;
  return `JV-${String(nextNumber).padStart(3, '0')}`;
}

module.exports = {
  generateBudgetNo,
  generateVoucherNo
};

