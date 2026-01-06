const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/masterController');
const { authenticate, ensureProjectAccess } = require('../middleware/auth');

router.use(authenticate);

// Account Types (read-only)
router.get('/account-types', getAccountTypes);

// Ledger Groups
router.post('/projects/:projectId/ledger-groups', ensureProjectAccess, createLedgerGroup);
router.get('/projects/:projectId/ledger-groups', ensureProjectAccess, getLedgerGroups);
router.get('/projects/:projectId/ledger-groups/:id', ensureProjectAccess, getLedgerGroup);
router.put('/projects/:projectId/ledger-groups/:id', ensureProjectAccess, updateLedgerGroup);
router.delete('/projects/:projectId/ledger-groups/:id', ensureProjectAccess, deleteLedgerGroup);

// General Ledgers
router.post('/projects/:projectId/general-ledgers', ensureProjectAccess, createGeneralLedger);
router.get('/projects/:projectId/general-ledgers', ensureProjectAccess, getGeneralLedgers);
router.get('/projects/:projectId/general-ledgers/:id', ensureProjectAccess, getGeneralLedger);
router.put('/projects/:projectId/general-ledgers/:id', ensureProjectAccess, updateGeneralLedger);
router.delete('/projects/:projectId/general-ledgers/:id', ensureProjectAccess, deleteGeneralLedger);

// Sub Ledgers
router.post('/projects/:projectId/sub-ledgers', ensureProjectAccess, createSubLedger);
router.get('/projects/:projectId/sub-ledgers', ensureProjectAccess, getSubLedgers);
router.get('/projects/:projectId/sub-ledgers/:id', ensureProjectAccess, getSubLedger);
router.put('/projects/:projectId/sub-ledgers/:id', ensureProjectAccess, updateSubLedger);
router.delete('/projects/:projectId/sub-ledgers/:id', ensureProjectAccess, deleteSubLedger);

module.exports = router;

