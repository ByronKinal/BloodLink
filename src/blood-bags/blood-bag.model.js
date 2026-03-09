import mongoose from 'mongoose';

const bloodBagSchema = new mongoose.Schema(
  {
    bagIdentifier: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'Donation',
    },
    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      trim: true,
    },
    extractionDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    volumeMl: {
      type: Number,
      required: true,
      min: 1,
    },
    donorUserId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'blood_bags',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bloodBagSchema.virtual('status').get(function () {
  const now = new Date();
  if (now > this.expirationDate) {
    return 'Caducado';
  }
  return 'Disponible';
});

bloodBagSchema.index({ bloodType: 1, expirationDate: 1 });
bloodBagSchema.index({ status: 1 });

const BloodBag = mongoose.model('BloodBag', bloodBagSchema);

export default BloodBag;
