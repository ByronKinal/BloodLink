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

router.use(authRateLimit);

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', validateRefreshToken, refreshToken);
router.post('/logout', validateRefreshToken, logout);

router.post('/verify-email', validateVerifyEmail, verifyEmail);
router.post(
  '/resend-verification',
  emailRateLimit,
  validateResendVerification,
  resendVerification
);
router.post('/forgot-password', emailRateLimit, validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

export default router;
