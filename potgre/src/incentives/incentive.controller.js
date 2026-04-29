import { asyncHandler } from '../../middlewares/errorHandler.js';
import { getUserRoleNames } from '../../helpers/role-db.js';
import { ADMIN_ROLE, STAFF_ROLE } from '../../helpers/role-constants.js';
import { getWalletByUserId } from '../../helpers/incentive-operations.js';

export const getWallet = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const requesterRoles = await getUserRoleNames(req.userId);
  const isOwner = req.userId === userId;
  const hasPersonnelRole =
    requesterRoles.includes(ADMIN_ROLE) || requesterRoles.includes(STAFF_ROLE);

  if (!isOwner && !hasPersonnelRole) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para ver la wallet de este usuario',
    });
  }

  const wallet = await getWalletByUserId(userId);

  return res.status(200).json({
    success: true,
    message: 'Wallet obtenida exitosamente',
    data: wallet,
  });
});
