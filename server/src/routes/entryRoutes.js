const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/entryController');
const { authenticate, ensureProjectAccess } = require('../middleware/auth');

router.use(authenticate);

// Budget routes
router.post('/projects/:projectId/budgets', ensureProjectAccess, createBudget);
router.get('/projects/:projectId/budgets', ensureProjectAccess, getBudgets);
router.get('/projects/:projectId/budgets/:id', ensureProjectAccess, getBudget);
router.put('/projects/:projectId/budgets/:id', ensureProjectAccess, updateBudget);
router.delete('/projects/:projectId/budgets/:id', ensureProjectAccess, deleteBudget);

// Journal Voucher routes
router.post('/projects/:projectId/journal-vouchers', ensureProjectAccess, createJournalVoucher);
router.get('/projects/:projectId/journal-vouchers', ensureProjectAccess, getJournalVouchers);
router.get('/projects/:projectId/journal-vouchers/:id', ensureProjectAccess, getJournalVoucher);
router.put('/projects/:projectId/journal-vouchers/:id', ensureProjectAccess, updateJournalVoucher);
router.delete('/projects/:projectId/journal-vouchers/:id', ensureProjectAccess, deleteJournalVoucher);

module.exports = router;

