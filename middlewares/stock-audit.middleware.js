import AuditLog from '../src/audit/audit-log.model.js';
import {
  isValidBloodType,
  normalizeBloodType,
} from '../utils/blood-compatibility.js';
import { BLOOD_STOCK_AUDIT_ACTIONS } from '../utils/audit-constants.js';

const getRequesterRole = (req) => {
  if (req.userRole) {
    return String(req.userRole).trim().toUpperCase();
  }

  const roleFromUser = req.user?.userRoles?.[0]?.role?.name;
  if (roleFromUser) {
    return String(roleFromUser).trim().toUpperCase();
  }

  return null;
};

const getIpAddress = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim();
  }

  return req.ip || null;
};

const toSafeMetadata = (metadata) => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return {};
  }

  return metadata;
};

export const stockAuditLogger = (req, _res, next) => {
  req.logBloodStockAudit = async (payload = {}) => {
    try {
      const {
        action,
        bloodType,
        volumeDeltaMl,
        reason = null,
        relatedBagId = null,
        relatedDonationId = null,
        metadata = {},
      } = payload;

      const normalizedAction = String(action || '').trim().toUpperCase();
      if (!BLOOD_STOCK_AUDIT_ACTIONS.includes(normalizedAction)) {
        return { logged: false, message: 'Accion de auditoria invalida' };
      }

      const normalizedBloodType = normalizeBloodType(bloodType);
      if (!isValidBloodType(normalizedBloodType)) {
        return { logged: false, message: 'Tipo de sangre invalido para auditoria' };
      }

      const numericDelta = Number(volumeDeltaMl);
      if (!Number.isFinite(numericDelta) || numericDelta === 0) {
        return { logged: false, message: 'volumeDeltaMl invalido para auditoria' };
      }

      if (!req.userId) {
        return { logged: false, message: 'No hay usuario autenticado para auditoria' };
      }

      const requesterRole = getRequesterRole(req);
      if (!requesterRole) {
        return { logged: false, message: 'No se pudo determinar el rol del usuario' };
      }

      await AuditLog.create({
        action: normalizedAction,
        performedBy: {
          userId: req.userId,
          role: requesterRole,
          name: req.user?.name || null,
          surname: req.user?.surname || null,
          username: req.user?.username || null,
        },
        bloodType: normalizedBloodType,
        volumeDeltaMl: numericDelta,
        reason: reason ? String(reason).trim() : null,
        relatedBagId,
        relatedDonationId,
        request: {
          method: String(req.method || '').toUpperCase(),
          endpoint: req.originalUrl,
          ipAddress: getIpAddress(req),
          userAgent: req.get('user-agent') || null,
        },
        metadata: toSafeMetadata(metadata),
        occurredAt: new Date(),
      });

      return { logged: true };
    } catch (error) {
      console.error('AuditLog | No se pudo registrar auditoria de stock:', error);
      return { logged: false, message: 'No se pudo registrar auditoria de stock' };
    }
  };

  next();
};
