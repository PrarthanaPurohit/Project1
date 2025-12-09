const Contact = require('../models/Contact');

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContact = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, city } = req.body;

    // Create contact submission
    const contact = await Contact.create({
      fullName,
      email,
      mobileNumber,
      city
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      const validationError = new Error(messages.join(', '));
      validationError.status = 400;
      return next(validationError);
    }
    next(error);
  }
};

/**
 * @desc    Get all contact submissions (Admin)
 * @route   GET /api/admin/contacts
 * @access  Private/Admin
 */
exports.getAdminContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete contact submission (Admin)
 * @route   DELETE /api/admin/contacts/:id
 * @access  Private/Admin
 */
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      const error = new Error('Contact submission not found');
      error.status = 404;
      return next(error);
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contact submission deleted successfully',
      data: {}
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      const castError = new Error('Invalid contact ID');
      castError.status = 400;
      return next(castError);
    }
    next(error);
  }
};
