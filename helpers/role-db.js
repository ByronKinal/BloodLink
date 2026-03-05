// ================================================================
// HELPER: Operaciones de Roles en Base de Datos
// ================================================================
// Funciones para realizar operaciones CRUD sobre roles usando modelos Sequelize
// ================================================================

import { User, UserProfile, UserEmail } from '../src/users/user.model.js';
import { Role, UserRole } from '../src/Auth/role.model.js';
import { sequelize } from '../configs/db.js';
import { ALLOWED_ROLES } from './role-constants.js';

/**
 * Obtiene un rol por su nombre
 * @param {string} roleName - Nombre del rol
 * @returns {Promise<Object|null>} Rol encontrado o null
 */
export const getRoleByName = async (roleName) => {
  const normalized = (roleName || '').trim().toUpperCase();
  return Role.findOne({ where: { name: normalized } });
};

/**
 * Cuenta cuántos usuarios tienen un rol específico
 * @param {string} roleName - Nombre del rol
 * @returns {Promise<number>} Cantidad de usuarios con ese rol
 */
export const countUsersInRole = async (roleName) => {
  const normalized = (roleName || '').trim().toUpperCase();
  const count = await UserRole.count({
    include: [{ model: Role, as: 'role', where: { name: normalized } }],
    distinct: true,
    col: 'user_id',
  });
  return count;
};

/**
 * Obtiene los nombres de roles de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array<string>>} Lista de nombres de roles
 */
export const getUserRoleNames = async (userId) => {
  const userRoles = await UserRole.findAll({
    where: { user_id: userId },
    include: [{ model: Role, as: 'role' }],
  });
  return userRoles.map((ur) => ur.role?.name).filter(Boolean);
};

/**
 * Obtiene todos los usuarios que tienen un rol específico
 * @param {string} roleName - Nombre del rol
 * @returns {Promise<Array>} Lista de usuarios con ese rol
 */
export const getUsersByRole = async (roleName) => {
  const normalized = (roleName || '').trim().toUpperCase();
  const users = await User.findAll({
    include: [
      { model: UserProfile, as: 'userProfile' },
      { model: UserEmail, as: 'userEmail' },
      {
        model: UserRole,
        as: 'userRoles',
        include: [{ model: Role, as: 'role', where: { name: normalized } }],
      },
    ],
  });
  return users;
};

/**
 * Asigna un único rol a un usuario (reemplazando roles anteriores)
 * @param {Object} user - Usuario con sus roles cargados
 * @param {string} roleName - Nombre del rol a asignar
 * @param {Object} sequelizeInstance - Instancia de Sequelize para transacciones
 * @returns {Promise<Object>} Usuario actualizado y nombre del rol
 */
export const setUserSingleRole = async (user, roleName, sequelizeInstance = sequelize) => {
  // Normalizar nombre del rol
  const normalized = (roleName || '').trim().toUpperCase();
  if (!ALLOWED_ROLES.includes(normalized)) {
    const err = new Error(`Rol no permitido. Use uno de: ${ALLOWED_ROLES.join(', ')}`);
    err.status = 400;
    throw err;
  }

  return sequelizeInstance.transaction(async (t) => {
    // Si se está removiendo el rol admin, verificar que no sea el último admin
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

    // Verificar que el rol existe
    const role = await getRoleByName(normalized);
    if (!role) {
      const err = new Error(`Rol ${normalized} no encontrado`);
      err.status = 404;
      throw err;
    }

    // Eliminar roles existentes del usuario
    await UserRole.destroy({ where: { user_id: user.id }, transaction: t });

    // Asignar el nuevo rol
    await UserRole.create(
      {
        user_id: user.id,
        role_id: role.id,
      },
      { transaction: t }
    );

    // Recargar usuario con roles
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
