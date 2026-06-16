import { Op } from 'sequelize';
import { STAFF_ROLE } from './role-constants.js';
import { createNewUser } from './user-db.js';
import { User, UserEmail } from '../src/users/user.model.js';
import { Role, UserRole } from '../src/Auth/role.model.js';

const parseBoolean = (value) => String(value).toLowerCase() === 'true';

const DEFAULT_DOCTOR = {
  name: 'Doctor',
  surname: 'Médico',
  username: 'doctor',
  email: 'doctor@bloodlink.local',
  password: 'Doctor1234',
  phone: '87654321',
};

const shouldSeedDoctor = () => {
  if (typeof process.env.SEED_DOCTOR_ON_STARTUP === 'undefined') {
    return true;
  }
  return parseBoolean(process.env.SEED_DOCTOR_ON_STARTUP);
};

const getDoctorSeedConfig = () => ({
  name: process.env.SEED_DOCTOR_NAME || DEFAULT_DOCTOR.name,
  surname: process.env.SEED_DOCTOR_SURNAME || DEFAULT_DOCTOR.surname,
  username: process.env.SEED_DOCTOR_USERNAME || DEFAULT_DOCTOR.username,
  email: process.env.SEED_DOCTOR_EMAIL || DEFAULT_DOCTOR.email,
  password: process.env.SEED_DOCTOR_PASSWORD || DEFAULT_DOCTOR.password,
  phone: process.env.SEED_DOCTOR_PHONE || DEFAULT_DOCTOR.phone,
});

const validateConfig = (seedConfig) => {
  const required = ['name', 'surname', 'username', 'email', 'password', 'phone'];
  const missing = required.filter((key) => !seedConfig[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required doctor seed env vars: ${missing
        .map((key) => `SEED_DOCTOR_${key.toUpperCase()}`)
        .join(', ')}`
    );
  }
};

const ensureUserIsDoctor = async (userId, staffRoleId) => {
  await UserRole.destroy({ where: { user_id: userId } });
  await UserRole.create({
    user_id: userId,
    role_id: staffRoleId,
  });
};

const activateUser = async (userId) => {
  await User.update(
    { status: true },
    {
      where: { id: userId },
    }
  );

  await UserEmail.update(
    {
      email_verified: true,
      email_verification_token: null,
      email_verification_code: null,
      email_verification_token_expiry: null,
    },
    {
      where: { user_id: userId },
    }
  );
};

export const seedDoctorUser = async () => {
  if (!shouldSeedDoctor()) {
    console.log('Doctor seed skipped: SEED_DOCTOR_ON_STARTUP=false');
    return;
  }

  const seedConfig = getDoctorSeedConfig();

  validateConfig(seedConfig);

  const staffRole = await Role.findOne({ where: { name: STAFF_ROLE } });
  if (!staffRole) {
    throw new Error('STAFF_ROLE not found. Ensure roles are seeded first.');
  }

  const doctorCount = await UserRole.count({
    include: [{ model: Role, as: 'role', where: { name: STAFF_ROLE } }],
    distinct: true,
    col: 'user_id',
  });

  if (doctorCount > 0) {
    console.log('Doctor seed skipped: a staff/doctor user already exists.');
    return;
  }

  const usingDefaultCredentials =
    seedConfig.email === DEFAULT_DOCTOR.email &&
    seedConfig.username === DEFAULT_DOCTOR.username &&
    seedConfig.password === DEFAULT_DOCTOR.password;

  if (usingDefaultCredentials) {
    console.warn(
      'Doctor seed is using default credentials. Configure SEED_DOCTOR_* env vars in production.'
    );
  }

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email: seedConfig.email.toLowerCase() },
        { username: seedConfig.username.toLowerCase() },
      ],
    },
  });

  if (existingUser) {
    await ensureUserIsDoctor(existingUser.id, staffRole.id);
    await activateUser(existingUser.id);
    console.log(
      `Doctor seed: existing user promoted to STAFF_ROLE (${existingUser.email}).`
    );
    return;
  }

  const newUser = await createNewUser({
    name: seedConfig.name,
    surname: seedConfig.surname,
    username: seedConfig.username,
    email: seedConfig.email,
    password: seedConfig.password,
    phone: seedConfig.phone,
    bloodType: 'A+',
    zone: 'Zona 1',
    municipality: 'Guatemala',
  });

  await ensureUserIsDoctor(newUser.id, staffRole.id);
  await activateUser(newUser.id);

  console.log(`Doctor seed: doctor user created (${seedConfig.email}).`);
};
