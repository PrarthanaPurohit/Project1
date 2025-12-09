const express = require('express');
const router = express.Router();
const { 
  getAdminSubscriptions, 
  deleteSubscription 
} = require('../controllers/newsletterController');
const authenticate = require('../middleware/auth');

// All routes are protected with authentication middleware
router.get('/', authenticate, getAdminSubscriptions);
router.delete('/:id', authenticate, deleteSubscription);

module.exports = router;
