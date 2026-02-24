import {
  User,
  UserProfile,
  UserEmail,
  UserPasswordReset,
} from '../src/users/user.model.js';
import { Role, UserRole } from '../src/auth/role.model.js';
import { USER_ROLE } from './role-constants.js';
import { hashPassword } from '../utils/password-utils.js';
import { Op } from 'sequelize';

const DEFAULT_ROLE = USER_ROLE;

/**
 * Helper para buscar un usuario por email o username
 * @param {string} emailOrUsername - Email o username del usuario
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const findUserByEmailOrUsername = async (emailOrUsername) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrUsername.toLowerCase() },
          { username: emailOrUsername.toLowerCase() },
        ],
      },
      include: [
        { model: UserProfile, as: 'userProfile' },
        { model: UserEmail, as: 'userEmail' },
        { model: UserPasswordReset, as: 'userPasswordReset' },
        {
          model: UserRole,
          as: 'userRoles',
          include: [{ model: Role, as: 'Role' }],
        },
      ],
    });

    return user;
  } catch (error) {
    console.error('Error buscando usuario:', error);
    throw new Error('Error al buscar usuario');
  }
};

export const findUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [
        { model: UserProfile, as: 'userProfile' },
        { model: UserEmail, as: 'userEmail' },
        { model: UserPasswordReset, as: 'userPasswordReset' },
        {
          model: UserRole,
          as: 'userRoles',
          include: [{ model: Role, as: 'Role' }],
        },
      ],
    });

    return user;
  } catch (error) {
    console.error('Error buscando usuario por ID:', error);
    throw new Error('Error al buscar usuario');
  }
};

export const checkUserExists = async (email, username) => {
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    return !!existingUser;
  } catch (error) {
    console.error('Error verificando si el usuario existe:', error);
    throw new Error('Error al verificar usuario');
  }
};

export const createNewUser = async (userData) => {
  const transaction = await User.sequelize.transaction();

  try {
    const { name, surname, username, email, password, phone, profilePicture } =
      userData;

    const hashedPassword = await hashPassword(password);

    // Crear el usuario principal
    const user = await User.create(
      {
        name: name,
        surname: surname,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        status: false, // Empieza desactivado hasta que verifique el email
      },
      { transaction }
    );

    // Crear el perfil del usuario
    const { getDefaultAvatarPath } = await import(
      '../helpers/cloudinary-service.js'
    );
    const defaultAvatarFilename = getDefaultAvatarPath();

    await UserProfile.create(
      {
        user_id: user.id,
        phone: phone,
        profile_picture: profilePicture || defaultAvatarFilename,
      },
      { transaction }
    );

    // Crear el registro de email
    await UserEmail.create(
      {
        user_id: user.id,
        email_verified: false,
      },
      { transaction }
    );

    // Crear el registro de reset de contraseña
    await UserPasswordReset.create(
      {
        user_id: user.id,
      },
      { transaction }
    );

    // Asignar rol DEFAULT_ROLE por defecto
    const userRole = await Role.findOne(
      { where: { Name: DEFAULT_ROLE } },
      { transaction }
    );
    if (userRole) {
      await UserRole.create(
        {
          UserId: user.id,
          RoleId: userRole.id,
        },
        { transaction }
      );
    } else {
      console.warn(
        `DEFAULT_ROLE not found in database during user creation for user ${user.id}`
      );
    }

    await transaction.commit();

    // Obtener el usuario completo con todas las relaciones
    const completeUser = await findUserById(user.id);
    return completeUser;
  } catch (error) {
    await transaction.rollback();
    console.error('Error creando usuario:', error);
    throw new Error('Error al crear usuario');
  }
};

export const updateEmailVerificationToken = async (userId, token, expiry) => {
  try {
    await UserEmail.update(
      {
        email_verification_token: token,
        email_verification_token_expiry: expiry,
      },
      {
        where: { user_id: userId },
      }
    );
  } catch (error) {
    console.error('Error actualizando token de verificación:', error);
    throw new Error('Error al actualizar token de verificación');
  }
};

export const markEmailAsVerified = async (userId) => {
  const transaction = await User.sequelize.transaction();

  try {
    // Marcar email como verificado
    await UserEmail.update(
      {
        email_verified: true,
        email_verification_token: null,
        email_verification_token_expiry: null,
      },
      {
        where: { user_id: userId },
        transaction,
      }
    );

    // Activar el usuario
    await User.update(
      {
        status: true,
      },
      {
        where: { id: userId },
        transaction,
      }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('Error marcando email como verificado:', error);
    throw new Error('Error al verificar email');
  }
};

export const updatePasswordResetToken = async (userId, token, expiry) => {
  try {
    await UserPasswordReset.update(
      {
        password_reset_token: token,
        password_reset_token_expiry: expiry,
      },
      {
        where: { user_id: userId },
      }
    );
  } catch (error) {
    console.error('Error actualizando token de reset:', error);
    throw new Error('Error al actualizar token de reset');
  }
};

export const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      include: [
        { model: UserProfile, as: 'userProfile' },
        { model: UserEmail, as: 'userEmail' },
        { model: UserPasswordReset, as: 'userPasswordReset' },
        {
          model: UserRole,
          as: 'userRoles',
          include: [{ model: Role, as: 'role' }],
        },
      ],
    });

    return user;
  } catch (error) {
    console.error('Error buscando usuario por email:', error);
    throw new Error('Error al buscar usuario');
  }
};

/**
 * Helper para buscar un usuario por token de verificación de email
 * @param {string} token - Token de verificación de email
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const findUserByEmailVerificationToken = async (token) => {
  try {
    const user = await User.findOne({
      include: [
        {
          model: UserEmail,
          as: 'userEmail',
          where: {
            email_verification_token: token,
            email_verification_token_expiry: {
              [Op.gt]: new Date(), // Token no expirado
            },
          },
        },
        {
          model: UserProfile,
          as: 'userProfile',
        },
        {
          model: UserPasswordReset,
          as: 'userPasswordReset',
        },
      ],
    });

    return user;
  } catch (error) {
    console.error('Error buscando usuario por token de verificación:', error);
    throw new Error('Error al buscar usuario');
  }
};

/**
 * Helper para buscar un usuario por token de reset de password
 * @param {string} token - Token de reset de password
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const findUserByPasswordResetToken = async (token) => {
  try {
    const user = await User.findOne({
      include: [
        {
          model: UserPasswordReset,
          as: 'userPasswordReset',
          where: {
            password_reset_token: token,
            password_reset_token_expiry: {
              [Op.gt]: new Date(), // Token no expirado
            },
          },
        },
        {
          model: UserProfile,
          as: 'userProfile',
        },
        {
          model: UserEmail,
          as: 'userEmail',
        },
      ],
    });

    return user;
  } catch (error) {
    console.error('Error buscando usuario por token de reset:', error);
    throw new Error('Error al buscar usuario');
  }
};

export const updateUserPassword = async (userId, hashedPassword) => {
  const transaction = await User.sequelize.transaction();

  try {
    // Actualizar contraseña
    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: { id: userId },
        transaction,
      }
    );

    // Limpiar token de reset
    await UserPasswordReset.update(
      {
        password_reset_token: null,
        password_reset_token_expiry: null,
      },
      {
        where: { user_id: userId },
        transaction,
      }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('Error actualizando contraseña:', error);
    throw new Error('Error al actualizar contraseña');
  }
};


/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del usuario (username, email, password, phone)
 * @returns {Promise<Object>} Usuario creado
 */
