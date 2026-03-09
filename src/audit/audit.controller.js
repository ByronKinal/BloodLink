import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import { ADMIN_ROLE } from '../../helpers/role-constants.js';
import { getUserRoleNames } from '../../helpers/role-db.js';
import AuditLog from './audit-log.model.js';

const ensureMongoReady = () => mongoose.connection.readyState === 1;

const ensureAdmin = async (req) => {
  const currentUserId = req.userId;

  if (!currentUserId) {
    return false;
  }

  const roleNamesFromToken = req.user?.userRoles
    ?.map((userRole) => userRole.role?.name)
    .filter(Boolean);

  const roleNames =
    roleNamesFromToken && roleNamesFromToken.length > 0
      ? roleNamesFromToken
      : await getUserRoleNames(currentUserId);

  return roleNames.includes(ADMIN_ROLE);
};

const sanitizeAuditLog = (audit) => ({
  id: String(audit._id),
  action: audit.action,
  performedBy: audit.performedBy,
  bloodType: audit.bloodType,
  volumeDeltaMl: audit.volumeDeltaMl,
  reason: audit.reason,
  relatedBagId: audit.relatedBagId ? String(audit.relatedBagId) : null,
  relatedDonationId: audit.relatedDonationId ? String(audit.relatedDonationId) : null,
  request: audit.request,
  metadata: audit.metadata || {},
  occurredAt: audit.occurredAt,
  createdAt: audit.createdAt,
  updatedAt: audit.updatedAt,
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  if (!(await ensureAdmin(req))) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado. Solo ADMIN_ROLE puede consultar auditoria.',
    });
  }

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const skip = (page - 1) * limit;

  const {
    action,
    bloodType,
    performedByUserId,
    from,
    to,
  } = req.query;

  const filter = {};

  if (action) {
    filter.action = String(action).trim().toUpperCase();
  }

  if (bloodType) {
    filter.bloodType = String(bloodType).trim().toUpperCase();
  }

  if (performedByUserId) {
    filter['performedBy.userId'] = String(performedByUserId).trim();
  }

  if (from || to) {
    filter.occurredAt = {};

    if (from) {
      filter.occurredAt.$gte = new Date(from);
    }

    if (to) {
      filter.occurredAt.$lte = new Date(to);
    }
  }

  const [auditLogs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ occurredAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Registros de auditoria obtenidos exitosamente',
    data: {
      logs: auditLogs.map(sanitizeAuditLog),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      filters: {
        action: action || null,
        bloodType: bloodType || null,
        performedByUserId: performedByUserId || null,
        from: from || null,
        to: to || null,
      },
    },
  });
});
