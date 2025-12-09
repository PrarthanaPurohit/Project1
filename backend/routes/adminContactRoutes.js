const express = require('express');
const router = express.Router();
const { 
  getAdminContacts, 
  deleteContact 
} = require('../controllers/contactController');
const authenticate = require('../middleware/auth');

// All routes are protected with authentication middleware
router.get('/', authenticate, getAdminContacts);
router.delete('/:id', authenticate, deleteContact);

module.exports = router;
