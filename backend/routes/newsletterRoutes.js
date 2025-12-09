const express = require('express');
const router = express.Router();
const { subscribe } = require('../controllers/newsletterController');
const { validateNewsletterSubscription, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.post('/subscribe', validateNewsletterSubscription, handleValidationErrors, subscribe);

module.exports = router;
