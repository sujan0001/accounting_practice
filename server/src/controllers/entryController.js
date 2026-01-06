const Budget = require('../models/Budget');
const JournalVoucher = require('../models/JournalVoucher');
const { generateBudgetNo, generateVoucherNo } = require('../utils/autoNumber');
const { validateBudget } = require('../services/budgetService');
const { validateJournalVoucher } = require('../services/voucherService');

// Budget Controllers
async function createBudget(req, res) {
  try {
    const { approvedDate, approvedBy, lineItems, totalAmount } = req.body;
    const { projectId } = req.params;

    const budgetNo = await generateBudgetNo();

    const budgetData = {
      project: projectId,
      budgetNo,
      approvedDate,
      approvedBy,
      lineItems,
      totalAmount,
      createdBy: req.user._id
    };

    // Validate budget
    const validation = await validateBudget(budgetData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Budget validation failed',
        errors: validation.errors
      });
    }

    const budget = new Budget(budgetData);
    await budget.save();
    await budget.populate('lineItems.generalLedger lineItems.subLedger');

    res.status(201).json({
      message: 'Budget created successfully',
      budget
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getBudgets(req, res) {
  try {
    const { projectId } = req.params;
    const budgets = await Budget.find({ project: projectId })
      .populate('lineItems.generalLedger lineItems.subLedger')
      .sort({ createdAt: -1 });

    res.json({ budgets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getBudget(req, res) {
  try {
    const budget = await Budget.findById(req.params.id)
      .populate('lineItems.generalLedger lineItems.subLedger');

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateBudget(req, res) {
  try {
    const { approvedDate, approvedBy, lineItems, totalAmount } = req.body;
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.approvedDate = approvedDate || budget.approvedDate;
    budget.approvedBy = approvedBy !== undefined ? approvedBy : budget.approvedBy;
    budget.lineItems = lineItems || budget.lineItems;
    budget.totalAmount = totalAmount || budget.totalAmount;
    budget.updatedAt = new Date();

    // Validate budget
    const validation = await validateBudget(budget);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Budget validation failed',
        errors: validation.errors
      });
    }

    await budget.save();
    await budget.populate('lineItems.generalLedger lineItems.subLedger');

    res.json({
      message: 'Budget updated successfully',
      budget
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteBudget(req, res) {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Journal Voucher Controllers
async function createJournalVoucher(req, res) {
  try {
    const { date, narration, entries } = req.body;
    const { projectId } = req.params;

    const voucherNo = await generateVoucherNo();

    // Calculate totals
    const totalDebit = entries.reduce((sum, e) => sum + (e.debitAmount || 0), 0);
    const totalCredit = entries.reduce((sum, e) => sum + (e.creditAmount || 0), 0);

    const voucherData = {
      project: projectId,
      voucherNo,
      date,
      narration,
      entries,
      totalDebit,
      totalCredit,
      createdBy: req.user._id
    };

    // Validate voucher
    const validation = await validateJournalVoucher(voucherData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Journal voucher validation failed',
        errors: validation.errors
      });
    }

    const voucher = new JournalVoucher(voucherData);
    await voucher.save();
    await voucher.populate('entries.generalLedger entries.subLedger');

    res.status(201).json({
      message: 'Journal voucher created successfully',
      voucher
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getJournalVouchers(req, res) {
  try {
    const { projectId } = req.params;
    const vouchers = await JournalVoucher.find({ project: projectId })
      .populate('entries.generalLedger entries.subLedger')
      .sort({ date: -1, createdAt: -1 });

    res.json({ vouchers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getJournalVoucher(req, res) {
  try {
    const voucher = await JournalVoucher.findById(req.params.id)
      .populate('entries.generalLedger entries.subLedger');

    if (!voucher) {
      return res.status(404).json({ message: 'Journal voucher not found' });
    }

    res.json({ voucher });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateJournalVoucher(req, res) {
  try {
    const { date, narration, entries } = req.body;
    const voucher = await JournalVoucher.findById(req.params.id);

    if (!voucher) {
      return res.status(404).json({ message: 'Journal voucher not found' });
    }

    voucher.date = date || voucher.date;
    voucher.narration = narration !== undefined ? narration : voucher.narration;
    voucher.entries = entries || voucher.entries;
    
    // Recalculate totals
    voucher.totalDebit = voucher.entries.reduce((sum, e) => sum + (e.debitAmount || 0), 0);
    voucher.totalCredit = voucher.entries.reduce((sum, e) => sum + (e.creditAmount || 0), 0);
    voucher.updatedAt = new Date();

    // Validate voucher
    const validation = await validateJournalVoucher(voucher);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Journal voucher validation failed',
        errors: validation.errors
      });
    }

    await voucher.save();
    await voucher.populate('entries.generalLedger entries.subLedger');

    res.json({
      message: 'Journal voucher updated successfully',
      voucher
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteJournalVoucher(req, res) {
  try {
    const voucher = await JournalVoucher.findById(req.params.id);

    if (!voucher) {
      return res.status(404).json({ message: 'Journal voucher not found' });
    }

    await JournalVoucher.findByIdAndDelete(req.params.id);

    res.json({ message: 'Journal voucher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  createJournalVoucher,
  getJournalVouchers,
  getJournalVoucher,
  updateJournalVoucher,
  deleteJournalVoucher
};

