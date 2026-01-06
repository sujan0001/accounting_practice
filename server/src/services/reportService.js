const JournalVoucher = require('../models/JournalVoucher');
const Budget = require('../models/Budget');

/**
 * Generate Trial Balance for a project within date range
 */
async function generateTrialBalance(projectId, dateFrom, dateTo) {
  // 1. Get all journal vouchers in date range
  const vouchers = await JournalVoucher.find({
    project: projectId,
    date: { $gte: dateFrom, $lte: dateTo }
  }).populate({
    path: 'entries.generalLedger',
    populate: { 
      path: 'ledgerGroup', 
      populate: 'accountType' 
    }
  });

  // 2. Aggregate by general ledger
  const ledgerBalances = {};

  vouchers.forEach(voucher => {
    voucher.entries.forEach(entry => {
      const ledgerId = entry.generalLedger._id.toString();

      if (!ledgerBalances[ledgerId]) {
        ledgerBalances[ledgerId] = {
          ledgerId: ledgerId,
          ledgerName: entry.generalLedger.ledgerName,
          ledgerGroup: entry.generalLedger.ledgerGroup.groupName,
          accountType: entry.generalLedger.ledgerGroup.accountType.name,
          debit: 0,
          credit: 0
        };
      }

      ledgerBalances[ledgerId].debit += entry.debitAmount || 0;
      ledgerBalances[ledgerId].credit += entry.creditAmount || 0;
    });
  });

  // 3. Calculate net balance for each ledger
  const result = Object.values(ledgerBalances).map(ledger => {
    const balance = ledger.debit - ledger.credit;
    return {
      ...ledger,
      balance: Math.abs(balance),
      balanceType: balance >= 0 ? 'debit' : 'credit'
    };
  });

  // 4. Calculate totals
  const totalDebit = result.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = result.reduce((sum, l) => sum + l.credit, 0);

  return {
    ledgers: result,
    totalDebit,
    totalCredit,
    isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
  };
}

/**
 * Generate Income Statement (Profit & Loss)
 */
async function generateIncomeStatement(projectId, dateFrom, dateTo) {
  // 1. Get trial balance
  const trialBalance = await generateTrialBalance(projectId, dateFrom, dateTo);

  // 2. Filter Revenue and Expense accounts
  const revenueAccounts = trialBalance.ledgers.filter(l => l.accountType === 'Revenue');
  const expenseAccounts = trialBalance.ledgers.filter(l => l.accountType === 'Expense');

  // 3. Calculate totals (Revenue is credit nature, Expense is debit nature)
  const totalRevenue = revenueAccounts.reduce((sum, l) => sum + (l.credit - l.debit), 0);
  const totalExpense = expenseAccounts.reduce((sum, l) => sum + (l.debit - l.credit), 0);
  const netIncome = totalRevenue - totalExpense;

  return {
    revenue: {
      accounts: revenueAccounts.map(l => ({
        name: l.ledgerName,
        amount: l.credit - l.debit
      })),
      total: totalRevenue
    },
    expense: {
      accounts: expenseAccounts.map(l => ({
        name: l.ledgerName,
        amount: l.debit - l.credit
      })),
      total: totalExpense
    },
    netIncome,
    netIncomeType: netIncome >= 0 ? 'profit' : 'loss'
  };
}

/**
 * Generate Balance Sheet
 */
async function generateBalanceSheet(projectId, asOfDate) {
  // 1. Get trial balance up to date
  const trialBalance = await generateTrialBalance(
    projectId,
    new Date('1900-01-01'), // From beginning of time
    asOfDate
  );

  // 2. Get income statement for net income
  const incomeStatement = await generateIncomeStatement(
    projectId,
    new Date('1900-01-01'),
    asOfDate
  );

  // 3. Filter by account type
  const assets = trialBalance.ledgers.filter(l => l.accountType === 'Asset');
  const liabilities = trialBalance.ledgers.filter(l => l.accountType === 'Liability');
  const equity = trialBalance.ledgers.filter(l => l.accountType === 'Equity');

  // 4. Calculate totals
  const totalAssets = assets.reduce((sum, l) => sum + (l.debit - l.credit), 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + (l.credit - l.debit), 0);
  const totalEquity = equity.reduce((sum, l) => sum + (l.credit - l.debit), 0);

  // 5. Add net income to equity
  const equityWithIncome = totalEquity + incomeStatement.netIncome;

  return {
    assets: {
      accounts: assets.map(l => ({ 
        name: l.ledgerName, 
        amount: l.debit - l.credit 
      })),
      total: totalAssets
    },
    liabilities: {
      accounts: liabilities.map(l => ({ 
        name: l.ledgerName, 
        amount: l.credit - l.debit 
      })),
      total: totalLiabilities
    },
    equity: {
      accounts: [
        ...equity.map(l => ({ 
          name: l.ledgerName, 
          amount: l.credit - l.debit 
        })),
        { name: 'Net Income', amount: incomeStatement.netIncome }
      ],
      total: equityWithIncome
    },
    isBalanced: Math.abs(totalAssets - (totalLiabilities + equityWithIncome)) < 0.01
  };
}

/**
 * Generate Fund Accountability Statement (Budget vs Actual)
 * MOST IMPORTANT FOR NGOs
 */
