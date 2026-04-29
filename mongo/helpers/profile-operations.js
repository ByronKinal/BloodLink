import { findUserById } from './user-db.js';
import { buildUserResponse } from '../utils/user-helpers.js';

export const getUserProfileHelper = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  return buildUserResponse(user);
};


export const createUserProfile = async (userId, profileData) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender = null,
    blood_type = null,
    rh_factor = null,
    weight_kg = null,
    height_cm = null,
    address = null,
    city = null,
    state = null,
    postal_code = null,
    country = null,
    emergency_contact_name = null,
    emergency_contact_phone = null,
    medical_conditions = null,
    allergies = null,
    current_medications = null,
    profile_image_url = null,
    bio = null,
  } = profileData;

  try {
    const result = await sequelize.query(
      `INSERT INTO user_profiles (
        user_id, first_name, last_name, date_of_birth, gender, blood_type, rh_factor,
        weight_kg, height_cm, address, city, state, postal_code, country,
        emergency_contact_name, emergency_contact_phone, medical_conditions,
        allergies, current_medications, profile_image_url, bio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *`,
      {
        replacements: [
          userId, first_name, last_name, date_of_birth, gender, blood_type, rh_factor,
          weight_kg, height_cm, address, city, state, postal_code, country,
          emergency_contact_name, emergency_contact_phone, medical_conditions,
          allergies, current_medications, profile_image_url, bio,
        ],
        type: sequelize.QueryTypes.INSERT
      }
    );

    return result[0];
  } catch (error) {
    console.error('Error al crear perfil de usuario:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const result = await sequelize.query(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      { replacements: [userId], type: sequelize.QueryTypes.SELECT }
    );
    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileUpdates) => {
  try {
    const fields = [];
    const values = [];

    Object.keys(profileUpdates).forEach((key) => {
      if (key !== 'id' && key !== 'user_id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(profileUpdates[key]);
      }
    });

    if (fields.length === 0) {
      return await getUserProfile(userId);
    }

    values.push(userId);

    const result = await sequelize.query(
      `UPDATE user_profiles 
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?
       RETURNING *`,
      { replacements: values, type: sequelize.QueryTypes.UPDATE }
    );

    return result[0];
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    throw error;
  }
};

export const updateDonationStatus = async (userId, canDonate) => {
  const result = await pool.query(
    `UPDATE user_profiles 
     SET can_donate = $1, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2
     RETURNING *`,
    [canDonate, userId]
  );
  return result.rows[0];
};
