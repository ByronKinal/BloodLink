import {
  getFullImageUrl,
  getDefaultAvatarPath,
} from '../helpers/cloudinary-service.js';
import { DONOR_ROLE } from '../helpers/role-constants.js';

export const buildUserResponse = (user) => {
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

export const canUserDonate = (profile) => {
  const age = calculateAge(profile.date_of_birth);
  
  if (age < 18 || age > 65) {
    return {
      can_donate: false,
      reason: age < 18 ? 'Debes tener al menos 18 años' : 'No puedes donar a esta edad',
    };
  }
  
  if (profile.weight_kg && profile.weight_kg < 50) {
    return {
      can_donate: false,
      reason: 'Debes pesar al menos 50 kg',
    };
  }
  
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
