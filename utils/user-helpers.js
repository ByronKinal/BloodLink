import {
  getFullImageUrl,
  getDefaultAvatarPath,
} from '../helpers/cloudinary-service.js';
import { DONOR_ROLE } from '../helpers/role-constants.js';

export const buildUserResponse = (user) => {
  // Obtener la URL de la imagen de perfil
  const profilePictureUrl =
    user.userProfile && user.userProfile.profile_picture
      ? getFullImageUrl(user.userProfile.profile_picture)
      : getFullImageUrl(getDefaultAvatarPath());

  return {
    id: user.id,
    name: user.name,
    surname: user.surname,
    username: user.username,
    email: user.email,
    phone:
      user.userProfile && user.userProfile.phone ? user.userProfile.phone : '',
    bloodType:
      user.userProfile && user.userProfile.blood_type
        ? user.userProfile.blood_type
        : null,
    zone: user.userProfile && user.userProfile.zone ? user.userProfile.zone : null,
    municipality:
      user.userProfile && user.userProfile.municipality
        ? user.userProfile.municipality
        : null,
    profilePicture: profilePictureUrl,
    role: user.userRoles?.[0]?.role?.name ?? DONOR_ROLE,
    status: user.status,
    isEmailVerified: user.userEmail ? user.userEmail.email_verified : false,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

/**
 * Calcula la edad de un usuario basada en su fecha de nacimiento
 * @param {Date} dateOfBirth - Fecha de nacimiento
 * @returns {number} Edad en años
 */
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Verifica si un usuario puede donar sangre
 * @param {Object} profile - Perfil del usuario
 * @returns {Object} Resultado con motivo si no puede donar
 */
export const canUserDonate = (profile) => {
  const age = calculateAge(profile.date_of_birth);
  
  // Verificar edad (18-65 años)
  if (age < 18 || age > 65) {
    return {
      can_donate: false,
      reason: age < 18 ? 'Debes tener al menos 18 años' : 'No puedes donar a esta edad',
    };
  }
  
  // Verificar peso (mínimo 50kg)
  if (profile.weight_kg && profile.weight_kg < 50) {
    return {
      can_donate: false,
      reason: 'Debes pesar al menos 50 kg',
    };
  }
  
  // Verificar condiciones médicas
  if (profile.medical_conditions && profile.medical_conditions.toLowerCase().includes('diabetes')) {
    return {
      can_donate: false,
      reason: 'Algunas condiciones médicas impiden donar',
    };
  }
  
  return {
    can_donate: true,
    reason: null,
  };
};

/**
 * Obtiene información de compatibilidad de sangre
 * @param {string} bloodType - Tipo de sangre (A, B, AB, O)
 * @param {string} rhFactor - Factor RH (+ o -)
 * @returns {Object} Información de compatibilidad
 */
export const getBloodTypeInfo = (bloodType, rhFactor) => {
  const compatibilityMap = {
    'O+': { can_receive_from: ['O+', 'O-'], can_donate_to: ['O+', 'A+', 'B+', 'AB+'] },
    'O-': { can_receive_from: ['O-'], can_donate_to: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] },
    'A+': { can_receive_from: ['A+', 'A-', 'O+', 'O-'], can_donate_to: ['A+', 'AB+'] },
    'A-': { can_receive_from: ['A-', 'O-'], can_donate_to: ['A+', 'A-', 'AB+', 'AB-'] },
    'B+': { can_receive_from: ['B+', 'B-', 'O+', 'O-'], can_donate_to: ['B+', 'AB+'] },
    'B-': { can_receive_from: ['B-', 'O-'], can_donate_to: ['B+', 'B-', 'AB+', 'AB-'] },
    'AB+': { can_receive_from: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'], can_donate_to: ['AB+'] },
    'AB-': { can_receive_from: ['AB-', 'A-', 'B-', 'O-'], can_donate_to: ['AB+', 'AB-'] },
  };
  
  const key = `${bloodType}${rhFactor === 'positive' ? '+' : rhFactor === 'negative' ? '-' : rhFactor}`;
  return compatibilityMap[key] || null;
};
