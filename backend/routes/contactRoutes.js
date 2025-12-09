const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { validateContactForm, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.post('/', validateContactForm, handleValidationErrors, submitContact);

module.exports = router;
