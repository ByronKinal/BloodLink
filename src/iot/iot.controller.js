import crypto from 'crypto';
import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import {
  ADMIN_ROLE,
  DONOR_ROLE,
  STAFF_ROLE,
} from '../../helpers/role-constants.js';
import { getUserRoleNames } from '../../helpers/role-db.js';
import { findUserById } from '../../helpers/user-db.js';
import Appointment from '../appointments/appointment.model.js';
import TriageForm from '../triage/triage.model.js';
import Donation from './donation.model.js';
import BloodBag from '../blood-bags/blood-bag.model.js';
import { awardPointsForDonation } from '../../helpers/incentive-operations.js';

const MAX_DONATION_ML = 600;

const ensureMongoReady = () => mongoose.connection.readyState === 1;

const hasPersonnelRole = (roles = []) =>
  roles.includes(ADMIN_ROLE) || roles.includes(STAFF_ROLE);

const generateUnitCode = () => {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `BLD-${date}-${random}`;
};

const sanitizeDonation = (donation) => ({
  id: String(donation._id),
  appointmentId: String(donation.appointmentId),
  triageFormId: String(donation.triageFormId),
  donorUserId: donation.donorUserId,
  staffUserId: donation.staffUserId,
  recordedByUserId: donation.recordedByUserId,
  donationDate: donation.donationDate,
  bloodUnit: donation.bloodUnit,
  notes: donation.notes,
  source: donation.source,
  createdAt: donation.createdAt,
  updatedAt: donation.updatedAt,
});

export const registerDonationWeight = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const requesterRoles = await getUserRoleNames(req.userId);

  if (!hasPersonnelRole(requesterRoles)) {
    return res.status(403).json({
      success: false,
      message: 'Solo personal autorizado puede registrar donaciones por /iot/weight',
    });
  }

  const { appointmentId, weightGrams, notes, deviceId } = req.body;

  const appointment = await Appointment.findById(appointmentId).lean();
  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'La cita indicada no existe',
    });
  }

  if (!appointment.status) {
    return res.status(409).json({
      success: false,
      message: 'La cita aun no esta confirmada, no se puede registrar la donacion',
    });
  }

  const existingDonation = await Donation.findOne({ appointmentId }).lean();
  if (existingDonation) {
    return res.status(409).json({
      success: false,
      message: 'Esta cita ya tiene una donacion registrada',
    });
  }

  const donorUser = await findUserById(appointment.donorUserId);
  if (!donorUser) {
    return res.status(404).json({
      success: false,
      message: 'No se encontro el donador asociado a la cita',
    });
  }

  const donorRoles = await getUserRoleNames(donorUser.id);
  if (!donorRoles.includes(DONOR_ROLE)) {
    return res.status(409).json({
      success: false,
      message: 'El usuario de la cita no tiene rol DONOR_ROLE',
    });
  }

  const latestTriage = await TriageForm.findOne({ accountId: donorUser.id })
    .sort({ createdAt: -1 })
    .lean();

  if (!latestTriage) {
    return res.status(409).json({
      success: false,
      message: 'El donador debe completar el formulario de triaje antes de donar',
    });
  }

  if (latestTriage.evaluation?.result !== 'APTO') {
    return res.status(409).json({
      success: false,
      message: 'El donador esta NO APTO segun el ultimo triaje, no puede donar',
      triage: {
        triageFormId: String(latestTriage._id),
        result: latestTriage.evaluation?.result || 'NO APTO',
        reasons: latestTriage.evaluation?.reasons || [],
      },
    });
  }

  const donorBloodType = donorUser.userProfile?.blood_type;
  if (!donorBloodType) {
    return res.status(409).json({
      success: false,
      message:
        'El donador no tiene tipo de sangre registrado. Actualiza su perfil antes de registrar la donacion.',
    });
  }

  const normalizedWeight = Number(weightGrams);
  const volumeMl = Math.round(normalizedWeight);

  if (volumeMl > MAX_DONATION_ML) {
    return res.status(400).json({
      success: false,
      message: `No puede donar mas de ${MAX_DONATION_ML} ml por extraccion`,
    });
  }

  const donationDate = new Date();
  const unitCode = generateUnitCode();
  
  const created = await Donation.create({
    appointmentId: appointment._id,
    triageFormId: latestTriage._id,
    donorUserId: donorUser.id,
    staffUserId: appointment.staffUserId || req.userId,
    recordedByUserId: req.userId,
    donationDate,
    bloodUnit: {
      unitCode,
      bloodType: donorBloodType,
      weightGrams: normalizedWeight,
      volumeMl,
      volumeLiters: Number((volumeMl / 1000).toFixed(3)),
      deviceId: deviceId || null,
    },
    notes: notes || null,
    source: 'IOT_SIMULATED',
  });

  const expirationDate = new Date(donationDate);
  expirationDate.setMonth(expirationDate.getMonth() + 2);

  const bloodBag = await BloodBag.create({
    bagIdentifier: unitCode,
    donationId: created._id,
    bloodType: donorBloodType,
    extractionDate: donationDate,
    expirationDate,
    volumeMl,
    donorUserId: donorUser.id,
  });

  const incentive = await awardPointsForDonation({
    userId: donorUser.id,
    donationId: created._id,
    appointmentId: appointment._id,
    volumeMl,
  });

  return res.status(201).json({
    success: true,
    message: 'Donacion, bolsa de sangre e incentivos registrados exitosamente',
    data: {
      donation: sanitizeDonation(created),
      bloodBag: {
        id: String(bloodBag._id),
        bagIdentifier: bloodBag.bagIdentifier,
        bloodType: bloodBag.bloodType,
        extractionDate: bloodBag.extractionDate,
        expirationDate: bloodBag.expirationDate,
        status: 'Disponible',
      },
      incentive,
    },
  });
});
