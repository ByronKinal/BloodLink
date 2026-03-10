import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { getUserRoleNames } from '../../helpers/role-db.js';
import {
  DONOR_ROLE,
} from '../../helpers/role-constants.js';
import TriageForm from './triage.model.js';

const HOURS_24_IN_MS = 0 ;/24 * 60 * 60 * 1000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const MIN_AGE = 18;
const MIN_WEIGHT_KG = 50;
const PULSE_MIN = 50;
const PULSE_MAX = 100;
const TEMP_MAX = 37.5;
const HEMOGLOBIN_MIN = 12.5;
const SYSTOLIC_MIN = 90;
const SYSTOLIC_MAX = 160;
const DIASTOLIC_MIN = 60;
const DIASTOLIC_MAX = 100;
const MIN_DAYS_AFTER_TATTOO = 120;
const MIN_DAYS_AFTER_SURGERY = 180;
const MIN_DAYS_BETWEEN_DONATIONS = 56;

const ensureMongoReady = () => mongoose.connection.readyState === 1;

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toDaysBetween = (fromDate, toDate) => {
  const diff = toDate.getTime() - fromDate.getTime();
  return Math.floor(diff / DAY_IN_MS);
};

const sanitizeTriage = (triage) => ({
  id: String(triage._id),
  accountId: triage.accountId,
  edadAnios: triage.ageYears,
  pesoKg: triage.weightKg,
  pulsoBpm: triage.pulseBpm,
  presionSistolicaMmHg: triage.systolicMmHg,
  presionDiastolicaMmHg: triage.diastolicMmHg,
  temperaturaC: triage.temperatureC,
  hemoglobinaGdl: triage.hemoglobinGdl,
  tieneFiebre: triage.hasFever,
  tieneSintomasInfeccion: triage.hasInfectionSymptoms,
  tieneEnfermedadCronica: triage.hasChronicDisease,
  enfermedadCronicaControlada: triage.chronicDiseaseControlled,
  consumioAlcoholUltimas24h: triage.consumedAlcoholLast24h,
  tomoAntibioticosUltimos7d: triage.tookAntibioticsLast7d,
  embarazadaOLactando: triage.pregnantOrBreastfeeding,
  tuvoTatuajeOPiercing: triage.hadTattooOrPiercing,
  fechaUltimoTatuajeOPiercing: triage.lastTattooOrPiercingDate,
  tuvoCirugiaReciente: triage.hadRecentSurgery,
  fechaUltimaCirugia: triage.lastSurgeryDate,
  fechaUltimaDonacion: triage.lastDonationDate,
  evaluation: triage.evaluation,
  createdAt: triage.createdAt,
  updatedAt: triage.updatedAt,
});

const evaluateEligibility = (payload, now = new Date()) => {
  const reasons = [];

  if (payload.ageYears < MIN_AGE) {
    reasons.push(`Edad insuficiente: debe ser mayor o igual a ${MIN_AGE} anios.`);
  }

  if (payload.weightKg <= MIN_WEIGHT_KG) {
    reasons.push(`Peso insuficiente: debe ser mayor a ${MIN_WEIGHT_KG} kg.`);
  }

  if (payload.pulseBpm < PULSE_MIN || payload.pulseBpm > PULSE_MAX) {
    reasons.push(
      `Pulso fuera de rango normal (${PULSE_MIN}-${PULSE_MAX} bpm).`
    );
  }

  if (payload.temperatureC > TEMP_MAX || payload.hasFever) {
    reasons.push('Presenta fiebre o temperatura corporal elevada.');
  }

  if (
    payload.systolicMmHg < SYSTOLIC_MIN ||
    payload.systolicMmHg > SYSTOLIC_MAX ||
    payload.diastolicMmHg < DIASTOLIC_MIN ||
    payload.diastolicMmHg > DIASTOLIC_MAX
  ) {
    reasons.push('Presion arterial fuera del rango aceptable para donacion.');
  }

  if (payload.hemoglobinGdl < HEMOGLOBIN_MIN) {
    reasons.push(
      `Hemoglobina baja: debe ser al menos ${HEMOGLOBIN_MIN} g/dL para donar.`
    );
  }

  if (payload.hasInfectionSymptoms) {
    reasons.push('Presenta sintomas de infeccion activa.');
  }

  if (payload.hasChronicDisease && !payload.chronicDiseaseControlled) {
    reasons.push('Enfermedad cronica no controlada.');
  }

  if (payload.consumedAlcoholLast24h) {
    reasons.push('Consumio alcohol en las ultimas 24 horas.');
  }

  if (payload.tookAntibioticsLast7d) {
    reasons.push('Tomo antibioticos en los ultimos 7 dias.');
  }

  if (payload.pregnantOrBreastfeeding) {
    reasons.push('Embarazo o lactancia en curso.');
  }

  if (payload.hadTattooOrPiercing && payload.lastTattooOrPiercingDate) {
    const tattooDays = toDaysBetween(payload.lastTattooOrPiercingDate, now);
    if (tattooDays < MIN_DAYS_AFTER_TATTOO) {
      reasons.push(
        `Tatuaje o piercing reciente: deben pasar ${MIN_DAYS_AFTER_TATTOO} dias.`
      );
    }
  }

  if (payload.hadRecentSurgery && payload.lastSurgeryDate) {
    const surgeryDays = toDaysBetween(payload.lastSurgeryDate, now);
    if (surgeryDays < MIN_DAYS_AFTER_SURGERY) {
      reasons.push(
        `Cirugia reciente: deben pasar ${MIN_DAYS_AFTER_SURGERY} dias.`
      );
    }
  }

  if (payload.lastDonationDate) {
    const donationDays = toDaysBetween(payload.lastDonationDate, now);
    if (donationDays < MIN_DAYS_BETWEEN_DONATIONS) {
      reasons.push(
        `La ultima donacion fue reciente: deben pasar ${MIN_DAYS_BETWEEN_DONATIONS} dias entre donaciones.`
      );
    }
  }

  return {
    result: reasons.length === 0 ? 'APTO' : 'NO APTO',
    reasons,
  };
};

