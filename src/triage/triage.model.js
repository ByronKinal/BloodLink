import mongoose from 'mongoose';

const triageSchema = new mongoose.Schema(
  {
    accountId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    ageYears: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },
    weightKg: {
      type: Number,
      required: true,
      min: 1,
      max: 400,
    },
    pulseBpm: {
      type: Number,
      required: true,
      min: 20,
      max: 220,
    },
    systolicMmHg: {
      type: Number,
      required: true,
      min: 60,
      max: 260,
    },
    diastolicMmHg: {
      type: Number,
      required: true,
      min: 30,
      max: 180,
    },
    temperatureC: {
      type: Number,
      required: true,
      min: 32,
      max: 43,
    },
    hemoglobinGdl: {
      type: Number,
      required: true,
      min: 3,
      max: 25,
    },
    hasFever: {
      type: Boolean,
      required: true,
    },
    hasInfectionSymptoms: {
      type: Boolean,
      required: true,
    },
    hasChronicDisease: {
      type: Boolean,
      required: true,
    },
    chronicDiseaseControlled: {
      type: Boolean,
      required: true,
    },
    consumedAlcoholLast24h: {
      type: Boolean,
      required: true,
    },
    tookAntibioticsLast7d: {
      type: Boolean,
      required: true,
    },
    pregnantOrBreastfeeding: {
      type: Boolean,
      required: true,
    },
    hadTattooOrPiercing: {
      type: Boolean,
      required: true,
    },
    lastTattooOrPiercingDate: {
      type: Date,
      default: null,
    },
    hadRecentSurgery: {
      type: Boolean,
      required: true,
    },
    lastSurgeryDate: {
      type: Date,
      default: null,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    evaluation: {
      result: {
        type: String,
        enum: ['APTO', 'NO APTO'],
        required: true,
      },
      reasons: {
        type: [String],
        default: [],
      },
      checkedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    collection: 'triage_forms',
  }
);

triageSchema.index({ accountId: 1, createdAt: -1 });
triageSchema.index({ 'evaluation.result': 1, createdAt: -1 });

const TriageForm =
  mongoose.models.TriageForm || mongoose.model('TriageForm', triageSchema);

export default TriageForm;
