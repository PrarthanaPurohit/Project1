const multer = require('multer');

/**
 * Error handler middleware for file upload errors
 */
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field in file upload.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  } else if (err) {
    // Other errors (like file type validation)
    if (err.message.includes('Only image files')) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    // Pass to next error handler
    next(err);
  } else {
    next();
  }
};

module.exports = handleUploadError;
