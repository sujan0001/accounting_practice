const AccountType = require('../models/AccountType');
const LedgerGroup = require('../models/LedgerGroup');
const GeneralLedger = require('../models/GeneralLedger');
const SubLedger = require('../models/SubLedger');

// Account Types (Read-only)
async function getAccountTypes(req, res) {
  try {
    const accountTypes = await AccountType.find().sort({ order: 1 });
    res.json({ accountTypes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Ledger Groups
async function createLedgerGroup(req, res) {
  try {
    const { groupName, alias, accountType, remarks } = req.body;
    const { projectId } = req.params;

    const ledgerGroup = new LedgerGroup({
      project: projectId,
      groupName,
      alias,
      accountType,
      remarks,
      createdBy: req.user._id
    });

    await ledgerGroup.save();
    await ledgerGroup.populate('accountType');

    res.status(201).json({
      message: 'Ledger group created successfully',
      ledgerGroup
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getLedgerGroups(req, res) {
  try {
    const { projectId } = req.params;
    const ledgerGroups = await LedgerGroup.find({ project: projectId })
      .populate('accountType')
      .sort({ createdAt: -1 });

    res.json({ ledgerGroups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getLedgerGroup(req, res) {
  try {
    const ledgerGroup = await LedgerGroup.findById(req.params.id)
      .populate('accountType');

    if (!ledgerGroup) {
      return res.status(404).json({ message: 'Ledger group not found' });
    }

    res.json({ ledgerGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateLedgerGroup(req, res) {
  try {
    const { groupName, alias, accountType, remarks } = req.body;
    const ledgerGroup = await LedgerGroup.findById(req.params.id);

    if (!ledgerGroup) {
      return res.status(404).json({ message: 'Ledger group not found' });
    }

    ledgerGroup.groupName = groupName || ledgerGroup.groupName;
    ledgerGroup.alias = alias || ledgerGroup.alias;
    ledgerGroup.accountType = accountType || ledgerGroup.accountType;
    ledgerGroup.remarks = remarks !== undefined ? remarks : ledgerGroup.remarks;

    await ledgerGroup.save();
    await ledgerGroup.populate('accountType');

    res.json({
      message: 'Ledger group updated successfully',
      ledgerGroup
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteLedgerGroup(req, res) {
  try {
    const ledgerGroup = await LedgerGroup.findById(req.params.id);

    if (!ledgerGroup) {
      return res.status(404).json({ message: 'Ledger group not found' });
    }

    // Check if has general ledgers
    const count = await GeneralLedger.countDocuments({ ledgerGroup: ledgerGroup._id });
    if (count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete ledger group with existing general ledgers' 
      });
    }

    await LedgerGroup.findByIdAndDelete(req.params.id);

    res.json({ message: 'Ledger group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// General Ledgers
async function createGeneralLedger(req, res) {
  try {
    const { ledgerName, alias, ledgerGroup, openingBalance, openingBalanceType, description } = req.body;
    const { projectId } = req.params;

    const generalLedger = new GeneralLedger({
      project: projectId,
      ledgerName,
      alias,
      ledgerGroup,
      openingBalance: openingBalance || 0,
      openingBalanceType: openingBalanceType || 'debit',
      description,
      createdBy: req.user._id
    });

    await generalLedger.save();
    await generalLedger.populate('ledgerGroup');

    res.status(201).json({
      message: 'General ledger created successfully',
      generalLedger
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getGeneralLedgers(req, res) {
  try {
    const { projectId } = req.params;
    const { ledgerGroupId } = req.query;

    const filter = { project: projectId };
    if (ledgerGroupId) {
      filter.ledgerGroup = ledgerGroupId;
    }

    const generalLedgers = await GeneralLedger.find(filter)
      .populate('ledgerGroup')
      .sort({ createdAt: -1 });

    res.json({ generalLedgers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getGeneralLedger(req, res) {
  try {
    const generalLedger = await GeneralLedger.findById(req.params.id)
      .populate('ledgerGroup');

    if (!generalLedger) {
      return res.status(404).json({ message: 'General ledger not found' });
    }

    res.json({ generalLedger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateGeneralLedger(req, res) {
  try {
    const { ledgerName, alias, ledgerGroup, openingBalance, openingBalanceType, description } = req.body;
    const generalLedger = await GeneralLedger.findById(req.params.id);

    if (!generalLedger) {
      return res.status(404).json({ message: 'General ledger not found' });
    }

    generalLedger.ledgerName = ledgerName || generalLedger.ledgerName;
    generalLedger.alias = alias || generalLedger.alias;
    generalLedger.ledgerGroup = ledgerGroup || generalLedger.ledgerGroup;
    generalLedger.openingBalance = openingBalance !== undefined ? openingBalance : generalLedger.openingBalance;
    generalLedger.openingBalanceType = openingBalanceType || generalLedger.openingBalanceType;
    generalLedger.description = description !== undefined ? description : generalLedger.description;

    await generalLedger.save();
    await generalLedger.populate('ledgerGroup');

    res.json({
      message: 'General ledger updated successfully',
      generalLedger
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteGeneralLedger(req, res) {
  try {
    const generalLedger = await GeneralLedger.findById(req.params.id);

    if (!generalLedger) {
      return res.status(404).json({ message: 'General ledger not found' });
    }

    // Check if used in vouchers or budgets
    const JournalVoucher = require('../models/JournalVoucher');
    const Budget = require('../models/Budget');

    const voucherCount = await JournalVoucher.countDocuments({
      'entries.generalLedger': generalLedger._id
    });
    const budgetCount = await Budget.countDocuments({
      'lineItems.generalLedger': generalLedger._id
    });

    if (voucherCount > 0 || budgetCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete general ledger used in transactions' 
      });
    }

    await GeneralLedger.findByIdAndDelete(req.params.id);

    res.json({ message: 'General ledger deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Sub Ledgers
async function createSubLedger(req, res) {
  try {
    const { subLedgerName, alias, generalLedger, openingBalance, openingBalanceType, description } = req.body;
    const { projectId } = req.params;

    const subLedger = new SubLedger({
      project: projectId,
      subLedgerName,
      alias,
      generalLedger,
      openingBalance: openingBalance || 0,
      openingBalanceType: openingBalanceType || 'debit',
      description,
      createdBy: req.user._id
    });

    await subLedger.save();
    await subLedger.populate('generalLedger');

    res.status(201).json({
      message: 'Sub ledger created successfully',
      subLedger
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSubLedgers(req, res) {
  try {
    const { projectId } = req.params;
    const { generalLedgerId } = req.query;

    const filter = { project: projectId };
    if (generalLedgerId) {
      filter.generalLedger = generalLedgerId;
    }

    const subLedgers = await SubLedger.find(filter)
      .populate('generalLedger')
      .sort({ createdAt: -1 });

    res.json({ subLedgers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSubLedger(req, res) {
  try {
    const subLedger = await SubLedger.findById(req.params.id)
      .populate('generalLedger');

    if (!subLedger) {
      return res.status(404).json({ message: 'Sub ledger not found' });
    }

    res.json({ subLedger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSubLedger(req, res) {
  try {
    const { subLedgerName, alias, generalLedger, openingBalance, openingBalanceType, description } = req.body;
    const subLedger = await SubLedger.findById(req.params.id);

    if (!subLedger) {
      return res.status(404).json({ message: 'Sub ledger not found' });
    }

    subLedger.subLedgerName = subLedgerName || subLedger.subLedgerName;
    subLedger.alias = alias || subLedger.alias;
    subLedger.generalLedger = generalLedger || subLedger.generalLedger;
    subLedger.openingBalance = openingBalance !== undefined ? openingBalance : subLedger.openingBalance;
    subLedger.openingBalanceType = openingBalanceType || subLedger.openingBalanceType;
    subLedger.description = description !== undefined ? description : subLedger.description;

    await subLedger.save();
    await subLedger.populate('generalLedger');

    res.json({
      message: 'Sub ledger updated successfully',
      subLedger
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteSubLedger(req, res) {
  try {
    const subLedger = await SubLedger.findById(req.params.id);

    if (!subLedger) {
      return res.status(404).json({ message: 'Sub ledger not found' });
    }

    // Check if used in vouchers or budgets
    const JournalVoucher = require('../models/JournalVoucher');
    const Budget = require('../models/Budget');

    const voucherCount = await JournalVoucher.countDocuments({
      'entries.subLedger': subLedger._id
    });
    const budgetCount = await Budget.countDocuments({
      'lineItems.subLedger': subLedger._id
    });

    if (voucherCount > 0 || budgetCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete sub ledger used in transactions' 
      });
    }

    await SubLedger.findByIdAndDelete(req.params.id);

    res.json({ message: 'Sub ledger deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAccountTypes,
  createLedgerGroup,
  getLedgerGroups,
  getLedgerGroup,
  updateLedgerGroup,
  deleteLedgerGroup,
  createGeneralLedger,
  getGeneralLedgers,
  getGeneralLedger,
  updateGeneralLedger,
  deleteGeneralLedger,
  createSubLedger,
  getSubLedgers,
  getSubLedger,
  updateSubLedger,
  deleteSubLedger
};

