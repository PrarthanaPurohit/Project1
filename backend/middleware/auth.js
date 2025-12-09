const { verifyToken } = require('../utils/jwt');

/**
 * Authentication middleware to verify JWT tokens
 * Protects admin routes from unauthorized access
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }
    
    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Attach admin id to request object for use in routes
    req.adminId = decoded.id;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Authorization denied.'
    });
  }
};

module.exports = authenticate;
