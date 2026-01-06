const express = require('express');
const router = express.Router();
const {
  getTrialBalance,
  getIncomeStatement,
  getBalanceSheet,
  getFundAccountability,
  getBudgetVsExpenditure,
  getGeneralLedgerBook,
  getSubLedgerBook,
  getCashBankBook
} = require('../controllers/reportController');
const { authenticate, ensureProjectAccess } = require('../middleware/auth');

router.use(authenticate);

// Reports
router.get('/projects/:projectId/reports/trial-balance', ensureProjectAccess, getTrialBalance);
router.get('/projects/:projectId/reports/income-statement', ensureProjectAccess, getIncomeStatement);
router.get('/projects/:projectId/reports/balance-sheet', ensureProjectAccess, getBalanceSheet);
router.get('/projects/:projectId/reports/fund-accountability', ensureProjectAccess, getFundAccountability);
router.get('/projects/:projectId/reports/budget-vs-expenditure', ensureProjectAccess, getBudgetVsExpenditure);

// Books
router.get('/projects/:projectId/books/general-ledger', ensureProjectAccess, getGeneralLedgerBook);
router.get('/projects/:projectId/books/sub-ledger', ensureProjectAccess, getSubLedgerBook);
router.get('/projects/:projectId/books/cash-bank', ensureProjectAccess, getCashBankBook);

module.exports = router;

