import { askDonationAssistant } from '../../helpers/ai-donation-assistant.js';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';

export const askAi = asyncHandler(async (req, res) => {
  const { question } = req.body;
  const result = await askDonationAssistant(question);

  return res.status(200).json(result);
});
