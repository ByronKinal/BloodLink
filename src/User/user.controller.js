import { User } from '../models/user.model.js';
import { validateUniqueEmail, validatePasswordLength } from '../helpers/validation.helper.js'; 

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, role, bloodType, staffPosition } = req.body;

  try {
    await validateUniqueEmail(email);

    validatePasswordLength(password);

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      bloodType,
      staffPosition
    });

    await user.save();
    return res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios'
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, role, bloodType, staffPosition } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, password, role, bloodType, staffPosition },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario'
    });
  }
};