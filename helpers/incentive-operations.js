import { sequelize } from '../configs/db.js';
import { findUserById } from './user-db.js';
import { IncentiveTransaction, Wallet } from '../src/incentives/incentive.model.js';

export const calculateDonationPoints = (volumeMl) => {
  const normalized = Number(volumeMl);

  if (!Number.isFinite(normalized) || normalized <= 0) {
    const error = new Error('volumeMl invalido para calcular puntos');
    error.status = 400;
    throw error;
  }

  if (normalized <= 350) {
    return 35;
  }

  if (normalized <= 450) {
    return 50;
  }

  if (normalized <= 600) {
    return 70;
  }

  return 80;
};

export const awardPointsForDonation = async ({
  userId,
  donationId,
  appointmentId,
  volumeMl,
}) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error('Usuario donador no encontrado para incentivos');
    error.status = 404;
    throw error;
  }

  const existingTransaction = await IncentiveTransaction.findOne({
    where: { donation_id: String(donationId) },
  });

  if (existingTransaction) {
    const wallet = await Wallet.findOne({ where: { user_id: userId } });
    return {
      pointsAwarded: 0,
      alreadyAwarded: true,
      balancePoints: wallet?.balance_points || 0,
      totalEarnedPoints: wallet?.total_earned_points || 0,
      transactionId: existingTransaction.id,
    };
  }

  const points = calculateDonationPoints(volumeMl);

  return sequelize.transaction(async (transaction) => {
    const [wallet] = await Wallet.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        balance_points: 0,
        total_earned_points: 0,
      },
      transaction,
    });

    await IncentiveTransaction.create(
      {
        wallet_id: wallet.id,
        user_id: userId,
        donation_id: String(donationId),
        appointment_id: String(appointmentId),
        points,
        volume_ml: Math.round(Number(volumeMl)),
        transaction_type: 'DONATION_REWARD',
        description: `Puntos por donacion (${Math.round(Number(volumeMl))} ml)`,
      },
      { transaction }
    );

    wallet.balance_points += points;
    wallet.total_earned_points += points;

    await wallet.save({ transaction });

    return {
      pointsAwarded: points,
      alreadyAwarded: false,
      balancePoints: wallet.balance_points,
      totalEarnedPoints: wallet.total_earned_points,
      walletId: wallet.id,
    };
  });
};

export const getWalletByUserId = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  const [wallet] = await Wallet.findOrCreate({
    where: { user_id: userId },
    defaults: {
      user_id: userId,
      balance_points: 0,
      total_earned_points: 0,
    },
  });

  const transactions = await IncentiveTransaction.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 50,
  });

  return {
    userId,
    balancePoints: wallet.balance_points,
    totalEarnedPoints: wallet.total_earned_points,
    transactionCount: transactions.length,
    transactions: transactions.map((trx) => ({
      id: trx.id,
      donationId: trx.donation_id,
      appointmentId: trx.appointment_id,
      points: trx.points,
      volumeMl: trx.volume_ml,
      transactionType: trx.transaction_type,
      description: trx.description,
      createdAt: trx.created_at,
    })),
  };
};
