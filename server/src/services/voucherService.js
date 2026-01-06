const JournalVoucher = require('../models/JournalVoucher');
const GeneralLedger = require('../models/GeneralLedger');
const Project = require('../models/Project');

/**
 * Validate journal voucher data before saving
 */
async function validateJournalVoucher(voucherData) {
  const errors = [];

  // 1. Must have at least 2 entries
  if (!voucherData.entries || voucherData.entries.length < 2) {
    errors.push('Journal voucher must have at least 2 entries');
  }

  // 2. Calculate totals and validate each entry
  let totalDebit = 0;
  let totalCredit = 0;
  
  for (let entry of voucherData.entries) {
    totalDebit += entry.debitAmount || 0;
    totalCredit += entry.creditAmount || 0;

    // Each entry must have EITHER debit OR credit (not both, not neither)
    if (entry.debitAmount > 0 && entry.creditAmount > 0) {
      errors.push(`Entry ${entry.serialNo} cannot have both debit and credit`);
    }
    if ((entry.debitAmount === 0 || !entry.debitAmount) && 
        (entry.creditAmount === 0 || !entry.creditAmount)) {
      errors.push(`Entry ${entry.serialNo} must have either debit or credit`);
    }
  }

  // 3. CRITICAL: Debit must equal Credit
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    errors.push(`Voucher is not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`);
  }

  // 4. All general ledgers must exist and belong to project
  for (let entry of voucherData.entries) {
    const ledger = await GeneralLedger.findById(entry.generalLedger);
    if (!ledger) {
      errors.push(`Invalid general ledger in entry ${entry.serialNo}`);
      continue;
    }
    
    if (ledger.project.toString() !== voucherData.project.toString()) {
      errors.push(`General ledger in entry ${entry.serialNo} does not belong to this project`);
    }
  }

  // 5. Date must be within project's financial year
  const project = await Project.findById(voucherData.project);
  if (voucherData.date < project.financialYearFrom) {
    errors.push('Voucher date cannot be before project financial year');
  }

  if (project.financialYearTo && voucherData.date > project.financialYearTo) {
    errors.push('Voucher date cannot be after project financial year');
  }

  return { isValid: errors.length === 0, errors };
}

module.exports = {
  validateJournalVoucher
};

