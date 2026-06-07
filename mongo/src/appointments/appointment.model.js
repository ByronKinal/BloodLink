import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    donorUserId: {
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
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'appointments',
  }
);

appointmentSchema.index(
  { appointmentDate: 1, appointmentTime: 1 },
  { unique: true }
);
appointmentSchema.index(
  { donorUserId: 1, appointmentDate: 1, appointmentTime: 1 },
  { unique: true }
);
appointmentSchema.index({ staffUserId: 1, appointmentDate: 1, appointmentTime: 1 });

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model('Appointment', appointmentSchema);

export default Appointment;
