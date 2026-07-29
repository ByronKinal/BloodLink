import mongoose from 'mongoose';

const urgentRequestSchema = new mongoose.Schema(
  {
    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const donationCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    zone: {
      type: String,
      trim: true,
      default: null,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    urgentRequests: {
      type: [urgentRequestSchema],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'donation_centers',
  }
);

const DonationCenter =
  mongoose.models.DonationCenter || mongoose.model('DonationCenter', donationCenterSchema);

export default DonationCenter;
