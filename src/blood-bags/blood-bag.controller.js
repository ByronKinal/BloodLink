import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import { findUsersByIds } from '../../helpers/user-db.js';
import {
  getCompatibleDonorTypes,
  normalizeBloodType,
  VALID_BLOOD_TYPES,
} from '../../utils/blood-compatibility.js';
import BloodBag from './blood-bag.model.js';

const ensureMongoReady = () => mongoose.connection.readyState === 1;

const sanitizeBloodBag = (bag) => ({
  id: String(bag._id),
  bagIdentifier: bag.bagIdentifier,
  donationId: String(bag.donationId),
  bloodType: bag.bloodType,
  extractionDate: bag.extractionDate,
  expirationDate: bag.expirationDate,
  volumeMl: bag.volumeMl,
  donorUserId: bag.donorUserId,
  status: bag.status,
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
    stats[type].totalVolumeMl += bag.volumeMl;
    
    if (bag.status === 'Disponible') {
      stats[type].disponible++;
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
    volumeMl: { $gte: minVolumeMl },
  })
    .sort({ expirationDate: 1, createdAt: -1 })
    .lean();

  const sanitized = bags.map((bag) =>
    sanitizeBloodBag({
      ...bag,
      status: 'Disponible',
    })
  );

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

  const sanitized = bags.map(bag => {
    const now = new Date();
    return {
      ...sanitizeBloodBag({
        ...bag,
        status: now > bag.expirationDate ? 'Caducado' : 'Disponible',
      }),
    };
  });

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

  const sanitized = bags.map(bag => {
    const now = new Date();
    return {
      ...sanitizeBloodBag({
        ...bag,
        status: now > bag.expirationDate ? 'Caducado' : 'Disponible',
      }),
    };
  });

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
      totalVolumeMl: sanitized.reduce((sum, b) => sum + b.volumeMl, 0),
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

  const now = new Date();
  const sanitized = {
    ...sanitizeBloodBag({
      ...bag,
      status: now > bag.expirationDate ? 'Caducado' : 'Disponible',
    }),
  };

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
  const sanitized = bags.map(bag => ({
    ...bag,
    status: now > bag.expirationDate ? 'Caducado' : 'Disponible',
  }));

  const stats = getBloodTypeStats(sanitized);

  const totalBags = sanitized.length;
  const totalDisponibles = sanitized.filter(b => b.status === 'Disponible').length;
  const totalCaducadas = sanitized.filter(b => b.status === 'Caducado').length;
  const totalVolume = sanitized.reduce((sum, b) => sum + b.volumeMl, 0);
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
