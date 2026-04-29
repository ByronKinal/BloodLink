import { verifyJWT } from '../helpers/generate-jwt.js';
import { User } from '../src/users/user.model.js';

export const validateJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = await verifyJWT(token);
    
    req.user = decoded; 
    
    if (!req.user.role) {
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
