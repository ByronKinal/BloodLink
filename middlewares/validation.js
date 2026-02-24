import { body, validationResult } from 'express-validator';
import { DONOR_ROLE, STAFF_ROLE } from '../helpers/role-constants.js';

/**
 * Middleware para procesar resultados de validación
 */
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

/**
 * Validaciones para el registro de usuario
 */
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

/**
 * Validaciones para el login
 */
export const validateLogin = [
  body('emailOrUsername')
    .trim()
    .notEmpty()
    .withMessage('Email o nombre de usuario es requerido'),

  body('password').notEmpty().withMessage('La contraseña es requerida'),

  handleValidationErrors,
];

/**
 * Validaciones para verificación de email
 */
export const validateVerifyEmail = [
  body('token').notEmpty().withMessage('El token de verificación es requerido'),

  handleValidationErrors,
];

/**
 * Validaciones para reenvío de verificación
 */
export const validateResendVerification = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  handleValidationErrors,
];

/**
 * Validaciones para forgot password
 */
export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  handleValidationErrors,
];

/**
 * Validaciones para reset password
 */
export const validateResetPassword = [
  body('token').notEmpty().withMessage('El token de recuperación es requerido'),

  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres'),

  handleValidationErrors,
];

/**
 * Validaciones para crear usuario (Admin/Staff)
 */
export const validateCreateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 25 })
    .withMessage('El nombre no puede tener más de 25 caracteres'),

  body('surname')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ max: 25 })
    .withMessage('El apellido no puede tener más de 25 caracteres'),

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
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),

  body('phone')
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .isLength({ min: 8, max: 8 })
    .withMessage('El teléfono debe tener 8 números')
    .isNumeric()
    .withMessage('El teléfono solo debe contener números'),

  body('role')
    .optional()
    .isIn([DONOR_ROLE, STAFF_ROLE, 'ADMIN', 'STAFF', 'DONOR']) // Support both formats if legacy code exists
    .withMessage('Rol inválido'),

  // Validaciones condicionales según el rol
  body('bloodType')
    .if((value, { req }) => req.body.role === DONOR_ROLE || req.body.role === 'DONOR')
    .notEmpty()
    .withMessage('El tipo de sangre es obligatorio para donantes')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Tipo de sangre inválido'),

  body('staffPosition')
    .if((value, { req }) => req.body.role === STAFF_ROLE || req.body.role === 'STAFF')
    .notEmpty()
    .withMessage('El cargo es obligatorio para el personal (staff)'),

  handleValidationErrors,
];

/**
 * Validaciones para actualizar usuario
 */
export const validateUpdateUser = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío'),
    
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido'),

  handleValidationErrors,
];

/**
 * Validaciones para crear perfil
 */
export const validateCreateProfile = [
    body('phone').notEmpty().withMessage('Teléfono requerido'),
    handleValidationErrors
];
