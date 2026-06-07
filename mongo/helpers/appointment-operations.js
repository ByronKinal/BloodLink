import mongoose from 'mongoose';
import Appointment from '../src/appointments/appointment.model.js';
import TriageForm from '../src/triage/triage.model.js';
import {
  ADMIN_ROLE,
  DONOR_ROLE,
  STAFF_ROLE,
} from './role-constants.js';
import { findUserById } from './user-db.js';
import {
  getUserRoleNames,
  getUsersByRole as getUsersByRoleRepo,
} from './role-db.js';

const isValidDateString = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date || '');

const isValidTimeString = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time || '');

const asScheduleDate = (date, time) => new Date(`${date}T${time}:00`);

const ensureMongoReady = () => mongoose.connection.readyState === 1;

const assertMongoReady = () => {
  if (!ensureMongoReady()) {
    const error = new Error('MongoDB no está conectado');
    error.status = 503;
    throw error;
  }
};

const normalizeDate = (date) => {
  if (!isValidDateString(date)) {
    const error = new Error('La fecha debe tener formato YYYY-MM-DD');
    error.status = 400;
    throw error;
  }

  return date;
};

const normalizeTime = (time) => {
  if (!isValidTimeString(time)) {
    const error = new Error('La hora debe tener formato HH:mm');
    error.status = 400;
    throw error;
  }

  return time;
};

const assertRoles = (roles = [], allowedRoles = []) => {
  if (!allowedRoles.some((role) => roles.includes(role))) {
    const error = new Error('No autorizado para realizar esta acción');
    error.status = 403;
    throw error;
  }
};

const mapUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    surname: user.surname,
    username: user.username,
    email: user.email,
  };
};

const hydrateAppointment = async (appointmentDoc) => {
  const donor = await findUserById(appointmentDoc.donorUserId);
  const staff = appointmentDoc.staffUserId
    ? await findUserById(appointmentDoc.staffUserId)
    : null;

  return {
    id: String(appointmentDoc._id),
    date: appointmentDoc.appointmentDate,
    time: appointmentDoc.appointmentTime,
    status: appointmentDoc.status,
    donor: mapUser(donor),
    staff: mapUser(staff),
    createdAt: appointmentDoc.createdAt,
    updatedAt: appointmentDoc.updatedAt,
  };
};

const getActiveStaffUsers = async () => {
  const staffUsers = await getUsersByRoleRepo(STAFF_ROLE);
  return staffUsers.filter((user) => user.status);
};

const isStaffBusyAtSlot = async ({
  staffUserId,
  date,
  time,
  excludeAppointmentId,
}) => {
  const query = {
    staffUserId,
    appointmentDate: date,
    appointmentTime: time,
    status: true,
  };

  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }

  const existing = await Appointment.findOne(query).lean();
  return Boolean(existing);
};

const findAlternativeStaff = async ({
  date,
  time,
  excludeStaffUserId,
  excludeAppointmentId,
}) => {
  const staffUsers = await getActiveStaffUsers();

  for (const staffUser of staffUsers) {
    if (excludeStaffUserId && staffUser.id === excludeStaffUserId) {
      continue;
    }

    const busy = await isStaffBusyAtSlot({
      staffUserId: staffUser.id,
      date,
      time,
      excludeAppointmentId,
    });

    if (!busy) {
      return staffUser;
    }
  }

  return null;
};

export const buildAppointmentResponse = (appointment) => appointment;

export const createAppointmentHelper = async ({ donorUserId, date, time }) => {
  assertMongoReady();

  const normalizedDate = normalizeDate(date);
  const normalizedTime = normalizeTime(time);

  const donor = await findUserById(donorUserId);

  if (!donor) {
    const error = new Error('Donante no encontrado');
    error.status = 404;
    throw error;
  }

  const donorRoles = await getUserRoleNames(donorUserId);

  if (!donorRoles.includes(DONOR_ROLE)) {
    const error = new Error('Solo un usuario con DONOR_ROLE puede crear citas');
    error.status = 403;
    throw error;
  }

  const latestTriage = await TriageForm.findOne({ accountId: donorUserId })
    .sort({ createdAt: -1 })
    .lean();

  if (!latestTriage) {
    const error = new Error(
      'Debes completar el formulario de triaje antes de crear una cita'
    );
    error.status = 403;
    throw error;
  }

  if (latestTriage?.evaluation?.result !== 'APTO') {
    const triageReasons = latestTriage?.evaluation?.reasons || [];
    const reasonText = triageReasons.length > 0 ? ` Motivo: ${triageReasons.join(' ')}` : '';
    const error = new Error(
      `No puedes crear cita porque tu ultimo triaje esta marcado como NO APTO.${reasonText}`
    );
    error.status = 403;
    throw error;
  }

  const scheduleDate = asScheduleDate(normalizedDate, normalizedTime);
  if (Number.isNaN(scheduleDate.getTime()) || scheduleDate <= new Date()) {
    const error = new Error('La cita debe programarse en una fecha y hora futura');
    error.status = 400;
    throw error;
  }

  const existingAtSlot = await Appointment.findOne({
    appointmentDate: normalizedDate,
    appointmentTime: normalizedTime,
  }).lean();

  if (existingAtSlot) {
    const error = new Error('Horario no disponible. Selecciona otra fecha u hora.');
    error.status = 409;
    throw error;
  }

  let created;
  try {
    created = await Appointment.create({
      donorUserId,
      appointmentDate: normalizedDate,
      appointmentTime: normalizedTime,
      status: false,
    });
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateError = new Error('Horario no disponible. Selecciona otra fecha u hora.');
      duplicateError.status = 409;
      throw duplicateError;
    }

    throw error;
  }

  return hydrateAppointment(created);
};

