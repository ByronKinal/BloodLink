import mongoose from 'mongoose';

const bloodUnitSchema = new mongoose.Schema(
  {
    unitCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      trim: true,
    },
    weightGrams: {
      type: Number,
      required: true,
      min: 1,
      max: 600,
    },
    volumeMl: {
      type: Number,
      required: true,
      min: 1,
      max: 600,
    },
    volumeLiters: {
      type: Number,
      required: true,
      min: 0.001,
      max: 0.6,
    },
    deviceId: {
      type: String,
      default: null,
      trim: true,
      maxlength: 80,
    },
  },
  { _id: false }
);

const donationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'Appointment',
    },
    triageFormId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'TriageForm',
    },
    donorUserId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    staffUserId: {
      type: String,
      required: true,
      trim: true,
    },
    recordedByUserId: {
      type: String,
      required: true,
      trim: true,
    },
    donationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    bloodUnit: {
      type: bloodUnitSchema,
      required: true,
    },
    notes: {
      type: String,
      default: null,
      trim: true,
      maxlength: 300,
    },
    source: {
      type: String,
      default: 'IOT_SIMULATED',
      trim: true,
      maxlength: 40,
    },
  },
  {
    timestamps: true,
    collection: 'donations',
  }
);

donationSchema.index({ donationDate: -1 });
donationSchema.index({ donorUserId: 1, donationDate: -1 });

const Donation =
  mongoose.models.Donation || mongoose.model('Donation', donationSchema);

export default Donation;
