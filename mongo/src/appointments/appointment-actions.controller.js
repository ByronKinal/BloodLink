import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import {
  buildAppointmentResponse,
  cancelAppointmentHelper,
  getAvailabilityHelper,
} from '../../helpers/appointment-operations.js';

export const cancelAppointment = asyncHandler(async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await cancelAppointmentHelper({
      appointmentId,
      requesterUserId: req.userId,
    });

    return res.status(200).json({
      success: true,
      message: 'Cita cancelada exitosamente.',
      data: buildAppointmentResponse(appointment),
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || 'No se pudo cancelar la cita',
    });
  }
});

export const getAvailability = asyncHandler(async (req, res) => {
  try {
    const { date } = req.query;

    const result = await getAvailabilityHelper({ date });

    return res.status(200).json({
      success: true,
      date: result.date,
      bookedTimes: result.bookedTimes,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || 'No se pudo obtener la disponibilidad',
    });
  }
});
