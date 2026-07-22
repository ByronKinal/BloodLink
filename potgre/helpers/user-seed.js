import { Op } from 'sequelize';
import { DONOR_ROLE } from './role-constants.js';
import { createNewUser } from './user-db.js';
import { User, UserEmail } from '../src/users/user.model.js';
import { Role, UserRole } from '../src/Auth/role.model.js';

const parseBoolean = (value) => String(value).toLowerCase() === 'true';

const DEFAULT_USER = {
  name: 'Usuario',
  surname: 'Demo',
  username: 'usuario',
  email: 'usuario@bloodlink.local',
  password: 'Usuario1234',
  phone: '11112222',
};

const shouldSeedUser = () => {
  if (typeof process.env.SEED_USER_ON_STARTUP === 'undefined') {
    return true;
  }
  return parseBoolean(process.env.SEED_USER_ON_STARTUP);
};

const getUserSeedConfig = () => ({
  name: process.env.SEED_USER_NAME || DEFAULT_USER.name,
  surname: process.env.SEED_USER_SURNAME || DEFAULT_USER.surname,
  username: process.env.SEED_USER_USERNAME || DEFAULT_USER.username,
  email: process.env.SEED_USER_EMAIL || DEFAULT_USER.email,
  password: process.env.SEED_USER_PASSWORD || DEFAULT_USER.password,
  phone: process.env.SEED_USER_PHONE || DEFAULT_USER.phone,
});

const validateConfig = (seedConfig) => {
  const required = ['name', 'surname', 'username', 'email', 'password', 'phone'];
  const missing = required.filter((key) => !seedConfig[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required user seed env vars: ${missing
        .map((key) => `SEED_USER_${key.toUpperCase()}`)
        .join(', ')}`
    );
  }
};

const ensureUserIsDonor = async (userId, donorRoleId) => {
  const existingRole = await UserRole.findOne({
    where: { user_id: userId, role_id: donorRoleId },
  });

  if (!existingRole) {
    await UserRole.create({
      user_id: userId,
      role_id: donorRoleId,
    });
  }
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

export const seedDonorUser = async () => {
  if (!shouldSeedUser()) {
    console.log('User seed skipped: SEED_USER_ON_STARTUP=false');
    return;
  }

  const seedConfig = getUserSeedConfig();

  validateConfig(seedConfig);

  const donorRole = await Role.findOne({ where: { name: DONOR_ROLE } });
  if (!donorRole) {
    throw new Error('DONOR_ROLE not found. Ensure roles are seeded first.');
  }

  const donorCount = await UserRole.count({
    include: [{ model: Role, as: 'role', where: { name: DONOR_ROLE } }],
    distinct: true,
    col: 'user_id',
  });

  if (donorCount > 0) {
    console.log('User seed skipped: a donor user already exists.');
    return;
  }

  const usingDefaultCredentials =
    seedConfig.email === DEFAULT_USER.email &&
    seedConfig.username === DEFAULT_USER.username &&
    seedConfig.password === DEFAULT_USER.password;

  if (usingDefaultCredentials) {
    console.warn(
      'User seed is using default credentials. Configure SEED_USER_* env vars in production.'
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
    await ensureUserIsDonor(existingUser.id, donorRole.id);
    await activateUser(existingUser.id);
    console.log(
      `User seed: existing user ensured as DONOR_ROLE (${existingUser.email}).`
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
    bloodType: 'O+',
    zone: 'Zona 1',
    municipality: 'Guatemala',
  });

  await ensureUserIsDonor(newUser.id, donorRole.id);
  await activateUser(newUser.id);

  console.log(`User seed: donor user created (${seedConfig.email}).`);
};
