import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { ALLOWED_ROLES } from '../helpers/role-constants.js';
import {
  isValidBloodType,
  VALID_BLOOD_TYPES,
} from '../utils/blood-compatibility.js';
import { BLOOD_STOCK_AUDIT_ACTIONS } from '../utils/audit-constants.js';

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

  body('bloodType')
    .trim()
    .notEmpty()
    .withMessage('El tipo de sangre es obligatorio')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('bloodType debe ser uno de: A+, A-, B+, B-, AB+, AB-, O+, O-'),

  body('zone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('zone debe tener entre 2 y 100 caracteres'),

  body('municipality')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('municipality debe tener entre 2 y 100 caracteres'),

  body().custom((_, { req }) => {
    const hasZone =
      typeof req.body?.zone === 'string' && req.body.zone.trim().length > 0;
    const hasMunicipality =
      typeof req.body?.municipality === 'string' &&
      req.body.municipality.trim().length > 0;

    if (!hasZone && !hasMunicipality) {
      throw new Error('Debes enviar zone o municipality para registrar al donador');
    }

    return true;
  }),

  body().custom((_, { req }) => {
    if (!req.file) {
      throw new Error('La foto de perfil es obligatoria (campo profilePicture)');
    }

    return true;
  }),

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

export const validateCreateAppointment = [
  body('date')
    .trim()
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('La fecha debe tener formato YYYY-MM-DD'),

  body('time')
    .trim()
    .notEmpty()
    .withMessage('La hora es obligatoria')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('La hora debe tener formato HH:mm'),

  handleValidationErrors,
];

export const validateStaffAgendaQuery = [
  query('date')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('date debe tener formato YYYY-MM-DD'),

  handleValidationErrors,
];

export const validateAppointmentIdParam = [
  param('appointmentId')
    .trim()
    .notEmpty()
    .withMessage('appointmentId es obligatorio')
    .custom((value) => mongoose.isValidObjectId(value))
    .withMessage('appointmentId no es un ObjectId válido'),

  handleValidationErrors,
];

export const validateWalletUserIdParam = [
  param('userId')
    .trim()
    .notEmpty()
    .withMessage('userId es obligatorio')
    .isLength({ min: 12, max: 12 })
    .withMessage('userId debe tener 12 caracteres'),

  handleValidationErrors,
];

export const validateRewardIdParam = [
  param('rewardId')
    .trim()
    .notEmpty()
    .withMessage('rewardId es obligatorio')
    .isLength({ min: 12, max: 12 })
    .withMessage('rewardId debe tener 12 caracteres'),

  handleValidationErrors,
];

export const validateCreateReward = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name es obligatorio')
    .isLength({ min: 2, max: 120 })
    .withMessage('name debe tener entre 2 y 120 caracteres'),

  body('requiredPoints')
    .notEmpty()
    .withMessage('requiredPoints es obligatorio')
    .isInt({ min: 1, max: 100000 })
    .withMessage('requiredPoints debe ser un entero entre 1 y 100000')
    .toInt(),

  body('stock')
    .notEmpty()
    .withMessage('stock es obligatorio')
    .isInt({ min: 0, max: 100000 })
    .withMessage('stock debe ser un entero entre 0 y 100000')
    .toInt(),

  handleValidationErrors,
];

export const validateUpdateReward = [
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('name debe tener entre 2 y 120 caracteres'),

  body('requiredPoints')
    .optional()
    .isInt({ min: 1, max: 100000 })
    .withMessage('requiredPoints debe ser un entero entre 1 y 100000')
    .toInt(),

  body('stock')
    .optional()
    .isInt({ min: 0, max: 100000 })
    .withMessage('stock debe ser un entero entre 0 y 100000')
    .toInt(),

  body('status')
    .optional()
    .isBoolean()
    .withMessage('status debe ser booleano')
    .toBoolean(),

  body().custom((_, { req }) => {
    const allowed = ['name', 'requiredPoints', 'stock', 'status'];
    const sent = Object.keys(req.body || {});

    if (sent.length === 0) {
      throw new Error('Debes enviar al menos un campo para actualizar');
    }

    const invalid = sent.filter((key) => !allowed.includes(key));
    if (invalid.length > 0) {
      throw new Error(`Campos no permitidos: ${invalid.join(', ')}`);
    }

    return true;
  }),

  handleValidationErrors,
];

