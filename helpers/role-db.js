
import { User, UserProfile, UserEmail } from '../src/users/user.model.js';
import { Role, UserRole } from '../src/Auth/role.model.js';
import { sequelize } from '../configs/db.js';
import { ALLOWED_ROLES } from './role-constants.js';


export const getRoleByName = async (roleName) => {
  const normalized = (roleName || '').trim().toUpperCase();
  return Role.findOne({ where: { name: normalized } });
};

export const countUsersInRole = async (roleName) => {
  const normalized = (roleName || '').trim().toUpperCase();
  const count = await UserRole.count({
    include: [{ model: Role, as: 'role', where: { name: normalized } }],
    distinct: true,
    col: 'user_id',
  });
  return count;
};


export const getUserRoleNames = async (userId) => {
  const userRoles = await UserRole.findAll({
    where: { user_id: userId },
    include: [{ model: Role, as: 'role' }],
  });
  return userRoles.map((ur) => ur.role?.name).filter(Boolean);
};

export const getUsersByRole = async (roleName) => {
  const normalized = (roleName || '').trim().toUpperCase();
  const users = await User.findAll({
    include: [
      { model: UserProfile, as: 'userProfile' },
      { model: UserEmail, as: 'userEmail' },
      {
        model: UserRole,
        as: 'userRoles',
        required: true,
        include: [
          {
            model: Role,
            as: 'role',
            where: { name: normalized },
            required: true,
          },
        ],
      },
    ],
  });
  return users;
};


export const setUserSingleRole = async (user, roleName, sequelizeInstance = sequelize) => {

  const normalized = (roleName || '').trim().toUpperCase();
  if (!ALLOWED_ROLES.includes(normalized)) {
    const err = new Error(`Rol no permitido. Use uno de: ${ALLOWED_ROLES.join(', ')}`);
    err.status = 400;
    throw err;
  }

  return sequelizeInstance.transaction(async (t) => {
    const isUserAdmin = (user.userRoles || []).some(
      (r) => r.role?.name === 'ADMIN_ROLE'
    );
    if (isUserAdmin && normalized !== 'ADMIN_ROLE') {
      const adminCount = await countUsersInRole('ADMIN_ROLE');
      if (adminCount <= 1) {
        const err = new Error('No se puede eliminar el último administrador');
        err.status = 409;
        throw err;
      }
    }

    const role = await getRoleByName(normalized);
    if (!role) {
      const err = new Error(`Rol ${normalized} no encontrado`);
      err.status = 404;
      throw err;
    }

    await UserRole.destroy({ where: { user_id: user.id }, transaction: t });

    await UserRole.create(
      {
        user_id: user.id,
        role_id: role.id,
      },
      { transaction: t }
    );

    const updated = await User.findByPk(user.id, {
      include: [
        { model: UserProfile, as: 'userProfile' },
        { model: UserEmail, as: 'userEmail' },
        {
          model: UserRole,
          as: 'userRoles',
          include: [{ model: Role, as: 'role' }],
        },
      ],
      transaction: t,
    });

    return { updatedUser: updated, roleName: normalized };
  });
};
