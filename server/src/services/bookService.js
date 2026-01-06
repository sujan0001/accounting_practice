const JournalVoucher = require('../models/JournalVoucher');
const GeneralLedger = require('../models/GeneralLedger');
const SubLedger = require('../models/SubLedger');

/**
 * Generate General Ledger Book
 */
async function generateGeneralLedgerBook(projectId, ledgerId, dateFrom, dateTo) {
  const ledger = await GeneralLedger.findById(ledgerId)
    .populate('ledgerGroup')
    .populate('project');

  if (!ledger || ledger.project._id.toString() !== projectId) {
    throw new Error('General ledger not found or does not belong to project');
  }

  // Get all journal vouchers with entries for this ledger
  const vouchers = await JournalVoucher.find({
    project: projectId,
    date: { $gte: dateFrom, $lte: dateTo },
    'entries.generalLedger': ledgerId
  }).sort({ date: 1, createdAt: 1 });

  const transactions = [];
  let runningBalance = ledger.openingBalance || 0;
  const balanceType = ledger.openingBalanceType || 'debit';

  vouchers.forEach(voucher => {
    voucher.entries.forEach(entry => {
      if (entry.generalLedger.toString() === ledgerId) {
        const debit = entry.debitAmount || 0;
        const credit = entry.creditAmount || 0;
        
        // Calculate running balance based on account nature
        if (balanceType === 'debit') {
          runningBalance = runningBalance + debit - credit;
        } else {
          runningBalance = runningBalance + credit - debit;
        }

        transactions.push({
          date: voucher.date,
          voucherNo: voucher.voucherNo,
          narration: entry.narration || voucher.narration,
          subLedger: entry.subLedger ? entry.subLedger.toString() : null,
          debit,
          credit,
          balance: runningBalance,
          balanceType: runningBalance >= 0 ? 'debit' : 'credit'
        });
      }
    });
  });

  return {
    ledger: {
      id: ledger._id,
      name: ledger.ledgerName,
      alias: ledger.alias,
      group: ledger.ledgerGroup.groupName,
      openingBalance: ledger.openingBalance || 0,
      openingBalanceType: balanceType
    },
    transactions,
    summary: {
      totalDebit: transactions.reduce((sum, t) => sum + t.debit, 0),
      totalCredit: transactions.reduce((sum, t) => sum + t.credit, 0),
      closingBalance: runningBalance
    }
  };
}

/**
 * Generate Sub Ledger Book
 */
async function generateSubLedgerBook(projectId, subLedgerId, dateFrom, dateTo) {
  const subLedger = await SubLedger.findById(subLedgerId)
    .populate('generalLedger')
    .populate('project');

  if (!subLedger || subLedger.project._id.toString() !== projectId) {
    throw new Error('Sub ledger not found or does not belong to project');
  }

  const vouchers = await JournalVoucher.find({
    project: projectId,
    date: { $gte: dateFrom, $lte: dateTo },
    'entries.subLedger': subLedgerId
  }).sort({ date: 1, createdAt: 1 });

  const transactions = [];
  let runningBalance = subLedger.openingBalance || 0;
  const balanceType = subLedger.openingBalanceType || 'debit';

  vouchers.forEach(voucher => {
    voucher.entries.forEach(entry => {
      if (entry.subLedger && entry.subLedger.toString() === subLedgerId) {
        const debit = entry.debitAmount || 0;
        const credit = entry.creditAmount || 0;
        
        if (balanceType === 'debit') {
          runningBalance = runningBalance + debit - credit;
        } else {
          runningBalance = runningBalance + credit - debit;
        }

        transactions.push({
          date: voucher.date,
          voucherNo: voucher.voucherNo,
          narration: entry.narration || voucher.narration,
          debit,
          credit,
          balance: runningBalance,
          balanceType: runningBalance >= 0 ? 'debit' : 'credit'
        });
      }
    });
  });

  return {
    subLedger: {
      id: subLedger._id,
      name: subLedger.subLedgerName,
      alias: subLedger.alias,
      generalLedger: subLedger.generalLedger.ledgerName,
      openingBalance: subLedger.openingBalance || 0,
      openingBalanceType: balanceType
    },
    transactions,
    summary: {
      totalDebit: transactions.reduce((sum, t) => sum + t.debit, 0),
      totalCredit: transactions.reduce((sum, t) => sum + t.credit, 0),
      closingBalance: runningBalance
    }
  };
}

/**
 * Generate Cash/Bank Book
 */
async function generateCashBankBook(projectId, dateFrom, dateTo) {
  // Get all cash and bank related ledgers (typically under Current Assets)
  const GeneralLedger = require('../models/GeneralLedger');
  const LedgerGroup = require('../models/LedgerGroup');
  const AccountType = require('../models/AccountType');

  const assetType = await AccountType.findOne({ code: 'AS' });
  const cashBankGroups = await LedgerGroup.find({
    project: projectId,
    accountType: assetType._id,
    $or: [
      { groupName: { $regex: /cash/i } },
      { groupName: { $regex: /bank/i } },
      { alias: { $regex: /cash/i } },
      { alias: { $regex: /bank/i } }
    ]
  });

  const cashBankLedgers = await GeneralLedger.find({
    project: projectId,
    ledgerGroup: { $in: cashBankGroups.map(g => g._id) }
  });

  const ledgerIds = cashBankLedgers.map(l => l._id);

  const vouchers = await JournalVoucher.find({
    project: projectId,
    date: { $gte: dateFrom, $lte: dateTo },
    'entries.generalLedger': { $in: ledgerIds }
  })
    .populate('entries.generalLedger')
    .sort({ date: 1, createdAt: 1 });

  const transactions = [];
  const balances = {};

  // Initialize balances
  cashBankLedgers.forEach(ledger => {
    balances[ledger._id.toString()] = {
      ledgerName: ledger.ledgerName,
      openingBalance: ledger.openingBalance || 0,
      currentBalance: ledger.openingBalance || 0
    };
  });

  vouchers.forEach(voucher => {
    voucher.entries.forEach(entry => {
      const ledgerId = entry.generalLedger._id.toString();
      if (ledgerIds.some(id => id.toString() === ledgerId)) {
        const debit = entry.debitAmount || 0;
        const credit = entry.creditAmount || 0;
        balances[ledgerId].currentBalance += (debit - credit);

        transactions.push({
          date: voucher.date,
          voucherNo: voucher.voucherNo,
          ledgerName: entry.generalLedger.ledgerName,
          narration: entry.narration || voucher.narration,
          debit,
          credit,
          balance: balances[ledgerId].currentBalance
        });
      }
    });
  });

  return {
    ledgers: Object.values(balances),
    transactions,
    summary: {
      totalDebit: transactions.reduce((sum, t) => sum + t.debit, 0),
      totalCredit: transactions.reduce((sum, t) => sum + t.credit, 0),
      totalBalance: Object.values(balances).reduce((sum, b) => sum + b.currentBalance, 0)
    }
  };
}

module.exports = {
  generateGeneralLedgerBook,
  generateSubLedgerBook,
  generateCashBankBook
};

