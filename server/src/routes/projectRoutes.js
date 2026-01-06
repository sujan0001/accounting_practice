const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  loadProject,
  getActiveProject
} = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/active', getActiveProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:projectId/load', loadProject);

module.exports = router;