async function generateFundAccountability(projectId, dateFrom, dateTo) {
  // 1. Get all budget line items in date range
  const budgets = await Budget.find({
    project: projectId,
    approvedDate: { $gte: dateFrom, $lte: dateTo }
  }).populate('lineItems.generalLedger lineItems.subLedger');

  // 2. Aggregate budgets by general ledger
  const budgetByLedger = {};
  budgets.forEach(budget => {
    budget.lineItems.forEach(line => {
      const ledgerId = line.generalLedger._id.toString();
      if (!budgetByLedger[ledgerId]) {
        budgetByLedger[ledgerId] = {
          ledgerId,
          ledgerName: line.generalLedger.ledgerName,
          budgetedAmount: 0,
          lineItems: []
        };
      }
      budgetByLedger[ledgerId].budgetedAmount += line.amount;
      budgetByLedger[ledgerId].lineItems.push({
        district: line.district,
        amount: line.amount
      });
    });
  });

  // 3. Get actual expenditure from journal vouchers (only Expense accounts)
  const vouchers = await JournalVoucher.find({
    project: projectId,
    date: { $gte: dateFrom, $lte: dateTo }
  }).populate({
    path: 'entries.generalLedger',
    populate: { 
      path: 'ledgerGroup', 
      populate: 'accountType' 
    }
  });

  const actualByLedger = {};
  vouchers.forEach(voucher => {
    voucher.entries.forEach(entry => {
      const accountType = entry.generalLedger.ledgerGroup.accountType.name;

      // Only track Expense accounts for fund accountability
      if (accountType === 'Expense') {
        const ledgerId = entry.generalLedger._id.toString();
        if (!actualByLedger[ledgerId]) {
          actualByLedger[ledgerId] = {
            ledgerId,
            ledgerName: entry.generalLedger.ledgerName,
            actualAmount: 0
          };
        }
        actualByLedger[ledgerId].actualAmount += (entry.debitAmount - entry.creditAmount);
      }
    });
  });

  // 4. Compare budget vs actual
  const allLedgerIds = new Set([
    ...Object.keys(budgetByLedger),
    ...Object.keys(actualByLedger)
  ]);

  const comparison = [];
  for (const ledgerId of allLedgerIds) {
    const budgeted = budgetByLedger[ledgerId]?.budgetedAmount || 0;
    const actual = actualByLedger[ledgerId]?.actualAmount || 0;
    const variance = budgeted - actual;
    const variancePercent = budgeted > 0 ? ((variance / budgeted) * 100) : 0;
    const status = actual > budgeted ? 'over-budget' : 'within-budget';

    comparison.push({
      ledgerName: budgetByLedger[ledgerId]?.ledgerName || actualByLedger[ledgerId]?.ledgerName,
      budgeted,
      actual,
      variance,
      variancePercent: Math.round(variancePercent * 100) / 100,
      status
    });
  }

  // 5. Calculate totals
  const totalBudgeted = comparison.reduce((sum, c) => sum + c.budgeted, 0);
  const totalActual = comparison.reduce((sum, c) => sum + c.actual, 0);
  const totalVariance = totalBudgeted - totalActual;
  const utilizationRate = totalBudgeted > 0 ? ((totalActual / totalBudgeted) * 100) : 0;

  return {
    lineItems: comparison,
    summary: {
      totalBudgeted,
      totalActual,
      totalVariance,
      utilizationRate: Math.round(utilizationRate * 100) / 100,
      status: totalActual > totalBudgeted ? 'over-budget' : 'within-budget'
    }
  };
}

/**
 * Generate Budget vs Expenditure Report (all account types)
 */
async function generateBudgetVsExpenditure(projectId, dateFrom, dateTo) {
  // Similar to Fund Accountability but includes ALL account types, not just Expense
  const budgets = await Budget.find({
    project: projectId,
    approvedDate: { $gte: dateFrom, $lte: dateTo }
  }).populate('lineItems.generalLedger');

  const budgetByLedger = {};
  budgets.forEach(budget => {
    budget.lineItems.forEach(line => {
      const ledgerId = line.generalLedger._id.toString();
      if (!budgetByLedger[ledgerId]) {
        budgetByLedger[ledgerId] = {
          ledgerId,
          ledgerName: line.generalLedger.ledgerName,
          budgetedAmount: 0
        };
      }
      budgetByLedger[ledgerId].budgetedAmount += line.amount;
    });
  });

  const vouchers = await JournalVoucher.find({
    project: projectId,
    date: { $gte: dateFrom, $lte: dateTo }
  }).populate('entries.generalLedger');

  const actualByLedger = {};
  vouchers.forEach(voucher => {
    voucher.entries.forEach(entry => {
      const ledgerId = entry.generalLedger._id.toString();
      if (!actualByLedger[ledgerId]) {
        actualByLedger[ledgerId] = {
          ledgerId,
          ledgerName: entry.generalLedger.ledgerName,
          actualAmount: 0
        };
      }
      actualByLedger[ledgerId].actualAmount += (entry.debitAmount - entry.creditAmount);
    });
  });

  const allLedgerIds = new Set([
    ...Object.keys(budgetByLedger),
    ...Object.keys(actualByLedger)
  ]);

  const comparison = [];
  for (const ledgerId of allLedgerIds) {
    const budgeted = budgetByLedger[ledgerId]?.budgetedAmount || 0;
    const actual = actualByLedger[ledgerId]?.actualAmount || 0;
    const variance = budgeted - actual;
    const variancePercent = budgeted > 0 ? ((variance / budgeted) * 100) : 0;

    comparison.push({
      ledgerName: budgetByLedger[ledgerId]?.ledgerName || actualByLedger[ledgerId]?.ledgerName,
      budgeted,
      actual,
      variance,
      variancePercent: Math.round(variancePercent * 100) / 100
    });
  }

  return {
    lineItems: comparison,
    summary: {
      totalBudgeted: comparison.reduce((sum, c) => sum + c.budgeted, 0),
      totalActual: comparison.reduce((sum, c) => sum + c.actual, 0)
    }
  };
}

module.exports = {
  generateTrialBalance,
  generateIncomeStatement,
  generateBalanceSheet,
  generateFundAccountability,
  generateBudgetVsExpenditure
};