export const validateRedeemReward = [
  body('rewardId')
    .trim()
    .notEmpty()
    .withMessage('rewardId es obligatorio')
    .isLength({ min: 12, max: 12 })
    .withMessage('rewardId debe tener 12 caracteres'),

  body('quantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('quantity debe ser un entero entre 1 y 100')
    .toInt(),

  handleValidationErrors,
];

export const validateConfirmAppointment = [
  body('staffUserId')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 12, max: 12 })
    .withMessage('staffUserId debe tener 12 caracteres'),

  handleValidationErrors,
];

export const validateIotWeightDonation = [
  body('appointmentId')
    .trim()
    .notEmpty()
    .withMessage('appointmentId es obligatorio')
    .custom((value) => mongoose.isValidObjectId(value))
    .withMessage('appointmentId debe ser un ObjectId valido'),

  body('weightGrams')
    .notEmpty()
    .withMessage('weightGrams es obligatorio')
    .isFloat({ gt: 0, max: 600 })
    .withMessage('weightGrams debe ser un numero mayor a 0 y no mayor a 600')
    .toFloat(),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 300 })
    .withMessage('notes no puede exceder 300 caracteres'),

  body('deviceId')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 80 })
    .withMessage('deviceId no puede exceder 80 caracteres'),

  handleValidationErrors,
];

