import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import BloodBag from '../blood-bags/blood-bag.model.js';
import {
  normalizeBloodType,
  VALID_BLOOD_TYPES,
} from '../../utils/blood-compatibility.js';
import Appointment from '../appointments/appointment.model.js';
import Donation from '../iot/donation.model.js';
import { Wallet } from '../incentives/incentive.model.js';

const ensureMongoReady = () => mongoose.connection.readyState === 1;

const getBloodBagStatus = (expirationDate, now = new Date()) =>
  now > expirationDate ? 'Caducado' : 'Disponible';

const buildEmptyBloodTypeSummary = () => ({
  totalBags: 0,
  disponibleBags: 0,
  caducadoBags: 0,
  totalVolumeMl: 0,
  disponibleVolumeMl: 0,
  caducadoVolumeMl: 0,
});

const sanitizeBloodBag = (bag, status) => ({
  id: String(bag._id),
  bagIdentifier: bag.bagIdentifier,
  bloodType: bag.bloodType,
  volumeMl: bag.volumeMl,
  extractionDate: bag.extractionDate,
  expirationDate: bag.expirationDate,
  donorUserId: bag.donorUserId,
  status,
});

export const getStockSummaryReport = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const selectedBloodType = req.query.bloodType
    ? normalizeBloodType(req.query.bloodType)
    : null;

  const includeBags = Boolean(req.query.includeBags);

  const filter = {};
  if (selectedBloodType) {
    filter.bloodType = selectedBloodType;
  }

  const bags = await BloodBag.find(filter)
    .sort({ bloodType: 1, expirationDate: 1, createdAt: -1 })
    .lean();

  const now = new Date();
  const trackedBloodTypes = selectedBloodType
    ? [selectedBloodType]
    : VALID_BLOOD_TYPES;

  const byBloodType = {};
  trackedBloodTypes.forEach((bloodType) => {
    byBloodType[bloodType] = buildEmptyBloodTypeSummary();
  });

  const selectedTypeBags = [];

  bags.forEach((bag) => {
    const status = getBloodBagStatus(bag.expirationDate, now);
    const summary =
      byBloodType[bag.bloodType] || (byBloodType[bag.bloodType] = buildEmptyBloodTypeSummary());

    summary.totalBags += 1;
    summary.totalVolumeMl += bag.volumeMl;

    if (status === 'Disponible') {
      summary.disponibleBags += 1;
      summary.disponibleVolumeMl += bag.volumeMl;
    } else {
      summary.caducadoBags += 1;
      summary.caducadoVolumeMl += bag.volumeMl;
    }

    if (includeBags && selectedBloodType) {
      selectedTypeBags.push(sanitizeBloodBag(bag, status));
    }
  });

  const summary = trackedBloodTypes.reduce(
    (acc, bloodType) => {
      const typeSummary = byBloodType[bloodType] || buildEmptyBloodTypeSummary();
      acc.totalBags += typeSummary.totalBags;
      acc.totalDisponibleBags += typeSummary.disponibleBags;
      acc.totalCaducadoBags += typeSummary.caducadoBags;
      acc.totalVolumeMl += typeSummary.totalVolumeMl;
      acc.totalDisponibleVolumeMl += typeSummary.disponibleVolumeMl;
      acc.totalCaducadoVolumeMl += typeSummary.caducadoVolumeMl;
      return acc;
    },
    {
      totalBags: 0,
      totalDisponibleBags: 0,
      totalCaducadoBags: 0,
      totalVolumeMl: 0,
      totalDisponibleVolumeMl: 0,
      totalCaducadoVolumeMl: 0,
    }
  );

  return res.status(200).json({
    success: true,
    message: 'Reporte de stock obtenido exitosamente',
    data: {
      generatedAt: now.toISOString(),
      filters: {
        bloodType: selectedBloodType,
        includeBags,
      },
      summary,
      byBloodType,
      bags: includeBags && selectedBloodType ? selectedTypeBags : undefined,
    },
  });
  
});

export const getMyStatsReport = asyncHandler(async (req, res) => {

  if (!ensureMongoReady()){
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  // Por qué: evita pedir userId por query/params; lo tomas del token y previenes ver stats de otro usuario.
  const userId = req.userId;

  const [appointmentCount, donationCount, donationVolumeAggregation, wallet] =
    await Promise.all([
      Appointment.countDocuments({donorUserId: userId}),
      Donation.countDocuments({donorUserId: userId}),
      Donation.aggregate([
        { $match: { donorUserId: userId } },
        {
          $group: {
            _id: null,
            totalVolumeMl: { $sum: '$bloodUnit.volumeMl' }, 
          },
        },
    ]),

      Wallet.findOne({
        where: { user_id: userId },
        attributes: ['total_earned_points'],
      }),
    ]);

    const totalBloodDonatedMl = donationVolumeAggregation?.[0]?.totalVolumeMl || 0;
    const totalEarnedPoints = wallet?.total_earned_points || 0;

    return res.status(200).json({
      success: true,
      message: 'Estadisticas del Usuario obtenidas exitosamente',
      data: {
        userId,
        totalBloodDonatedMl,
        totalBloodDonatedLiters: Number((totalBloodDonatedMl / 1000).toFixed(3)),
        totalEarnedPoints,
        appointmentCount,
        donationCount, // extra útil
        },
  });
});

