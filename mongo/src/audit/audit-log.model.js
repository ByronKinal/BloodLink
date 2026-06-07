import mongoose from 'mongoose';
import { BLOOD_STOCK_AUDIT_ACTIONS } from '../../utils/audit-constants.js';
import { VALID_BLOOD_TYPES } from '../../utils/blood-compatibility.js';

const performedBySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      default: null,
      trim: true,
    },
    surname: {
      type: String,
      default: null,
      trim: true,
    },
    username: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { _id: false }
);

const requestSnapshotSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    endpoint: {
      type: String,
      required: true,
      trim: true,
    },
    ipAddress: {
      type: String,
      default: null,
      trim: true,
    },
    userAgent: {
      type: String,
      default: null,
      trim: true,
      maxlength: 512,
    },
  },
  { _id: false }
);

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: BLOOD_STOCK_AUDIT_ACTIONS,
      trim: true,
      uppercase: true,
    },
    performedBy: {
      type: performedBySchema,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: VALID_BLOOD_TYPES,
      trim: true,
      uppercase: true,
    },
    volumeDeltaMl: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value !== 0,
        message: 'volumeDeltaMl no puede ser 0',
      },
    },
    reason: {
      type: String,
      default: null,
      trim: true,
      maxlength: 300,
    },
    relatedBagId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'BloodBag',
    },
    relatedDonationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Donation',
    },
    request: {
      type: requestSnapshotSchema,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'audit_logs',
  }
);

auditLogSchema.index({ action: 1, bloodType: 1, occurredAt: -1 });
auditLogSchema.index({ 'performedBy.userId': 1, occurredAt: -1 });

const AuditLog =
  mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
