import mongoose from 'mongoose';
import { DONOR_ROLE, STAFF_ROLE } from '../../helpers/role-constants.js';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const donorDataSchema = new mongoose.Schema(
  {
    bloodType: {
      type: String,
      enum: BLOOD_TYPES,
      trim: true,
    },
    weightKg: {
      type: Number,
      min: 1,
    },
    lastDonationDate: {
      type: Date,
    },
  },
  { _id: false }
);

const staffDataSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    department: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    staffCode: {
      type: String,
      trim: true,
      maxlength: 30,
    },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    roleName: {
      type: String,
      required: true,
      enum: [DONOR_ROLE, STAFF_ROLE],
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    donorData: donorDataSchema,
    staffData: staffDataSchema,
  },
  {
    timestamps: true,
    collection: 'profiles',
  }
);

profileSchema.index({ userId: 1 }, { unique: true });
profileSchema.index({ email: 1 }, { unique: true });

profileSchema.pre('validate', function (next) {
  this.email = (this.email || '').trim().toLowerCase();
  this.roleName = (this.roleName || '').trim().toUpperCase();

  if (this.roleName === DONOR_ROLE) {
    if (!this.donorData?.bloodType) {
      this.invalidate(
        'donorData.bloodType',
        'bloodType es obligatorio para perfiles DONOR_ROLE'
      );
    }
  }

  if (this.roleName === STAFF_ROLE) {
    if (!this.staffData?.position) {
      this.invalidate(
        'staffData.position',
        'position es obligatorio para perfiles STAFF_ROLE'
      );
    }

    if (!this.staffData?.department) {
      this.invalidate(
        'staffData.department',
        'department es obligatorio para perfiles STAFF_ROLE'
      );
    }
  }

  next();
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;