import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import TriageForm from './triage.model.js';
import { sanitizeTriage } from './triage.controller.js';

const ensureMongoReady = () => mongoose.connection.readyState === 1;

export const updateTriageStatus = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no esta conectado',
    });
  }

  const { id } = req.params;
  const { status } = req.body;

  const updated = await TriageForm.findByIdAndUpdate(
    id,
    { reviewStatus: status },
    { new: true, runValidators: true }
  );

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Formulario de triaje no encontrado',
    });
  }

  return res.status(200).json({
    success: true,
    message: `Estado de revisión actualizado a ${status}`,
    data: sanitizeTriage(updated),
  });
});
