// const {
//   generateTrialBalance,
//   generateIncomeStatement,
//   generateBalanceSheet,
//   generateFundAccountability,
//   generateBudgetVsExpenditure
// } = require('../services/reportService');
// const {
//   generateGeneralLedgerBook,
//   generateSubLedgerBook,
//   generateCashBankBook
// } = require('../services/bookService');

// // Reports
// async function getTrialBalance(req, res) {
//   try {
//     const { projectId } = req.params;
//     const { from, to } = req.query;

//     if (!from || !to) {
//       return res.status(400).json({ message: 'Date range (from and to) is required' });
//     }

//     const dateFrom = new Date(from);
//     const dateTo = new Date(to);

//     const trialBalance = await generateTrialBalance(projectId, dateFrom, dateTo);

//     res.json({ trialBalance });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function getIncomeStatement(req, res) {
//   try {
//     const { projectId } = req.params;
//     const { from, to } = req.query;

//     if (!from || !to) {
//       return res.status(400).json({ message: 'Date range (from and to) is required' });
//     }

//     const dateFrom = new Date(from);
//     const dateTo = new Date(to);

//     const incomeStatement = await generateIncomeStatement(projectId, dateFrom, dateTo);

//     res.json({ incomeStatement });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function getBalanceSheet(req, res) {
//   try {
//     const { projectId } = req.params;
//     const { asOfDate } = req.query;

//     if (!asOfDate) {
//       return res.status(400).json({ message: 'asOfDate is required' });
//     }

//     const date = new Date(asOfDate);

//     const balanceSheet = await generateBalanceSheet(projectId, date);

//     res.json({ balanceSheet });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function getFundAccountability(req, res) {
//   try {
//     const { projectId } = req.params;
//     const { from, to } = req.query;

//     if (!from || !to) {
//       return res.status(400).json({ message: 'Date range (from and to) is required' });
//     }

//     const dateFrom = new Date(from);
//     const dateTo = new Date(to);

//     const fundAccountability = await generateFundAccountability(projectId, dateFrom, dateTo);

//     res.json({ fundAccountability });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function getBudgetVsExpenditure(req, res) {
//   try {
//     const { projectId } = req.params;
//     const { from, to } = req.query;

//     if (!from || !to) {
//       return res.status(400).json({ message: 'Date range (from and to) is required' });
//     }

//     const dateFrom = new Date(from);
//     const dateTo = new Date(to);

//     const report = await generateBudgetVsExpenditure(projectId, dateFrom, dateTo);

//     res.json({ report });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// // Books
// async function getGeneralLedgerBook(req, res) {
//   try {
//     const { projectId } = req.params;
//     const { ledgerId, from, to } = req.query;

//     if (!ledgerId || !from || !to) {
//       return res.status(400).json({ message: 'ledgerId, from, and to are required' });
//     }

//     const dateFrom = new Date(from);
//     const dateTo = new Date(to);

//     const book = await generateGeneralLedgerBook(projectId, ledgerId, dateFrom, dateTo);

//     res.json({ book });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function getSubLedgerBook(req, res) {
//   try {
//     const { projectId } = req.params;
//     const { subLedgerId, from, to } = req.query;

//     if (!subLedgerId || !from || !to) {
//       return res.status(400).json({ message: 'subLedgerId, from, and to are required' });
//     }

//     const dateFrom = new Date(from);
//     const dateTo = new Date(to);

//     const book = await generateSubLedgerBook(projectId, subLedgerId, dateFrom, dateTo);

//     res.json({ book });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function getCashBankBook(req, res) {
//   try {
//     const { projectId } = req.params;
//     const { from, to } = req.query;

//     if (!from || !to) {
//       return res.status(400).json({ message: 'Date range (from and to) is required' });
//     }

//     const dateFrom = new Date(from);
//     const dateTo = new Date(to);

//     const book = await generateCashBankBook(projectId, dateFrom, dateTo);

//     res.json({ book });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// module.exports = {
//   getTrialBalance,
//   getIncomeStatement,
//   getBalanceSheet,
//   getFundAccountability,
//   getBudgetVsExpenditure,
//   getGeneralLedgerBook,
//   getSubLedgerBook,
//   getCashBankBook
// };

const {
  generateTrialBalance,
  generateIncomeStatement,
  generateBalanceSheet,
  generateFundAccountability,
  generateBudgetVsExpenditure
} = require('../services/reportService');
const {
  generateGeneralLedgerBook,
  generateSubLedgerBook,
  generateCashBankBook
} = require('../services/bookService');

// Reports
async function getTrialBalance(req, res) {
  try {
    const { projectId } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: 'Date range (from and to) is required' });
    }

    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const trialBalance = await generateTrialBalance(projectId, dateFrom, dateTo);

    res.json(trialBalance);  // ✅ Removed wrapper
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getIncomeStatement(req, res) {
  try {
    const { projectId } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: 'Date range (from and to) is required' });
    }

    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const incomeStatement = await generateIncomeStatement(projectId, dateFrom, dateTo);

    res.json(incomeStatement);  // ✅ Removed wrapper
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getBalanceSheet(req, res) {
  try {
    const { projectId } = req.params;
    const { asOfDate } = req.query;

    if (!asOfDate) {
      return res.status(400).json({ message: 'asOfDate is required' });
    }

    const date = new Date(asOfDate);

    const balanceSheet = await generateBalanceSheet(projectId, date);

    res.json(balanceSheet);  // ✅ Removed wrapper
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getFundAccountability(req, res) {
  try {
    const { projectId } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: 'Date range (from and to) is required' });
    }

    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const fundAccountability = await generateFundAccountability(projectId, dateFrom, dateTo);

    res.json(fundAccountability);  // ✅ Removed wrapper
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getBudgetVsExpenditure(req, res) {
  try {
    const { projectId } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: 'Date range (from and to) is required' });
    }

    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const report = await generateBudgetVsExpenditure(projectId, dateFrom, dateTo);

    res.json(report);  // ✅ Removed wrapper
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Books
async function getGeneralLedgerBook(req, res) {
  try {
    const { projectId } = req.params;
    const { ledgerId, from, to } = req.query;

    if (!ledgerId || !from || !to) {
      return res.status(400).json({ message: 'ledgerId, from, and to are required' });
    }

    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const book = await generateGeneralLedgerBook(projectId, ledgerId, dateFrom, dateTo);

    res.json(book);  // ✅ Removed wrapper
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSubLedgerBook(req, res) {
  try {
    const { projectId } = req.params;
    const { subLedgerId, from, to } = req.query;

    if (!subLedgerId || !from || !to) {
      return res.status(400).json({ message: 'subLedgerId, from, and to are required' });
    }

    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const book = await generateSubLedgerBook(projectId, subLedgerId, dateFrom, dateTo);

    res.json(book);  // ✅ Removed wrapper
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCashBankBook(req, res) {
  try {
    const { projectId } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: 'Date range (from and to) is required' });
    }

    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const book = await generateCashBankBook(projectId, dateFrom, dateTo);

    res.json(book);  // ✅ Removed wrapper
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getTrialBalance,
  getIncomeStatement,
  getBalanceSheet,
  getFundAccountability,
  getBudgetVsExpenditure,
  getGeneralLedgerBook,
  getSubLedgerBook,
  getCashBankBook
};