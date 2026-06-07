
import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { generateUUID } from '../../helpers/uuid-generator.js';

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre es obligatorio.' },
        len: {
          args: [1, 25],
          msg: 'El nombre no puede tener más de 25 caracteres.',
        },
      },
    },
    surname: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El apellido es obligatorio.' },
        len: {
          args: [1, 25],
          msg: 'El apellido no puede tener más de 25 caracteres.',
        },
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El nombre de usuario es obligatorio.' },
        len: {
          args: [1, 50],
          msg: 'El nombre de usuario no puede tener más de 50 caracteres.',
        },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El correo electrónico es obligatorio.' },
        isEmail: { msg: 'El correo electrónico no tiene un formato válido.' },
        len: {
          args: [1, 150],
          msg: 'El correo electrónico no puede tener más de 150 caracteres.',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La contraseña es obligatoria.' },
        len: {
          args: [8, 255],
          msg: 'La contraseña debe tener entre 8 y 255 caracteres.',
        },
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export const UserProfile = sequelize.define(
  'UserProfile',
  {
    id: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    user_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    profile_picture: {
      type: DataTypes.STRING(512),
      defaultValue: '',
    },
    phone: {
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El número de teléfono es obligatorio.' },
        len: {
          args: [8, 8],
          msg: 'El número de teléfono debe tener exactamente 8 dígitos.',
        },
        isNumeric: { msg: 'El teléfono solo debe contener números.' },
      },
    },
    blood_type: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El tipo de sangre es obligatorio.' },
        isIn: {
          args: [['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']],
          msg: 'Tipo de sangre no válido.',
        },
      },
    },
    zone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    municipality: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'user_profiles',
    timestamps: false,
  }
);

export const UserEmail = sequelize.define(
  'UserEmail',
  {
    id: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    user_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    email_verification_token: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    email_verification_code: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    email_verification_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'user_emails',
    timestamps: false,
  }
);

export const UserPasswordReset = sequelize.define(
  'UserPasswordReset',
  {
    id: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    user_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    password_reset_token: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    password_reset_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'user_password_resets',
    timestamps: false,
  }
);

export const UserRefreshToken = sequelize.define(
  'UserRefreshToken',
  {
    id: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      defaultValue: () => generateUUID(),
    },
    user_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    token_hash: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'user_refresh_tokens',
    timestamps: false,
  }
);

User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'userProfile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(UserEmail, { foreignKey: 'user_id', as: 'userEmail' });
UserEmail.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(UserPasswordReset, {
  foreignKey: 'user_id',
  as: 'userPasswordReset',
});
UserPasswordReset.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(UserRefreshToken, {
  foreignKey: 'user_id',
  as: 'refreshTokens',
});
UserRefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
