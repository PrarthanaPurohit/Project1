const express = require('express');
const router = express.Router();
const { 
  getAllProjects, 
  getAdminProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateProject, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.get('/', getAllProjects);

module.exports = router;
