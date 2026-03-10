import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import {
  buildAppointmentResponse,
  confirmAppointmentHelper,
  createAppointmentHelper,
  getAllAppointmentsHelper,
  getStaffAgendaHelper,
} from '../../helpers/appointment-operations.js';

export const createAppointment = asyncHandler(async (req, res) => {
  try {
    const { date, time } = req.body;

    const appointment = await createAppointmentHelper({
      donorUserId: req.userId,
      date,
      time,
    });

    return res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente. Pendiente de confirmación.',
      data: buildAppointmentResponse(appointment),
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || 'No se pudo crear la cita',
    });
  }
});

export const getStaffAgenda = asyncHandler(async (req, res) => {
  try {
    const { date } = req.query;

    const result = await getStaffAgendaHelper({
      requesterUserId: req.userId,
      date,
    });

    return res.status(200).json({
      success: true,
      date: result.selectedDate,
      data: result.appointments.map(buildAppointmentResponse),
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || 'No se pudo obtener la agenda',
    });
  }
});

export const confirmAppointment = asyncHandler(async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { staffUserId } = req.body || {};

    const result = await confirmAppointmentHelper({
      appointmentId,
      requesterUserId: req.userId,
      staffUserId,
    });

    return res.status(200).json({
      success: true,
      message: result.replacedStaff
        ? 'Cita confirmada. El staff original estaba ocupado y se reasignó automáticamente.'
        : 'Cita confirmada exitosamente.',
      data: buildAppointmentResponse(result.appointment),
      replacement: result.replacedStaff
        ? {
            requestedStaffUserId: result.requestedStaffUserId,
            assignedStaffUserId: result.assignedStaffUserId,
          }
        : null,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || 'No se pudo confirmar la cita',
    });
  }
});

export const listAppointments = asyncHandler(async (req, res) => {
  try {
    const { date, status } = req.query;

    const result = await getAllAppointmentsHelper({
      requesterUserId: req.userId,
      date,
      status,
    });

    return res.status(200).json({
      success: true,
      total: result.appointments.length,
      data: result.appointments.map(buildAppointmentResponse),
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || 'No se pudo listar las citas',
    });
  }
});
