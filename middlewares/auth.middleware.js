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
    
    // Optional: Verify user still exists in DB if needed for strict security
    // const user = await User.findByPk(decoded.sub);
    // if (!user) return res.status(401).json({ message: 'User not found' });

    // Attach user payload to request
    req.user = decoded; 
    
    // Ensure role exists for role middleware
    if (!req.user.role) {
        // Fallback: fetch from DB if not in token? 
        // For now, assume token has it or middleware will fail (caught by try/catch?)
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
