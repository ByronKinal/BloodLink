import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { generateUUID } from '../../helpers/uuid-generator.js';
import { User } from '../users/user.model.js';

export const Wallet = sequelize.define(
  'Wallet',
  {
    id: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    user_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    balance_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    total_earned_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: 'wallets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export const IncentiveTransaction = sequelize.define(
  'IncentiveTransaction',
  {
    id: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      defaultValue: () => generateUUID(),
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
    donation_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
      unique: true,
    },
    appointment_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    volume_ml: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    transaction_type: {
      type: DataTypes.ENUM('DONATION_REWARD'),
      allowNull: false,
      defaultValue: 'DONATION_REWARD',
    },
    description: {
      type: DataTypes.STRING(180),
      allowNull: false,
      defaultValue: 'Puntos por donacion de sangre',
    },
  },
  {
    tableName: 'incentive_transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

User.hasOne(Wallet, { foreignKey: 'user_id', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Wallet.hasMany(IncentiveTransaction, {
  foreignKey: 'wallet_id',
  as: 'transactions',
});
IncentiveTransaction.belongsTo(Wallet, {
  foreignKey: 'wallet_id',
  as: 'wallet',
});

User.hasMany(IncentiveTransaction, {
  foreignKey: 'user_id',
  as: 'incentiveTransactions',
});
IncentiveTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
