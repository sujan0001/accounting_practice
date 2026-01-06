const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate user via JWT token
async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('organization');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    req.organizationId = user.organization._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Ensure resource belongs to user's organization
async function ensureProjectAccess(req, res, next) {
  try {
    const Project = require('../models/Project');
    const projectId = req.params.projectId || req.body.project;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.organization.toString() !== req.organizationId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.project = project;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error checking project access' });
  }
}

// Check user role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}

module.exports = {
  authenticate,
  ensureProjectAccess,
  requireRole
};

