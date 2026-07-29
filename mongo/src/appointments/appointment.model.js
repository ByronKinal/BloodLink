import mongoose from 'mongoose';

export const APPOINTMENT_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED'];
export const ACTIVE_APPOINTMENT_STATUSES = ['PENDING', 'CONFIRMED'];

const appointmentSchema = new mongoose.Schema(
  {
    donorUserId: {
      type: String,
      required: true,
      trim: true,
    },
    donationCenterId: {
      type: String,
      required: true,
      trim: true,
    },
    staffUserId: {
      type: String,
      default: null,
      trim: true,
    },
    appointmentDate: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD'],
    },
    appointmentTime: {
      type: String,
      required: true,
      trim: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'La hora debe tener formato HH:mm'],
    },
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      required: true,
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
    collection: 'appointments',
  }
);

const activeStatusFilter = { status: { $in: ACTIVE_APPOINTMENT_STATUSES } };

appointmentSchema.index(
  { donationCenterId: 1, appointmentDate: 1, appointmentTime: 1 },
  { partialFilterExpression: activeStatusFilter }
);
appointmentSchema.index(
  { donorUserId: 1, appointmentDate: 1, appointmentTime: 1 },
  { unique: true, partialFilterExpression: activeStatusFilter }
);
appointmentSchema.index({ staffUserId: 1, appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ donorUserId: 1, status: 1 });

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model('Appointment', appointmentSchema);

export default Appointment;
