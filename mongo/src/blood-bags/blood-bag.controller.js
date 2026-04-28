import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import { findUsersByIds } from '../../helpers/user-db.js';
import { getUserRoleNames } from '../../helpers/role-db.js';
import { ADMIN_ROLE, STAFF_ROLE } from '../../helpers/role-constants.js';
import {
  getCompatibleDonorTypes,
  normalizeBloodType,
  VALID_BLOOD_TYPES,
} from '../../utils/blood-compatibility.js';
import BloodBag from './blood-bag.model.js';

const ensureMongoReady = () => mongoose.connection.readyState === 1;

const hasPersonnelRole = (roles = []) =>
  roles.includes(ADMIN_ROLE) || roles.includes(STAFF_ROLE);

const getEffectiveBagStatus = (bag) => {
  const now = new Date();
  if (now > new Date(bag.expirationDate)) {
    return 'Caducado';
  }

  return bag.availabilityStatus || 'Disponible';
};

const sanitizeBloodBag = (bag) => ({
  id: String(bag._id),
  bagIdentifier: bag.bagIdentifier,
  donationId: String(bag.donationId),
  bloodType: bag.bloodType,
  extractionDate: bag.extractionDate,
  expirationDate: bag.expirationDate,
  volumeMl: bag.volumeMl,
  donorUserId: bag.donorUserId,
  status: getEffectiveBagStatus(bag),
  createdAt: bag.createdAt,
  updatedAt: bag.updatedAt,
});

const getBloodTypeStats = (bags) => {
  const stats = {};
  const bloodTypes = VALID_BLOOD_TYPES;
  
  bloodTypes.forEach(type => {
    stats[type] = {
      total: 0,
      disponible: 0,
      caducado: 0,
      totalVolumeMl: 0,
      disponibleVolumeMl: 0,
    };
  });

  bags.forEach(bag => {
    const type = bag.bloodType;
    stats[type].total++;
    
    if (bag.status === 'Disponible') {
      stats[type].disponible++;
      stats[type].totalVolumeMl += bag.volumeMl;
      stats[type].disponibleVolumeMl += bag.volumeMl;
    } else if (bag.status === 'Caducado') {
      stats[type].caducado++;
    }
  });

  return stats;
};

export const getCompatibleBloodBags = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const requiredBloodType = normalizeBloodType(req.params.requiredBloodType);
  const compatibleDonorTypes = getCompatibleDonorTypes(requiredBloodType);

  if (compatibleDonorTypes.length === 0) {
    return res.status(400).json({
      success: false,
      message: `Tipo de sangre invalido. Tipos validos: ${VALID_BLOOD_TYPES.join(', ')}`,
    });
  }

  const minVolumeMl = Number(req.query.minVolumeMl || 1);
  const now = new Date();

  const bags = await BloodBag.find({
    bloodType: { $in: compatibleDonorTypes },
    expirationDate: { $gt: now },
    $or: [
      { availabilityStatus: 'Disponible' },
      { availabilityStatus: { $exists: false } },
    ],
    volumeMl: { $gte: minVolumeMl },
  })
    .sort({ expirationDate: 1, createdAt: -1 })
    .lean();

  const sanitized = bags.map((bag) => sanitizeBloodBag(bag));

  const donorAvailability = new Map();

  sanitized.forEach((bag) => {
    if (!donorAvailability.has(bag.donorUserId)) {
      donorAvailability.set(bag.donorUserId, {
        availableBags: 0,
        totalAvailableVolumeMl: 0,
        earliestExpirationDate: bag.expirationDate,
        bloodTypes: new Set(),
      });
    }

    const donorData = donorAvailability.get(bag.donorUserId);
    donorData.availableBags += 1;
    donorData.totalAvailableVolumeMl += bag.volumeMl;
    donorData.bloodTypes.add(bag.bloodType);

    if (new Date(bag.expirationDate) < new Date(donorData.earliestExpirationDate)) {
      donorData.earliestExpirationDate = bag.expirationDate;
    }
  });

  const donorUserIds = Array.from(donorAvailability.keys());
  const donorUsers = await findUsersByIds(donorUserIds).catch(() => []);
  const donorUserMap = new Map(donorUsers.map((donorUser) => [donorUser.id, donorUser]));

  const availableDonors = donorUserIds.map((donorUserId) => {
    const donorData = donorAvailability.get(donorUserId);
    const donorUser = donorUserMap.get(donorUserId);

    return {
      donorUserId,
      availableBags: donorData.availableBags,
      totalAvailableVolumeMl: donorData.totalAvailableVolumeMl,
      earliestExpirationDate: donorData.earliestExpirationDate,
      bloodTypes: Array.from(donorData.bloodTypes),
      donor: donorUser
        ? {
            id: donorUser.id,
            name: donorUser.name,
            surname: donorUser.surname,
            username: donorUser.username,
            bloodType: donorUser.userProfile?.blood_type || null,
            zone: donorUser.userProfile?.zone || null,
            municipality: donorUser.userProfile?.municipality || null,
            status: donorUser.status,
          }
        : null,
    };
  });

  const totalAvailableVolumeMl = sanitized.reduce(
    (sum, bag) => sum + bag.volumeMl,
    0
  );

  return res.status(200).json({
    success: true,
    message: 'Match sanguineo generado exitosamente',
    data: {
      requiredBloodType,
      compatibleDonorTypes,
      criteria: {
        status: 'Disponible',
        minVolumeMl,
      },
      summary: {
        availableCompatibleBags: sanitized.length,
        availableCompatibleDonors: availableDonors.length,
        totalAvailableVolumeMl,
      },
      donors: availableDonors,
      bloodBags: sanitized,
    },
  });
});