export const getStaffAgendaHelper = async ({ requesterUserId, date }) => {
  assertMongoReady();

  const requesterRoles = await getUserRoleNames(requesterUserId);
  assertRoles(requesterRoles, [STAFF_ROLE, ADMIN_ROLE]);

  const selectedDate = date || new Date().toISOString().slice(0, 10);
  normalizeDate(selectedDate);

  const appointments = await Appointment.find({
    appointmentDate: selectedDate,
  })
    .sort({ appointmentTime: 1, createdAt: 1 })
    .lean();

  const hydratedAppointments = await Promise.all(
    appointments.map((appointment) => hydrateAppointment(appointment))
  );

  return {
    selectedDate,
    appointments: hydratedAppointments,
  };
};

export const getAllAppointmentsHelper = async ({
  requesterUserId,
  date,
  status,
}) => {
  assertMongoReady();

  const requesterRoles = await getUserRoleNames(requesterUserId);
  assertRoles(requesterRoles, [STAFF_ROLE, ADMIN_ROLE]);

  const query = {};

  if (date) {
    query.appointmentDate = normalizeDate(date);
  }

  if (typeof status === 'string' && status.trim().length > 0) {
    const normalizedStatus = status.trim().toLowerCase();

    if (normalizedStatus !== 'true' && normalizedStatus !== 'false') {
      const error = new Error('status debe ser true o false');
      error.status = 400;
      throw error;
    }

    query.status = normalizedStatus === 'true';
  }

  const appointments = await Appointment.find(query)
    .sort({ appointmentDate: 1, appointmentTime: 1, createdAt: 1 })
    .lean();

  const hydratedAppointments = await Promise.all(
    appointments.map((appointment) => hydrateAppointment(appointment))
  );

  return {
    appointments: hydratedAppointments,
  };
};

export const confirmAppointmentHelper = async ({
  appointmentId,
  requesterUserId,
  staffUserId,
}) => {
  assertMongoReady();

  const requesterRoles = await getUserRoleNames(requesterUserId);
  assertRoles(requesterRoles, [STAFF_ROLE, ADMIN_ROLE]);

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    const error = new Error('Cita no encontrada');
    error.status = 404;
    throw error;
  }

  let targetStaffUserId = staffUserId || null;

  if (!targetStaffUserId) {
    if (requesterRoles.includes(STAFF_ROLE)) {
      targetStaffUserId = requesterUserId;
    } else {
      const error = new Error(
        'Debes enviar staffUserId y este debe pertenecer a un usuario con STAFF_ROLE'
      );
      error.status = 400;
      throw error;
    }
  }

  const targetStaffUser = await findUserById(targetStaffUserId);

  if (!targetStaffUser) {
    const error = new Error('Usuario de staff no encontrado');
    error.status = 404;
    throw error;
  }

  const targetStaffRoles = await getUserRoleNames(targetStaffUserId);
  if (!targetStaffRoles.includes(STAFF_ROLE)) {
    const error = new Error('El usuario asignado debe tener STAFF_ROLE');
    error.status = 400;
    throw error;
  }

  let assignedStaffUserId = targetStaffUserId;
  let replacedStaff = false;

  const isBusy = await isStaffBusyAtSlot({
    staffUserId: targetStaffUserId,
    date: appointment.appointmentDate,
    time: appointment.appointmentTime,
    excludeAppointmentId: appointment._id,
  });

  if (isBusy) {
    const alternativeStaff = await findAlternativeStaff({
      date: appointment.appointmentDate,
      time: appointment.appointmentTime,
      excludeStaffUserId: targetStaffUserId,
      excludeAppointmentId: appointment._id,
    });

    if (!alternativeStaff) {
      const error = new Error(
        'No hay personal STAFF_ROLE disponible para esa fecha y hora'
      );
      error.status = 409;
      throw error;
    }

    assignedStaffUserId = alternativeStaff.id;
    replacedStaff = true;
  }

  appointment.status = true;
  appointment.staffUserId = assignedStaffUserId;
  await appointment.save();

  return {
    appointment: await hydrateAppointment(appointment),
    replacedStaff,
    requestedStaffUserId: targetStaffUserId,
    assignedStaffUserId,
  };
};