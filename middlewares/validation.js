import { body, param, validationResult } from 'express-validator';
import { ALLOWED_ROLES } from '../helpers/role-constants.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 25 })
    .withMessage('El nombre no puede tener más de 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('surname')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ max: 25 })
    .withMessage('El apellido no puede tener más de 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El nombre de usuario no puede tener más de 50 caracteres'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo electrónico es obligatorio')
    .isEmail()
    .withMessage('El correo electrónico no tiene un formato válido')
    .isLength({ max: 150 })
    .withMessage('El correo electrónico no puede tener más de 150 caracteres'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8, max: 255 })
    .withMessage('La contraseña debe tener entre 8 y 255 caracteres'),

  body('phone')
    .notEmpty()
    .withMessage('El número de teléfono es obligatorio')
    .matches(/^\d{8}$/)
    .withMessage('El número de teléfono debe tener exactamente 8 dígitos'),

  handleValidationErrors,
];

export const validateLogin = [
  body('emailOrUsername')
    .trim()
    .notEmpty()
    .withMessage('Email o nombre de usuario es requerido'),

  body('password').notEmpty().withMessage('La contraseña es requerida'),

  handleValidationErrors,
];

export const validateAiAsk = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('La pregunta es obligatoria')
    .isLength({ min: 5, max: 800 })
    .withMessage('La pregunta debe tener entre 5 y 800 caracteres'),

  handleValidationErrors,
];

export const validateVerifyEmail = [
  body().custom((_, { req }) => {
    const token = req.body?.token;
    const email = req.body?.email;
    const activationCode = req.body?.activationCode;

    const hasToken = typeof token === 'string' && token.trim().length > 0;
    const hasEmailAndCode =
      typeof email === 'string' &&
      email.trim().length > 0 &&
      typeof activationCode === 'string' &&
      activationCode.trim().length > 0;

    if (!hasToken && !hasEmailAndCode) {
      throw new Error(
        'Debes enviar token o email + código de activación para verificar la cuenta'
      );
    }

    return true;
  }),

  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  body('activationCode')
    .optional({ checkFalsy: true })
    .matches(/^\d{6}$/)
    .withMessage('El código de activación debe tener 6 dígitos'),

  handleValidationErrors,
];

export const validateRefreshToken = [
  body('refreshToken')
    .trim()
    .notEmpty()
    .withMessage('El refresh token es requerido'),

  handleValidationErrors,
];

export const validateResendVerification = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  handleValidationErrors,
];

export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  handleValidationErrors,
];

export const validateResetPassword = [
  body('token').notEmpty().withMessage('El token de recuperación es requerido'),

  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres'),

  handleValidationErrors,
];

export const validateUpdateUserRole = [
  body('roleName')
    .trim()
    .notEmpty()
    .withMessage('roleName es obligatorio')
    .custom((value) => {
      const normalized = value.trim().toUpperCase();

      if (!ALLOWED_ROLES.includes(normalized)) {
        throw new Error(
          `Rol no permitido. Usa uno de: ${ALLOWED_ROLES.join(', ')}`
        );
      }

      return true;
    }),

  handleValidationErrors,
];

export const validateRoleParam = [
  param('roleName')
    .trim()
    .notEmpty()
    .withMessage('roleName es obligatorio')
    .custom((value) => {
      const normalized = value.trim().toUpperCase();

      if (!ALLOWED_ROLES.includes(normalized)) {
        throw new Error(
          `Rol no permitido. Usa uno de: ${ALLOWED_ROLES.join(', ')}`
        );
      }

      return true;
    }),

  handleValidationErrors,
];