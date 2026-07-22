import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  confirmAppointment,
  createAppointment,
  getStaffAgenda,
  listAppointments,
} from './appointment.controller.js';
import {
  validateAppointmentIdParam,
  validateConfirmAppointment,
  validateCreateAppointment,
  validateStaffAgendaQuery,
} from '../../middlewares/validation.js';

const router = Router();

router.get('/', validateJWT, listAppointments);
router.post('/', validateJWT, validateCreateAppointment, createAppointment);
router.get('/staff', validateJWT, validateStaffAgendaQuery, getStaffAgenda);
router.patch(
  '/:appointmentId/confirm',
  validateJWT,
  validateAppointmentIdParam,
  validateConfirmAppointment,
  confirmAppointment
);

export default router;