export const validateCreateTriage = [
  body('edadAnios')
    .notEmpty()
    .withMessage('edadAnios es obligatorio')
    .isInt({ min: 0, max: 120 })
    .withMessage('edadAnios debe ser un entero entre 0 y 120')
    .toInt(),

  body('pesoKg')
    .notEmpty()
    .withMessage('pesoKg es obligatorio')
    .isFloat({ gt: 0, max: 400 })
    .withMessage('pesoKg debe ser un numero mayor a 0')
    .toFloat(),

  body('pulsoBpm')
    .notEmpty()
    .withMessage('pulsoBpm es obligatorio')
    .isInt({ min: 20, max: 220 })
    .withMessage('pulsoBpm debe ser un entero entre 20 y 220')
    .toInt(),

  body('presionSistolicaMmHg')
    .notEmpty()
    .withMessage('presionSistolicaMmHg es obligatorio')
    .isInt({ min: 60, max: 260 })
    .withMessage('presionSistolicaMmHg debe ser un entero entre 60 y 260')
    .toInt(),

  body('presionDiastolicaMmHg')
    .notEmpty()
    .withMessage('presionDiastolicaMmHg es obligatorio')
    .isInt({ min: 30, max: 180 })
    .withMessage('presionDiastolicaMmHg debe ser un entero entre 30 y 180')
    .toInt(),

  body('temperaturaC')
    .notEmpty()
    .withMessage('temperaturaC es obligatorio')
    .isFloat({ min: 32, max: 43 })
    .withMessage('temperaturaC debe ser un numero entre 32 y 43')
    .toFloat(),

  body('hemoglobinaGdl')
    .notEmpty()
    .withMessage('hemoglobinaGdl es obligatorio')
    .isFloat({ min: 3, max: 25 })
    .withMessage('hemoglobinaGdl debe ser un numero entre 3 y 25')
    .toFloat(),

  body('tieneFiebre')
    .notEmpty()
    .withMessage('tieneFiebre es obligatorio')
    .isBoolean()
    .withMessage('tieneFiebre debe ser booleano')
    .toBoolean(),

  body('tieneSintomasInfeccion')
    .notEmpty()
    .withMessage('tieneSintomasInfeccion es obligatorio')
    .isBoolean()
    .withMessage('tieneSintomasInfeccion debe ser booleano')
    .toBoolean(),

  body('tieneEnfermedadCronica')
    .notEmpty()
    .withMessage('tieneEnfermedadCronica es obligatorio')
    .isBoolean()
    .withMessage('tieneEnfermedadCronica debe ser booleano')
    .toBoolean(),

  body('enfermedadCronicaControlada')
    .notEmpty()
    .withMessage('enfermedadCronicaControlada es obligatorio')
    .isBoolean()
    .withMessage('enfermedadCronicaControlada debe ser booleano')
    .toBoolean(),

  body('consumioAlcoholUltimas24h')
    .notEmpty()
    .withMessage('consumioAlcoholUltimas24h es obligatorio')
    .isBoolean()
    .withMessage('consumioAlcoholUltimas24h debe ser booleano')
    .toBoolean(),

  body('tomoAntibioticosUltimos7d')
    .notEmpty()
    .withMessage('tomoAntibioticosUltimos7d es obligatorio')
    .isBoolean()
    .withMessage('tomoAntibioticosUltimos7d debe ser booleano')
    .toBoolean(),

  body('embarazadaOLactando')
    .notEmpty()
    .withMessage('embarazadaOLactando es obligatorio')
    .isBoolean()
    .withMessage('embarazadaOLactando debe ser booleano')
    .toBoolean(),

  body('tuvoTatuajeOPiercing')
    .notEmpty()
    .withMessage('tuvoTatuajeOPiercing es obligatorio')
    .isBoolean()
    .withMessage('tuvoTatuajeOPiercing debe ser booleano')
    .toBoolean(),

  body('tuvoCirugiaReciente')
    .notEmpty()
    .withMessage('tuvoCirugiaReciente es obligatorio')
    .isBoolean()
    .withMessage('tuvoCirugiaReciente debe ser booleano')
    .toBoolean(),

  body('fechaUltimoTatuajeOPiercing')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('fechaUltimoTatuajeOPiercing debe tener formato de fecha valida')
    .toDate(),

  body('fechaUltimaCirugia')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('fechaUltimaCirugia debe tener formato de fecha valida')
    .toDate(),

  body('fechaUltimaDonacion')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('fechaUltimaDonacion debe tener formato de fecha valida')
    .toDate(),

  body().custom((_, { req }) => {
    const {
      tuvoTatuajeOPiercing,
      fechaUltimoTatuajeOPiercing,
      tuvoCirugiaReciente,
      fechaUltimaCirugia,
      fechaUltimaDonacion,
      tieneEnfermedadCronica,
      enfermedadCronicaControlada,
    } = req.body;

    const now = new Date();

    if (tuvoTatuajeOPiercing && !fechaUltimoTatuajeOPiercing) {
      throw new Error(
        'Si tuvoTatuajeOPiercing es true, debe enviar fechaUltimoTatuajeOPiercing'
      );
    }

    if (!tuvoTatuajeOPiercing && fechaUltimoTatuajeOPiercing) {
      throw new Error(
        'No envies fechaUltimoTatuajeOPiercing cuando tuvoTatuajeOPiercing es false'
      );
    }

    if (tuvoCirugiaReciente && !fechaUltimaCirugia) {
      throw new Error('Si tuvoCirugiaReciente es true, debe enviar fechaUltimaCirugia');
    }

    if (!tuvoCirugiaReciente && fechaUltimaCirugia) {
      throw new Error('No envies fechaUltimaCirugia cuando tuvoCirugiaReciente es false');
    }

    if (!tieneEnfermedadCronica && !enfermedadCronicaControlada) {
      throw new Error(
        'enfermedadCronicaControlada no puede ser false cuando tieneEnfermedadCronica es false'
      );
    }

    const tattooDate = fechaUltimoTatuajeOPiercing
      ? new Date(fechaUltimoTatuajeOPiercing)
      : null;
    const surgeryDate = fechaUltimaCirugia ? new Date(fechaUltimaCirugia) : null;
    const donationDate = fechaUltimaDonacion ? new Date(fechaUltimaDonacion) : null;

    if (tattooDate && tattooDate > now) {
      throw new Error('fechaUltimoTatuajeOPiercing no puede ser una fecha futura');
    }

    if (surgeryDate && surgeryDate > now) {
      throw new Error('fechaUltimaCirugia no puede ser una fecha futura');
    }

    if (donationDate && donationDate > now) {
      throw new Error('fechaUltimaDonacion no puede ser una fecha futura');
    }

    return true;
  }),

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

export const validateAdminUpdateUser = [
  param('userId')
    .trim()
    .notEmpty()
    .withMessage('userId es obligatorio')
    .isLength({ min: 12, max: 12 })
    .withMessage('userId debe tener 12 caracteres'),

  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage('name debe tener entre 1 y 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('name solo puede contener letras y espacios'),

  body('surname')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage('surname debe tener entre 1 y 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('surname solo puede contener letras y espacios'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\d{8}$/)
    .withMessage('phone debe tener exactamente 8 dígitos'),

  body('zone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('zone debe tener entre 2 y 100 caracteres'),

  body('municipality')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('municipality debe tener entre 2 y 100 caracteres'),

  body('status')
    .optional()
    .isBoolean()
    .withMessage('status debe ser booleano')
    .toBoolean(),

  body().custom((_, { req }) => {
    const allowed = ['name', 'surname', 'phone', 'zone', 'municipality', 'status'];
    const sent = Object.keys(req.body || {});

    if (sent.length === 0) {
      throw new Error('Debes enviar al menos un campo para actualizar');
    }

    const invalid = sent.filter((key) => !allowed.includes(key));

    if (invalid.length > 0) {
      throw new Error(`Campos no permitidos: ${invalid.join(', ')}`);
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

export const validateBloodMatchParams = [
  param('requiredBloodType')
    .trim()
    .notEmpty()
    .withMessage('requiredBloodType es obligatorio')
    .custom((value) => {
      if (!isValidBloodType(value)) {
        throw new Error(
          `requiredBloodType debe ser uno de: ${VALID_BLOOD_TYPES.join(', ')}`
        );
      }

      return true;
    }),

  query('minVolumeMl')
    .optional()
    .isInt({ min: 1, max: 600 })
    .withMessage('minVolumeMl debe ser un entero entre 1 y 600')
    .toInt(),

  handleValidationErrors,
];

export const validateAuditQuery = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 100000 })
    .withMessage('page debe ser un entero mayor o igual a 1')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit debe ser un entero entre 1 y 100')
    .toInt(),

  query('action')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      const normalized = String(value || '').trim().toUpperCase();

      if (!BLOOD_STOCK_AUDIT_ACTIONS.includes(normalized)) {
        throw new Error(
          `action debe ser uno de: ${BLOOD_STOCK_AUDIT_ACTIONS.join(', ')}`
        );
      }

      return true;
    }),

  query('bloodType')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!isValidBloodType(value)) {
        throw new Error(
          `bloodType debe ser uno de: ${VALID_BLOOD_TYPES.join(', ')}`
        );
      }

      return true;
    }),

  query('performedByUserId')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 12, max: 12 })
    .withMessage('performedByUserId debe tener 12 caracteres'),

  query('from')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('from debe ser una fecha valida en formato ISO8601')
    .toDate(),

  query('to')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('to debe ser una fecha valida en formato ISO8601')
    .toDate(),

  query().custom((_, { req }) => {
    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;

    if (from && to && from > to) {
      throw new Error('from no puede ser mayor que to');
    }

    return true;
  }),

  handleValidationErrors,
];

export const validateStockSummaryQuery = [
  query('bloodType')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!isValidBloodType(value)) {
        throw new Error(
          `bloodType debe ser uno de: ${VALID_BLOOD_TYPES.join(', ')}`
        );
      }

      return true;
    }),

  query('includeBags')
    .optional()
    .isBoolean()
    .withMessage('includeBags debe ser booleano')
    .toBoolean(),

  query().custom((_, { req }) => {
    if (req.query.includeBags === true && !req.query.bloodType) {
      throw new Error('Para includeBags=true debes enviar bloodType');
    }

    return true;
  }),

  handleValidationErrors,
];
