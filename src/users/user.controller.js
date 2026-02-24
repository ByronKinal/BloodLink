// ================================================================
// CONTROLADOR: Usuarios
// ================================================================
// Maneja todas las operaciones relacionadas con usuarios
// Incluye: crear, obtener, actualizar y eliminar usuarios
// ================================================================

import {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUUID,
  getUserByUsername,
  updateUser,
  softDeleteUser,
  hardDeleteUser,
  getAllUsers,
} from '../../helpers/user-db.js';
import { getUserProfile, createUserProfile, updateUserProfile } from '../../helpers/profile-operations.js';
import { assignRoleToUser, removeRoleFromUser, getRoleByName } from '../../helpers/role-db.js';

/**
 * Crea un nuevo usuario en el sistema
 * POST /api/users
 * Body: { username, email, password, phone }
 */
export const createUserController = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Verificar si el email ya existe
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }

    // Verificar si el username ya existe
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'El username ya está en uso',
      });
    }

    // Crear el usuario
    const user = await createUser({ username, email, password, phone });

    // Asignar rol por defecto (donor)
    const donorRole = await getRoleByName('donor');
    if (donorRole) {
      await assignRoleToUser(user.id, donorRole.id);
    }

    // Obtener el usuario completo con roles
    const completeUser = await getUserById(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: completeUser,
    });
  } catch (error) {
    console.error('Error en createUserController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el usuario',
      error: error.message,
    });
  }
};

/**
 * Obtiene un usuario por su ID
 * GET /api/users/:id
 */
export const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(parseInt(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Obtener el perfil si existe
    const profile = await getUserProfile(user.id);
    if (profile) {
      user.profile = profile;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error en getUserByIdController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error.message,
    });
  }
};

/**
 * Obtiene un usuario por su UUID
 * GET /api/users/uuid/:uuid
 */
export const getUserByUUIDController = async (req, res) => {
  try {
    const { uuid } = req.params;

    const user = await getUserByUUID(uuid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Obtener el perfil si existe
    const profile = await getUserProfile(user.id);
    if (profile) {
      user.profile = profile;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error en getUserByUUIDController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error.message,
    });
  }
};

/**
 * Obtiene todos los usuarios con paginación
 * GET /api/users?page=1&limit=10
 */
export const getAllUsersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getAllUsers(page, limit);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error en getAllUsersController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios',
      error: error.message,
    });
  }
};

/**
 * Actualiza los datos de un usuario
 * PUT /api/users/:id
 * Body: { username, email, phone, is_active, etc }
 */
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verificar que el usuario existe
    const existingUser = await getUserById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Si se actualiza el email, verificar que no esté en uso
    if (updates.email && updates.email !== existingUser.email) {
      const emailInUse = await getUserByEmail(updates.email);
      if (emailInUse) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso',
        });
      }
    }

    // Si se actualiza el username, verificar que no esté en uso
    if (updates.username && updates.username !== existingUser.username) {
      const usernameInUse = await getUserByUsername(updates.username);
      if (usernameInUse) {
        return res.status(400).json({
          success: false,
          message: 'El username ya está en uso',
        });
      }
    }

    // Actualizar el usuario
    const updatedUser = await updateUser(parseInt(id), updates);

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error en updateUserController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario',
      error: error.message,
    });
  }
};

/**
 * Elimina un usuario (soft delete)
 * DELETE /api/users/:id
 */
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const existingUser = await getUserById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Soft delete (marcar como inactivo)
    await softDeleteUser(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Usuario desactivado exitosamente',
    });
  } catch (error) {
    console.error('Error en deleteUserController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario',
      error: error.message,
    });
  }
};

/**
 * Crea o actualiza el perfil de un usuario
 * POST /api/users/:id/profile
 * Body: { first_name, last_name, date_of_birth, blood_type, etc }
 */
export const createOrUpdateProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const profileData = req.body;

    // Verificar que el usuario existe
    const existingUser = await getUserById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Verificar si ya tiene perfil
    const existingProfile = await getUserProfile(parseInt(id));

    let profile;
    if (existingProfile) {
      // Actualizar perfil existente
      profile = await updateUserProfile(parseInt(id), profileData);
    } else {
      // Crear nuevo perfil
      profile = await createUserProfile(parseInt(id), profileData);
    }

    res.status(200).json({
      success: true,
      message: existingProfile ? 'Perfil actualizado exitosamente' : 'Perfil creado exitosamente',
      data: profile,
    });
  } catch (error) {
    console.error('Error en createOrUpdateProfileController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al gestionar el perfil',
      error: error.message,
    });
  }
};

/**
 * Obtiene el perfil de un usuario
 * GET /api/users/:id/profile
 */
export const getUserProfileController = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const existingUser = await getUserById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    const profile = await getUserProfile(parseInt(id));

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error en getUserProfileController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil',
      error: error.message,
    });
  }
};

/**
 * Asigna un rol a un usuario
 * POST /api/users/:id/roles
 * Body: { role_name }
 */
export const assignRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name } = req.body;

    // Verificar que el usuario existe
    const existingUser = await getUserById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Obtener el rol por nombre
    const role = await getRoleByName(role_name);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado',
      });
    }

    // Asignar el rol (el usuario autenticado se obtendría del token JWT)
    await assignRoleToUser(parseInt(id), role.id, req.user?.id || null);

    // Obtener usuario actualizado con roles
    const updatedUser = await getUserById(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Rol asignado exitosamente',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error en assignRoleController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al asignar el rol',
      error: error.message,
    });
  }
};

/**
 * Remueve un rol de un usuario
 * DELETE /api/users/:id/roles/:roleId
 */
export const removeRoleController = async (req, res) => {
  try {
    const { id, roleId } = req.params;

    // Verificar que el usuario existe
    const existingUser = await getUserById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    await removeRoleFromUser(parseInt(id), parseInt(roleId));

    // Obtener usuario actualizado con roles
    const updatedUser = await getUserById(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Rol removido exitosamente',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error en removeRoleController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al remover el rol',
      error: error.message,
    });
  }
};
