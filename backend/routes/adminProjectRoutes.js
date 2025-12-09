const express = require('express');
const router = express.Router();
const { 
  getAdminProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateProject, handleValidationErrors } = require('../middleware/validation');

// All routes are protected with authentication middleware
router.get('/', authenticate, getAdminProjects);
router.post(
  '/', 
  authenticate, 
  upload.single('image'), 
  validateProject, 
  handleValidationErrors, 
  createProject
);
router.put(
  '/:id', 
  authenticate, 
  upload.single('image'), 
  validateProject, 
  handleValidationErrors, 
  updateProject
);
router.delete('/:id', authenticate, deleteProject);

module.exports = router;
