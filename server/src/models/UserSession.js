const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  activeProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserSession', userSessionSchema);

