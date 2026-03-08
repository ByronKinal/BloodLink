import { asyncHandler } from '../../middlewares/errorHandler.js';
import { ADMIN_ROLE, STAFF_ROLE } from '../../helpers/role-constants.js';
import { getUserRoleNames } from '../../helpers/role-db.js';
import {
  createReward,
  deleteReward,
  getRewardById,
  listRewards,
  redeemReward,
  updateReward,
} from '../../helpers/reward-operations.js';

const canManageRewards = (roles = []) =>
  roles.includes(ADMIN_ROLE) || roles.includes(STAFF_ROLE);

const mapReward = (reward) => ({
  id: reward.id,
  name: reward.name,
  requiredPoints: reward.required_points,
  stock: reward.stock,
  status: reward.status,
  createdAt: reward.created_at,
  updatedAt: reward.updated_at,
});

export const createRewardController = asyncHandler(async (req, res) => {
  const roles = await getUserRoleNames(req.userId);

  if (!canManageRewards(roles)) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para crear premios',
    });
  }

  const created = await createReward(req.body);

  return res.status(201).json({
    success: true,
    message: 'Premio creado exitosamente',
    data: mapReward(created),
  });
});

export const listRewardsController = asyncHandler(async (_req, res) => {
  const rewards = await listRewards();

  return res.status(200).json({
    success: true,
    message: 'Premios obtenidos exitosamente',
    data: rewards.map(mapReward),
  });
});

export const getRewardByIdController = asyncHandler(async (req, res) => {
  const reward = await getRewardById(req.params.rewardId);

  return res.status(200).json({
    success: true,
    message: 'Premio obtenido exitosamente',
    data: mapReward(reward),
  });
});

export const updateRewardController = asyncHandler(async (req, res) => {
  const roles = await getUserRoleNames(req.userId);

  if (!canManageRewards(roles)) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para actualizar premios',
    });
  }

  const updated = await updateReward(req.params.rewardId, req.body);

  return res.status(200).json({
    success: true,
    message: 'Premio actualizado exitosamente',
    data: mapReward(updated),
  });
});

export const deleteRewardController = asyncHandler(async (req, res) => {
  const roles = await getUserRoleNames(req.userId);

  if (!canManageRewards(roles)) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para eliminar premios',
    });
  }

  const result = await deleteReward(req.params.rewardId);

  return res.status(200).json({
    success: true,
    message: 'Premio eliminado exitosamente',
    data: result,
  });
});

export const redeemRewardController = asyncHandler(async (req, res) => {
  const { rewardId, quantity } = req.body;

  const result = await redeemReward({
    rewardId,
    userId: req.userId,
    quantity,
  });

  return res.status(200).json({
    success: true,
    message: 'Premio canjeado exitosamente',
    data: result,
  });
});
