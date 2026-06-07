import { User } from '../models/user.model.js';

export const validateUniqueEmail = async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('El correo electrónico ya está registrado');
  }
};

export const validatePasswordLength = (password) => {
  if (password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }
};