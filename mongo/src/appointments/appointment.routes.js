import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  confirmAppointment,
  createAppointment,
  getStaffAgenda,
  listAppointments,
} from './appointment.controller.js';
import { cancelAppointment, getAvailability } from './appointment-actions.controller.js';
import {
  validateAppointmentIdParam,
  validateAvailabilityQuery,
  validateConfirmAppointment,
  validateCreateAppointment,
  validateStaffAgendaQuery,
} from '../../middlewares/validation.js';

const router = Router();

router.get('/', validateJWT, listAppointments);
router.post('/', validateJWT, validateCreateAppointment, createAppointment);
router.get('/staff', validateJWT, validateStaffAgendaQuery, getStaffAgenda);
router.get('/availability', validateJWT, validateAvailabilityQuery, getAvailability);
router.patch(
  '/:appointmentId/confirm',
  validateJWT,
  validateAppointmentIdParam,
  validateConfirmAppointment,
  confirmAppointment
);
router.patch(
  '/:appointmentId/cancel',
  validateJWT,
  validateAppointmentIdParam,
  cancelAppointment
);

export default router;
