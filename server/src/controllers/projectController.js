const Project = require('../models/Project');
const UserSession = require('../models/UserSession');

/**
 * Create new project
 */
async function createProject(req, res) {
  try {
    const { projectName, alias, panNo, financialYearFrom, financialYearTo, status, description } = req.body;

    const project = new Project({
      organization: req.organizationId,
      projectName,
      alias,
      panNo,
      financialYearFrom,
      financialYearTo,
      status: status || 'ongoing',
      description,
      createdBy: req.user._id
    });

    await project.save();
    await project.populate('organization');

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Get all projects for user's organization
 */
async function getProjects(req, res) {
  try {
    const projects = await Project.find({ organization: req.organizationId })
      .populate('organization')
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Get single project
 */
async function getProject(req, res) {
  try {
    const project = await Project.findById(req.params.id)
      .populate('organization');

    if (!project || project.organization._id.toString() !== req.organizationId.toString()) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Update project
 */
async function updateProject(req, res) {
  try {
    const { projectName, alias, panNo, financialYearFrom, financialYearTo, status, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project || project.organization.toString() !== req.organizationId.toString()) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.projectName = projectName || project.projectName;
    project.alias = alias || project.alias;
    project.panNo = panNo !== undefined ? panNo : project.panNo;
    project.financialYearFrom = financialYearFrom || project.financialYearFrom;
    project.financialYearTo = financialYearTo !== undefined ? financialYearTo : project.financialYearTo;
    project.status = status || project.status;
    project.description = description !== undefined ? description : project.description;
    project.updatedAt = new Date();

    await project.save();
    await project.populate('organization');

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Delete project (with validation - cannot delete if has transactions)
 */
async function deleteProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || project.organization.toString() !== req.organizationId.toString()) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if project has any transactions
    const Budget = require('../models/Budget');
    const JournalVoucher = require('../models/JournalVoucher');
    
    const budgetCount = await Budget.countDocuments({ project: project._id });
    const voucherCount = await JournalVoucher.countDocuments({ project: project._id });

    if (budgetCount > 0 || voucherCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete project with existing budgets or journal vouchers' 
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Load/Set active project
 */
async function loadProject(req, res) {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project || project.organization.toString() !== req.organizationId.toString()) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update or create user session
    await UserSession.findOneAndUpdate(
      { user: req.user._id },
      { 
        user: req.user._id,
        activeProject: projectId,
        lastActivity: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      message: 'Project loaded successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Get currently active project
 */
async function getActiveProject(req, res) {
  try {
    const session = await UserSession.findOne({ user: req.user._id })
      .populate('activeProject');

    if (!session || !session.activeProject) {
      return res.json({ project: null });
    }

    res.json({ project: session.activeProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  loadProject,
  getActiveProject
};

