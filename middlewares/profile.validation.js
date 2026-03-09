import { body, validationResult } from 'express-validator';
import { DONOR_ROLE, STAFF_ROLE } from '../helpers/role-constants.js';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const normalizeRole = (roleName) => (roleName || '').trim().toUpperCase();

const handleValidationErrors = (req, res, next) => {
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

export const validateCreateProfile = [
  body('userId').trim().notEmpty().withMessage('userId es obligatorio'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('email es obligatorio')
    .isEmail()
    .withMessage('email debe tener un formato válido'),

  body('password')
    .notEmpty()
    .withMessage('password es obligatorio')
    .isLength({ min: 8, max: 255 })
    .withMessage('password debe tener entre 8 y 255 caracteres'),

  body('roleName')
    .trim()
    .notEmpty()
    .withMessage('roleName es obligatorio'),

  body('donorData.bloodType')
    .if((_, { req }) => normalizeRole(req.body.roleName) === DONOR_ROLE)
    .notEmpty()
    .withMessage('donorData.bloodType es obligatorio para Donantes')
    .isIn(BLOOD_TYPES)
    .withMessage('donorData.bloodType inválido'),

  body('staffData.position')
    .if((_, { req }) => normalizeRole(req.body.roleName) === STAFF_ROLE)
    .trim()
    .notEmpty()
    .withMessage('staffData.position es obligatorio para Staff'),

  body('staffData.department')
    .if((_, { req }) => normalizeRole(req.body.roleName) === STAFF_ROLE)
    .trim()
    .notEmpty()
    .withMessage('staffData.department es obligatorio para Staff'),

  handleValidationErrors,
];