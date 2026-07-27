import { body, param } from 'express-validator';
import { handleValidationErrors } from './validation.js';
import { TRIAGE_REVIEW_STATUSES } from '../src/triage/triage.model.js';

export const validateUpdateTriageStatus = [
  param('id').isMongoId().withMessage('id de triaje inválido'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('status es obligatorio')
    .isIn(TRIAGE_REVIEW_STATUSES)
    .withMessage(`status debe ser uno de: ${TRIAGE_REVIEW_STATUSES.join(', ')}`),

  handleValidationErrors,
];
