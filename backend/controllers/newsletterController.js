const Newsletter = require('../models/Newsletter');

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/newsletter/subscribe
 * @access  Public
 */
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to the newsletter'
        });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = Date.now();
        await existingSubscription.save();
        
        return res.status(200).json({
          success: true,
          message: 'Newsletter subscription reactivated successfully',
          data: existingSubscription
        });
      }
    }

    // Create new subscription
    const subscription = await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscription
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      const validationError = new Error(messages.join(', '));
      validationError.status = 400;
      return next(validationError);
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const duplicateError = new Error('This email is already subscribed to the newsletter');
      duplicateError.status = 400;
      return next(duplicateError);
    }
    
    next(error);
  }
};

/**
 * @desc    Get all newsletter subscriptions (Admin)
 * @route   GET /api/admin/subscriptions
 * @access  Private/Admin
 */
exports.getAdminSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Newsletter.find().sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete newsletter subscription (Admin)
 * @route   DELETE /api/admin/subscriptions/:id
 * @access  Private/Admin
 */
exports.deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Newsletter.findById(req.params.id);

    if (!subscription) {
      const error = new Error('Newsletter subscription not found');
      error.status = 404;
      return next(error);
    }

    await subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Newsletter subscription deleted successfully',
      data: {}
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      const castError = new Error('Invalid subscription ID');
      castError.status = 400;
      return next(castError);
    }
    next(error);
  }
};
