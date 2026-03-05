import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from './auth.controller.js';
import { authRateLimit, emailRateLimit } from '../../middlewares/request-limit.js';
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateVerifyEmail,
  validateResendVerification,
  validateForgotPassword,
  validateResetPassword,
} from '../../middlewares/validation.js';

const router = Router();

router.post('/register', authRateLimit, validateRegister, register);
router.post('/login', authRateLimit, validateLogin, login);
router.post('/refresh-token', authRateLimit, validateRefreshToken, refreshToken);
router.post('/logout', authRateLimit, validateRefreshToken, logout);

router.post('/verify-email', authRateLimit, validateVerifyEmail, verifyEmail);
router.post(
  '/resend-verification',
  emailRateLimit,
  validateResendVerification,
  resendVerification
);
router.post('/forgot-password', emailRateLimit, validateForgotPassword, forgotPassword);
router.post('/reset-password', authRateLimit, validateResetPassword, resetPassword);

export default router;
