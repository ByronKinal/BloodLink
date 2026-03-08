import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
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

export const validateConfirmAppointment = [
  body('staffUserId')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 16, max: 16 })
    .withMessage('staffUserId debe tener 16 caracteres'),

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
  body('ageYears')
    .notEmpty()
    .withMessage('ageYears es obligatorio')
    .isInt({ min: 0, max: 120 })
    .withMessage('ageYears debe ser un entero entre 0 y 120')
    .toInt(),

  body('weightKg')
    .notEmpty()
    .withMessage('weightKg es obligatorio')
    .isFloat({ gt: 0, max: 400 })
    .withMessage('weightKg debe ser un numero mayor a 0')
    .toFloat(),

  body('pulseBpm')
    .notEmpty()
    .withMessage('pulseBpm es obligatorio')
    .isInt({ min: 20, max: 220 })
    .withMessage('pulseBpm debe ser un entero entre 20 y 220')
    .toInt(),

  body('systolicMmHg')
    .notEmpty()
    .withMessage('systolicMmHg es obligatorio')
    .isInt({ min: 60, max: 260 })
    .withMessage('systolicMmHg debe ser un entero entre 60 y 260')
    .toInt(),

  body('diastolicMmHg')
    .notEmpty()
    .withMessage('diastolicMmHg es obligatorio')
    .isInt({ min: 30, max: 180 })
    .withMessage('diastolicMmHg debe ser un entero entre 30 y 180')
    .toInt(),

  body('temperatureC')
    .notEmpty()
    .withMessage('temperatureC es obligatorio')
    .isFloat({ min: 32, max: 43 })
    .withMessage('temperatureC debe ser un numero entre 32 y 43')
    .toFloat(),

  body('hemoglobinGdl')
    .notEmpty()
    .withMessage('hemoglobinGdl es obligatorio')
    .isFloat({ min: 3, max: 25 })
    .withMessage('hemoglobinGdl debe ser un numero entre 3 y 25')
    .toFloat(),

  body('hasFever')
    .notEmpty()
    .withMessage('hasFever es obligatorio')
    .isBoolean()
    .withMessage('hasFever debe ser booleano')
    .toBoolean(),

  body('hasInfectionSymptoms')
    .notEmpty()
    .withMessage('hasInfectionSymptoms es obligatorio')
    .isBoolean()
    .withMessage('hasInfectionSymptoms debe ser booleano')
    .toBoolean(),

  body('hasChronicDisease')
    .notEmpty()
    .withMessage('hasChronicDisease es obligatorio')
    .isBoolean()
    .withMessage('hasChronicDisease debe ser booleano')
    .toBoolean(),

  body('chronicDiseaseControlled')
    .notEmpty()
    .withMessage('chronicDiseaseControlled es obligatorio')
    .isBoolean()
    .withMessage('chronicDiseaseControlled debe ser booleano')
    .toBoolean(),

  body('consumedAlcoholLast24h')
    .notEmpty()
    .withMessage('consumedAlcoholLast24h es obligatorio')
    .isBoolean()
    .withMessage('consumedAlcoholLast24h debe ser booleano')
    .toBoolean(),

  body('tookAntibioticsLast7d')
    .notEmpty()
    .withMessage('tookAntibioticsLast7d es obligatorio')
    .isBoolean()
    .withMessage('tookAntibioticsLast7d debe ser booleano')
    .toBoolean(),

  body('pregnantOrBreastfeeding')
    .notEmpty()
    .withMessage('pregnantOrBreastfeeding es obligatorio')
    .isBoolean()
    .withMessage('pregnantOrBreastfeeding debe ser booleano')
    .toBoolean(),

  body('hadTattooOrPiercing')
    .notEmpty()
    .withMessage('hadTattooOrPiercing es obligatorio')
    .isBoolean()
    .withMessage('hadTattooOrPiercing debe ser booleano')
    .toBoolean(),

  body('hadRecentSurgery')
    .notEmpty()
    .withMessage('hadRecentSurgery es obligatorio')
    .isBoolean()
    .withMessage('hadRecentSurgery debe ser booleano')
    .toBoolean(),

  body('lastTattooOrPiercingDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('lastTattooOrPiercingDate debe tener formato de fecha valida')
    .toDate(),

  body('lastSurgeryDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('lastSurgeryDate debe tener formato de fecha valida')
    .toDate(),

  body('lastDonationDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('lastDonationDate debe tener formato de fecha valida')
    .toDate(),

  body().custom((_, { req }) => {
    const {
      hadTattooOrPiercing,
      lastTattooOrPiercingDate,
      hadRecentSurgery,
      lastSurgeryDate,
      lastDonationDate,
      hasChronicDisease,
      chronicDiseaseControlled,
    } = req.body;

    const now = new Date();

    if (hadTattooOrPiercing && !lastTattooOrPiercingDate) {
      throw new Error(
        'Si hadTattooOrPiercing es true, debe enviar lastTattooOrPiercingDate'
      );
    }

    if (!hadTattooOrPiercing && lastTattooOrPiercingDate) {
      throw new Error(
        'No envies lastTattooOrPiercingDate cuando hadTattooOrPiercing es false'
      );
    }

    if (hadRecentSurgery && !lastSurgeryDate) {
      throw new Error('Si hadRecentSurgery es true, debe enviar lastSurgeryDate');
    }

    if (!hadRecentSurgery && lastSurgeryDate) {
      throw new Error('No envies lastSurgeryDate cuando hadRecentSurgery es false');
    }

    if (!hasChronicDisease && !chronicDiseaseControlled) {
      throw new Error(
        'chronicDiseaseControlled no puede ser false cuando hasChronicDisease es false'
      );
    }

    const tattooDate = lastTattooOrPiercingDate
      ? new Date(lastTattooOrPiercingDate)
      : null;
    const surgeryDate = lastSurgeryDate ? new Date(lastSurgeryDate) : null;
    const donationDate = lastDonationDate ? new Date(lastDonationDate) : null;

    if (tattooDate && tattooDate > now) {
      throw new Error('lastTattooOrPiercingDate no puede ser una fecha futura');
    }

    if (surgeryDate && surgeryDate > now) {
      throw new Error('lastSurgeryDate no puede ser una fecha futura');
    }

    if (donationDate && donationDate > now) {
      throw new Error('lastDonationDate no puede ser una fecha futura');
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