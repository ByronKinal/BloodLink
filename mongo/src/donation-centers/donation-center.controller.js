import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import DonationCenter from './donation-center.model.js';

const ensureMongoReady = () => mongoose.connection.readyState === 1;

const EARTH_RADIUS_KM = 6371;

const toRadians = (deg) => (deg * Math.PI) / 180;

const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

const sanitizeCenter = (center, userLat, userLng) => {
  const distanceKm =
    userLat != null && userLng != null
      ? Number(haversineDistanceKm(userLat, userLng, center.latitude, center.longitude).toFixed(1))
      : null;

  return {
    id: String(center._id),
    name: center.name,
    address: center.address,
    zone: center.zone,
    latitude: center.latitude,
    longitude: center.longitude,
    urgentRequests: center.urgentRequests || [],
    distanceKm,
  };
};

export const listDonationCenters = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({ success: false, message: 'MongoDB no esta conectado' });
  }

  const lat = req.query.lat !== undefined ? Number(req.query.lat) : null;
  const lng = req.query.lng !== undefined ? Number(req.query.lng) : null;

  const centers = await DonationCenter.find({ active: true }).lean();
  const sanitized = centers.map((center) => sanitizeCenter(center, lat, lng));

  if (lat != null && lng != null) {
    sanitized.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return res.status(200).json({
    success: true,
    message: 'Centros de donacion obtenidos exitosamente',
    data: sanitized,
  });
});

export const listUrgentDonationCenters = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({ success: false, message: 'MongoDB no esta conectado' });
  }

  const lat = req.query.lat !== undefined ? Number(req.query.lat) : null;
  const lng = req.query.lng !== undefined ? Number(req.query.lng) : null;
  const limit = Math.min(Number(req.query.limit) || 10, 20);

  const centers = await DonationCenter.find({
    active: true,
    'urgentRequests.0': { $exists: true },
  }).lean();

  const sanitized = centers.map((center) => sanitizeCenter(center, lat, lng));

  if (lat != null && lng != null) {
    sanitized.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return res.status(200).json({
    success: true,
    message: 'Centros con solicitudes urgentes obtenidos exitosamente',
    data: sanitized.slice(0, limit),
  });
});
