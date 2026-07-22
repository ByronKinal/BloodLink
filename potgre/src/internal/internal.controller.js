import { asyncHandler } from '../../middlewares/errorHandler.js';
import { findUserById, findUsersByIds } from '../../helpers/user-db.js';
import { getUserRoleNames, getUsersByRole } from '../../helpers/role-db.js';
import { awardPointsForDonation, getWalletByUserId } from '../../helpers/incentive-operations.js';

const parseIds = (value) =>
  Array.from(
    new Set(
      String(value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

export const getInternalUserById = asyncHandler(async (req, res) => {
  const user = await findUserById(req.params.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado',
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const getInternalUsersByIds = asyncHandler(async (req, res) => {
  const ids = parseIds(req.query.ids);

  if (ids.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const users = await findUsersByIds(ids);

  return res.status(200).json({
    success: true,
    data: users,
  });
});

export const getInternalUserRoles = asyncHandler(async (req, res) => {
  const roles = await getUserRoleNames(req.params.userId);

  return res.status(200).json({
    success: true,
    data: roles,
  });
});

export const getInternalWallet = asyncHandler(async (req, res) => {
  const wallet = await getWalletByUserId(req.params.userId);

  return res.status(200).json({
    success: true,
    data: wallet,
  });
});

export const awardDonationPoints = asyncHandler(async (req, res) => {
  const result = await awardPointsForDonation(req.body);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

export const getInternalUsersByRole = asyncHandler(async (req, res) => {
  const users = await getUsersByRole(req.params.roleName);

  return res.status(200).json({
    success: true,
    data: users,
  });
});