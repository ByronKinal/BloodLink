import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/errorHandler.js';
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
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
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

  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
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
