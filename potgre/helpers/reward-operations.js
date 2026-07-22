import { sequelize } from '../configs/db.js';
import { Wallet } from '../src/incentives/incentive.model.js';
import { Reward, RewardRedemption } from '../src/rewards/reward.model.js';
import { findUserById } from './user-db.js';
import { uploadImage, deleteImage } from './cloudinary-service.js';
import { FileValidator } from './file-validator.js';
import { sendRedemptionEmail } from './email-service.js';

const parsePositiveInt = (value, fieldName) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${fieldName} debe ser un entero mayor a 0`);
    error.status = 400;
    throw error;
  }

  return parsed;
};

export const createReward = async ({ name, requiredPoints, stock }, imageFile) => {
  const parsedStock = Number(stock);
  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    const error = new Error('stock debe ser un entero mayor o igual a 0');
    error.status = 400;
    throw error;
  }

  let imageUrl = null;
  if (imageFile) {
    const fileValidation = FileValidator.validateImage(imageFile);
    if (!fileValidation.isValid) {
      const error = new Error(fileValidation.errorMessage || 'Archivo de imagen inválido');
      error.status = 400;
      throw error;
    }
    const secureFileName = FileValidator.generateSecureFileName(imageFile.originalname, 'reward');
    imageUrl = await uploadImage(imageFile.path, secureFileName);
  }

  const created = await Reward.create({
    name: String(name).trim(),
    required_points: parsePositiveInt(requiredPoints, 'requiredPoints'),
    stock: parsedStock,
    status: true,
    image_url: imageUrl,
  });

  return created;
};

export const listRewards = async () => {
  return Reward.findAll({
    order: [['created_at', 'DESC']],
  });
};

export const getRewardById = async (rewardId) => {
  const reward = await Reward.findByPk(rewardId);

  if (!reward) {
    const error = new Error('Premio no encontrado');
    error.status = 404;
    throw error;
  }

  return reward;
};

export const updateReward = async (rewardId, payload, imageFile) => {
  const reward = await getRewardById(rewardId);

  if (payload.name !== undefined) {
    reward.name = String(payload.name).trim();
  }

  if (payload.requiredPoints !== undefined) {
    reward.required_points = parsePositiveInt(payload.requiredPoints, 'requiredPoints');
  }

  if (payload.stock !== undefined) {
    const stock = Number(payload.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      const error = new Error('stock debe ser un entero mayor o igual a 0');
      error.status = 400;
      throw error;
    }
    reward.stock = stock;
  }

  if (payload.status !== undefined) {
    reward.status = Boolean(payload.status);
  }

  if (imageFile) {
    const fileValidation = FileValidator.validateImage(imageFile);
    if (!fileValidation.isValid) {
      const error = new Error(fileValidation.errorMessage || 'Archivo de imagen inválido');
      error.status = 400;
      throw error;
    }

    const secureFileName = FileValidator.generateSecureFileName(imageFile.originalname, 'reward');
    const newImageUrl = await uploadImage(imageFile.path, secureFileName);

    if (reward.image_url) {
      try {
        await deleteImage(reward.image_url);
      } catch (deleteError) {
        console.warn('Warning: Could not delete old reward image from Cloudinary:', deleteError);
      }
    }

    reward.image_url = newImageUrl;
  }

  await reward.save();
  return reward;
};

export const deleteReward = async (rewardId) => {
  const reward = await getRewardById(rewardId);

  const oldImageUrl = reward.image_url;
  await reward.destroy();

  if (oldImageUrl) {
    try {
      await deleteImage(oldImageUrl);
    } catch (deleteError) {
      console.warn('Warning: Could not delete deleted reward image from Cloudinary:', deleteError);
    }
  }

  return {
    id: rewardId,
    deleted: true,
  };
};

export const redeemReward = async ({ rewardId, userId, quantity = 1 }) => {
  const normalizedQuantity = parsePositiveInt(quantity, 'quantity');
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  const result = await sequelize.transaction(async (transaction) => {
    const reward = await Reward.findByPk(rewardId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!reward) {
      const error = new Error('Premio no encontrado');
      error.status = 404;
      throw error;
    }

    if (!reward.status) {
      const error = new Error('El premio no esta disponible');
      error.status = 409;
      throw error;
    }

    if (reward.stock < normalizedQuantity) {
      const error = new Error('Stock insuficiente para canjear este premio');
      error.status = 409;
      throw error;
    }

    const [wallet] = await Wallet.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        balance_points: 0,
        total_earned_points: 0,
      },
      transaction,
    });

    const pointsRequired = reward.required_points * normalizedQuantity;

    if (wallet.balance_points < pointsRequired) {
      const error = new Error('Puntos insuficientes para canjear este premio');
      error.status = 409;
      throw error;
    }

    wallet.balance_points -= pointsRequired;
    reward.stock -= normalizedQuantity;

    await wallet.save({ transaction });
    await reward.save({ transaction });

    const redemption = await RewardRedemption.create(
      {
        reward_id: reward.id,
        wallet_id: wallet.id,
        user_id: userId,
        points_spent: pointsRequired,
        quantity: normalizedQuantity,
        status: 'COMPLETED',
      },
      { transaction }
    );

    return {
      redemptionId: redemption.id,
      reward: {
        id: reward.id,
        name: reward.name,
        requiredPoints: reward.required_points,
      },
      quantity: normalizedQuantity,
      pointsSpent: pointsRequired,
      wallet: {
        userId,
        balancePoints: wallet.balance_points,
        totalEarnedPoints: wallet.total_earned_points,
      },
      remainingStock: reward.stock,
      redeemedAt: redemption.created_at,
    };
  });

  // Enviar correo de canjeo exitoso de forma asíncrona
  Promise.resolve()
    .then(() =>
      sendRedemptionEmail(
        user.email,
        user.name,
        result.reward.name,
        result.quantity,
        result.pointsSpent,
        user.userProfile?.zone,
        user.userProfile?.municipality
      )
    )
    .catch((error) => {
      console.error('Async email send (redemption) failed:', error);
    });

  return result;
};
