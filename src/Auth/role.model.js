import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { generateUUID } from '../../helpers/uuid-generator.js';
import { User } from '../users/user.model.js';
import { ALLOWED_ROLES } from '../../helpers/role-constants.js';

export const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El nombre del rol es obligatorio.' },
        isIn: {
          args: [ALLOWED_ROLES],
          msg: 'Rol no permitido.',
        },
      },
    },
  },
  {
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export const UserRole = sequelize.define(
  'UserRole',
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    user_id: {
      type: DataTypes.STRING(16),
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    role_id: {
      type: DataTypes.STRING(16),
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
    },
  },
  {
    tableName: 'user_roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Associations
User.hasMany(UserRole, { foreignKey: 'user_id', as: 'userRoles' });
UserRole.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Role.hasMany(UserRole, { foreignKey: 'role_id', as: 'userRoles' });
UserRole.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
