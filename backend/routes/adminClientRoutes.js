const express = require('express');
const router = express.Router();
const { 
  getAdminClients, 
  createClient, 
  updateClient, 
  deleteClient 
} = require('../controllers/clientController');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateClient, handleValidationErrors } = require('../middleware/validation');

// All routes are protected with authentication middleware
router.get('/', authenticate, getAdminClients);
router.post(
  '/', 
  authenticate, 
  upload.single('image'), 
  validateClient, 
  handleValidationErrors, 
  createClient
);
router.put(
  '/:id', 
  authenticate, 
  upload.single('image'), 
  validateClient, 
  handleValidationErrors, 
  updateClient
);
router.delete('/:id', authenticate, deleteClient);

module.exports = router;