export const getAllBloodBags = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const bags = await BloodBag.find().sort({ createdAt: -1 }).lean();

  const sanitized = bags.map((bag) => sanitizeBloodBag(bag));

  const stats = getBloodTypeStats(sanitized);

  return res.status(200).json({
    success: true,
    message: 'Bolsas de sangre obtenidas exitosamente',
    data: {
      bags: sanitized,
      count: sanitized.length,
      stats,
    },
  });
});

export const getBloodBagsByType = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const { bloodType } = req.params;

  const validBloodTypes = VALID_BLOOD_TYPES;
  if (!validBloodTypes.includes(bloodType)) {
    return res.status(400).json({
      success: false,
      message: `Tipo de sangre invalido. Tipos validos: ${validBloodTypes.join(', ')}`,
    });
  }

  const bags = await BloodBag.find({ bloodType }).sort({ createdAt: -1 }).lean();

  const sanitized = bags.map((bag) => sanitizeBloodBag(bag));

  const disponibles = sanitized.filter(b => b.status === 'Disponible');
  const caducadas = sanitized.filter(b => b.status === 'Caducado');

  return res.status(200).json({
    success: true,
    message: `Bolsas de sangre tipo ${bloodType} obtenidas exitosamente`,
    data: {
      bloodType,
      bags: sanitized,
      count: sanitized.length,
      disponibles: disponibles.length,
      caducadas: caducadas.length,
      totalVolumeMl: disponibles.reduce((sum, b) => sum + b.volumeMl, 0),
      disponibleVolumeMl: disponibles.reduce((sum, b) => sum + b.volumeMl, 0),
    },
  });
});

export const getBloodBagById = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID invalido',
    });
  }

  const bag = await BloodBag.findById(id).lean();

  if (!bag) {
    return res.status(404).json({
      success: false,
      message: 'Bolsa de sangre no encontrada',
    });
  }

  const sanitized = sanitizeBloodBag(bag);

  return res.status(200).json({
    success: true,
    message: 'Bolsa de sangre obtenida exitosamente',
    data: sanitized,
  });
});

export const getBloodBagStats = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const bags = await BloodBag.find().lean();

  const now = new Date();
  const sanitized = bags.map((bag) => ({
    ...bag,
    status: getEffectiveBagStatus(bag),
  }));

  const stats = getBloodTypeStats(sanitized);

  const totalBags = sanitized.length;
  const totalDisponibles = sanitized.filter(b => b.status === 'Disponible').length;
  const totalCaducadas = sanitized.filter(b => b.status === 'Caducado').length;
  const totalVolume = sanitized
    .filter((b) => b.status === 'Disponible')
    .reduce((sum, b) => sum + b.volumeMl, 0);
  const disponibleVolume = sanitized.filter(b => b.status === 'Disponible').reduce((sum, b) => sum + b.volumeMl, 0);

  return res.status(200).json({
    success: true,
    message: 'Estadisticas de bolsas de sangre obtenidas exitosamente',
    data: {
      summary: {
        totalBags,
        totalDisponibles,
        totalCaducadas,
        totalVolumeMl: totalVolume,
        disponibleVolumeMl: disponibleVolume,
      },
      byBloodType: stats,
    },
  });
});

export const updateBloodBagStatus = asyncHandler(async (req, res) => {
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
      message: 'Solo personal autorizado puede actualizar el estado de bolsas',
    });
  }

  const { id } = req.params;
  const { status } = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID invalido',
    });
  }

  const normalizedStatus = String(status || '').trim();
  if (!['Disponible', 'No disponible'].includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: 'status debe ser Disponible o No disponible',
    });
  }

  const bag = await BloodBag.findById(id);
  if (!bag) {
    return res.status(404).json({
      success: false,
      message: 'Bolsa de sangre no encontrada',
    });
  }

  if (new Date() > bag.expirationDate && normalizedStatus === 'Disponible') {
    return res.status(409).json({
      success: false,
      message: 'No puedes marcar como Disponible una bolsa caducada',
    });
  }

  bag.availabilityStatus = normalizedStatus;
  await bag.save();

  return res.status(200).json({
    success: true,
    message: 'Estado de la bolsa actualizado exitosamente',
    data: sanitizeBloodBag(bag),
  });
});
