import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { generateUUID } from '../../helpers/uuid-generator.js';
import { User } from '../users/user.model.js';
import { Wallet } from '../incentives/incentive.model.js';

export const Reward = sequelize.define(
  'Reward',
  {
    id: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El nombre del premio es obligatorio' },
        len: {
          args: [2, 120],
          msg: 'El nombre del premio debe tener entre 2 y 120 caracteres',
        },
      },
    },
    required_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'rewards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export const RewardRedemption = sequelize.define(
  'RewardRedemption',
  {
    id: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    reward_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: Reward,
        key: 'id',
      },
    },
    wallet_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: Wallet,
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    points_spent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    status: {
      type: DataTypes.ENUM('COMPLETED'),
      allowNull: false,
      defaultValue: 'COMPLETED',
    },
  },
  {
    tableName: 'reward_redemptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

Reward.hasMany(RewardRedemption, { foreignKey: 'reward_id', as: 'redemptions' });
RewardRedemption.belongsTo(Reward, { foreignKey: 'reward_id', as: 'reward' });

Wallet.hasMany(RewardRedemption, { foreignKey: 'wallet_id', as: 'rewardRedemptions' });
RewardRedemption.belongsTo(Wallet, { foreignKey: 'wallet_id', as: 'wallet' });

User.hasMany(RewardRedemption, { foreignKey: 'user_id', as: 'rewardRedemptions' });
RewardRedemption.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