export const createUser = async (userData) => {
  const { username, email, password, phone = null } = userData;
  
  // Hash de la contraseña antes de almacenarla
  const password_hash = await hashPassword(password);

  try {
    const result = await sequelize.query(
      `INSERT INTO users (username, email, password_hash, phone)
       VALUES (?, ?, ?, ?)
       RETURNING id, uuid, username, email, is_active, is_verified, phone, 
                 last_login, created_at, updated_at`,
      { replacements: [username, email, password_hash, phone], type: sequelize.QueryTypes.INSERT }
    );
    return result[0];
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su ID incluyendo roles
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const getUserById = async (userId) => {
  try {
    const result = await sequelize.query(
      `SELECT id, uuid, username, email, is_active, is_verified, phone,
              last_login, failed_login_attempts, locked_until, created_at, updated_at
       FROM users WHERE id = ?`,
      { replacements: [userId], type: sequelize.QueryTypes.SELECT }
    );

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    user.roles = await getUserRoles(userId);
    
    return user;
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su email
 * @param {string} email - Email del usuario
 * @param {boolean} includePassword - Si se debe incluir el hash de contraseña
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const getUserByEmail = async (email, includePassword = false) => {
  try {
    const fields = includePassword
      ? 'id, uuid, username, email, password_hash, is_active, is_verified, phone, last_login, failed_login_attempts, locked_until, created_at, updated_at'
      : 'id, uuid, username, email, is_active, is_verified, phone, last_login, failed_login_attempts, locked_until, created_at, updated_at';

    const result = await sequelize.query(
      `SELECT ${fields} FROM users WHERE email = ?`,
      { replacements: [email], type: sequelize.QueryTypes.SELECT }
    );

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    
    if (!includePassword) {
      user.roles = await getUserRoles(user.id);
    }
    
    return user;
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su UUID
 * @param {string} uuid - UUID del usuario
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const getUserByUUID = async (uuid) => {
  try {
    const result = await sequelize.query(
      `SELECT id, uuid, username, email, is_active, is_verified, phone,
              last_login, failed_login_attempts, locked_until, created_at, updated_at
       FROM users WHERE uuid = ?`,
      { replacements: [uuid], type: sequelize.QueryTypes.SELECT }
    );

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    user.roles = await getUserRoles(user.id);
    
    return user;
  } catch (error) {
    console.error('Error al obtener usuario por UUID:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su username
 * @param {string} username - Username del usuario
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const getUserByUsername = async (username) => {
  try {
    const result = await sequelize.query(
      `SELECT id, uuid, username, email, is_active, is_verified, phone,
              last_login, failed_login_attempts, locked_until, created_at, updated_at
       FROM users WHERE username = ?`,
      { replacements: [username], type: sequelize.QueryTypes.SELECT }
    );

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    user.roles = await getUserRoles(user.id);
    
    return user;
  } catch (error) {
    console.error('Error al obtener usuario por username:', error);
    throw error;
  }
};

/**
 * Actualiza los datos de un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUser = async (userId, updates) => {
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Construir la query dinámica basada en los campos a actualizar
    Object.keys(updates).forEach((key) => {
      if (key === 'password') {
        // Si se actualiza la contraseña, hashearla
        fields.push(`password_hash = ?`);
        // El hash se hará asíncrono
      } else if (key !== 'id' && key !== 'uuid' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    // Si se actualiza la contraseña, hashearla
    if (updates.password) {
      const password_hash = await hashPassword(updates.password);
      values.unshift(password_hash);
    }

    if (fields.length === 0) {
      return await getUserById(userId);
    }

    values.push(userId);

    const result = await sequelize.query(
      `UPDATE users 
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
       RETURNING id, uuid, username, email, is_active, is_verified, phone,
                 last_login, created_at, updated_at`,
      { replacements: values, type: sequelize.QueryTypes.UPDATE }
    );

    return result[0];
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Elimina un usuario (soft delete marcando como inactivo)
 * @param {number} userId - ID del usuario
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
export const softDeleteUser = async (userId) => {
  try {
    await sequelize.query(
      'UPDATE users SET is_active = false WHERE id = ?',
      { replacements: [userId] }
    );
    return true;
  } catch (error) {
    console.error('Error al eliminar usuario (soft delete):', error);
    throw error;
  }
};

/**
 *try {
    await sequelize.query(
      'DELETE FROM users WHERE id = ?',
      { replacements: [userId] }
    );
    return true;
  } catch (error) {
    console.error('Error al eliminar usuario (hard delete):', error);
    throw error;
  }ber} userId - ID del usuario
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
export const hardDeleteUser = async (userId) => {
  await pool.query('DELETE FROM users WHERE id = $1', [userId]);
  return true;
};

/**
 * Obtiene todos los usuarios con paginación
 * @param {number} page - Número de página
 * @param {number} limit - Cantidad de resultados por página
 * @returns {Promise<Object>} Objeto con usuarios y metadatos de paginación
 */
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const countResult = await sequelize.query(
      'SELECT COUNT(*) as count FROM users',
      { type: sequelize.QueryTypes.SELECT }
    );
    const total = parseInt(countResult[0].count);

    const result = await sequelize.query(
      `SELECT id, uuid, username, email, is_active, is_verified, phone,
              last_login, created_at, updated_at
       FROM users
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      { replacements: [limit, offset], type: sequelize.QueryTypes.SELECT }
    );

    return {
      users: result,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    throw error;
  }
};

/**
 * Actualiza el timestamp de last_login
 * @param {number} userId - ID del usuario
 * @returns {Promise<void>}
 */
export const updateLastLogin = async (userId) => {
  try {
    await sequelize.query(
      `UPDATE users 
       SET last_login = CURRENT_TIMESTAMP, 
           failed_login_attempts = 0, 
           locked_until = NULL
       WHERE id = ?`,
      { replacements: [userId] }
    );
  } catch (error) {
    console.error('Error al actualizar last_login:', error);
    throw error;
  }
};

/**
 * Incrementa el contador de intentos fallidos de login
 * @param {number} userId - ID del usuario
 * @returns {Promise<number>} Número actual de intentos fallidos
 */
export const incrementFailedLoginAttempts = async (userId) => {
  try {
    const result = await sequelize.query(
      'SELECT failed_login_attempts FROM users WHERE id = ?',
      { replacements: [userId], type: sequelize.QueryTypes.SELECT }
    );
    
    const attempts = result[0].failed_login_attempts + 1;
    
    // Bloquear cuenta si supera 5 intentos (30 minutos)
    if (attempts >= 5) {
      await sequelize.query(
        `UPDATE users 
         SET failed_login_attempts = ?, 
             locked_until = CURRENT_TIMESTAMP + INTERVAL '30 minutes'
         WHERE id = ?`,
        { replacements: [attempts, userId] }
      );
    } else {
      await sequelize.query(
        'UPDATE users SET failed_login_attempts = ? WHERE id = ?',
        { replacements: [attempts, userId] }
      );
    }
    
    return attempts;
  } catch (error) {
    console.error('Error al incrementar intentos fallidos:', error);
    throw error;
  }
};