const canCreateDonorTriage = (roles = []) => roles.includes(DONOR_ROLE);

export const createTriageForm = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const requesterRoles = await getUserRoleNames(req.userId);

  if (!canCreateDonorTriage(requesterRoles)) {
    return res.status(403).json({
      success: false,
      message: 'Solo usuarios donadores pueden enviar formulario de triaje',
    });
  }

  const latestForm = await TriageForm.findOne({ accountId: req.userId })
    .sort({ createdAt: -1 })
    .lean();

  const now = new Date();
  if (latestForm?.createdAt) {
    const elapsed = now.getTime() - new Date(latestForm.createdAt).getTime();

    if (elapsed < HOURS_24_IN_MS) {
      const remainingMs = HOURS_24_IN_MS - elapsed;
      const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));

      return res.status(429).json({
        success: false,
        message: `Debes esperar ${remainingHours} hora(s) para enviar otro formulario de triaje`,
      });
    }
  }

  const triagePayload = {
    ageYears: req.body.edadAnios,
    weightKg: req.body.pesoKg,
    pulseBpm: req.body.pulsoBpm,
    systolicMmHg: req.body.presionSistolicaMmHg,
    diastolicMmHg: req.body.presionDiastolicaMmHg,
    temperatureC: req.body.temperaturaC,
    hemoglobinGdl: req.body.hemoglobinaGdl,
    hasFever: req.body.tieneFiebre,
    hasInfectionSymptoms: req.body.tieneSintomasInfeccion,
    hasChronicDisease: req.body.tieneEnfermedadCronica,
    chronicDiseaseControlled: req.body.enfermedadCronicaControlada,
    consumedAlcoholLast24h: req.body.consumioAlcoholUltimas24h,
    tookAntibioticsLast7d: req.body.tomoAntibioticosUltimos7d,
    pregnantOrBreastfeeding: req.body.embarazadaOLactando,
    hadTattooOrPiercing: req.body.tuvoTatuajeOPiercing,
    lastTattooOrPiercingDate: normalizeDate(req.body.fechaUltimoTatuajeOPiercing),
    hadRecentSurgery: req.body.tuvoCirugiaReciente,
    lastSurgeryDate: normalizeDate(req.body.fechaUltimaCirugia),
    lastDonationDate: normalizeDate(req.body.fechaUltimaDonacion),
  };

  const evaluation = evaluateEligibility(triagePayload, now);

  const created = await TriageForm.create({
    accountId: req.userId,
    ...triagePayload,
    evaluation: {
      ...evaluation,
      checkedAt: now,
    },
  });

  return res.status(201).json({
    success: true,
    message: `Formulario registrado. Resultado: ${evaluation.result}`,
    data: sanitizeTriage(created),
  });
});

export const listTriageForms = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const filters = {};

  if (req.query.accountId) {
    filters.accountId = String(req.query.accountId).trim();
  }

  const forms = await TriageForm.find(filters)
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    total: forms.length,
    data: forms.map(sanitizeTriage),
  });
});
