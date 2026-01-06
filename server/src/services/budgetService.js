const Budget = require('../models/Budget');
const GeneralLedger = require('../models/GeneralLedger');
const Project = require('../models/Project');

/**
 * Validate budget data before saving
 */
async function validateBudget(budgetData) {
  const errors = [];

  // 1. Must have at least one line item
  if (!budgetData.lineItems || budgetData.lineItems.length === 0) {
    errors.push('Budget must have at least one line item');
  }

  // 2. All line items must have valid general ledger
  for (let item of budgetData.lineItems) {
    const ledger = await GeneralLedger.findById(item.generalLedger);
    if (!ledger) {
      errors.push(`Invalid general ledger in line ${item.serialNo}`);
      continue;
    }
    
    if (ledger.project.toString() !== budgetData.project.toString()) {
      errors.push(`General ledger in line ${item.serialNo} does not belong to this project`);
    }
  }

  // 3. Total must match sum of line items
  const calculatedTotal = budgetData.lineItems.reduce((sum, item) => sum + item.amount, 0);
  if (Math.abs(budgetData.totalAmount - calculatedTotal) > 0.01) {
    errors.push('Total amount must equal sum of line items');
  }

  // 4. All amounts must be positive
  for (let item of budgetData.lineItems) {
    if (item.amount <= 0) {
      errors.push(`Amount must be positive in line ${item.serialNo}`);
    }
  }

  // 5. Date must be within project's financial year
  const project = await Project.findById(budgetData.project);
  if (budgetData.approvedDate < project.financialYearFrom) {
    errors.push('Budget date cannot be before project financial year');
  }

  if (project.financialYearTo && budgetData.approvedDate > project.financialYearTo) {
    errors.push('Budget date cannot be after project financial year');
  }

  return { isValid: errors.length === 0, errors };
}

module.exports = {
  validateBudget
};

