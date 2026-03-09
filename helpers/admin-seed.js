import { Op } from 'sequelize';
import { ADMIN_ROLE } from './role-constants.js';
import { createNewUser } from './user-db.js';
import { User, UserEmail } from '../src/users/user.model.js';
import { Role, UserRole } from '../src/Auth/role.model.js';

const parseBoolean = (value) => String(value).toLowerCase() === 'true';

const DEFAULT_ADMIN = {
  name: 'Admin',
  surname: 'Root',
  username: 'admin',
  email: 'admin@bloodlink.local',
  password: 'Admin1234',
  phone: '12345678',
};

const shouldSeedAdmin = () => {
  if (typeof process.env.SEED_ADMIN_ON_STARTUP === 'undefined') {
    return true;
  }
  return parseBoolean(process.env.SEED_ADMIN_ON_STARTUP);
};

const getAdminSeedConfig = () => ({
  name: process.env.SEED_ADMIN_NAME || DEFAULT_ADMIN.name,
  surname: process.env.SEED_ADMIN_SURNAME || DEFAULT_ADMIN.surname,
  username: process.env.SEED_ADMIN_USERNAME || DEFAULT_ADMIN.username,
  email: process.env.SEED_ADMIN_EMAIL || DEFAULT_ADMIN.email,
  password: process.env.SEED_ADMIN_PASSWORD || DEFAULT_ADMIN.password,
  phone: process.env.SEED_ADMIN_PHONE || DEFAULT_ADMIN.phone,
});

const validateConfig = (seedConfig) => {
  const required = ['name', 'surname', 'username', 'email', 'password', 'phone'];
  const missing = required.filter((key) => !seedConfig[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required admin seed env vars: ${missing
        .map((key) => `SEED_ADMIN_${key.toUpperCase()}`)
        .join(', ')}`
    );
  }
};

const ensureUserIsAdmin = async (userId, adminRoleId) => {
  await UserRole.destroy({ where: { user_id: userId } });
  await UserRole.create({
    user_id: userId,
    role_id: adminRoleId,
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

export const seedAdminUser = async () => {
  if (!shouldSeedAdmin()) {
    console.log('Admin seed skipped: SEED_ADMIN_ON_STARTUP=false');
    return;
  }

  const seedConfig = getAdminSeedConfig();

  validateConfig(seedConfig);

  const adminRole = await Role.findOne({ where: { name: ADMIN_ROLE } });
  if (!adminRole) {
    throw new Error('ADMIN_ROLE not found. Ensure roles are seeded first.');
  }

  const adminCount = await UserRole.count({
    include: [{ model: Role, as: 'role', where: { name: ADMIN_ROLE } }],
    distinct: true,
    col: 'user_id',
  });

  if (adminCount > 0) {
    console.log('Admin seed skipped: an admin user already exists.');
    return;
  }

  const usingDefaultCredentials =
    seedConfig.email === DEFAULT_ADMIN.email &&
    seedConfig.username === DEFAULT_ADMIN.username &&
    seedConfig.password === DEFAULT_ADMIN.password;

  if (usingDefaultCredentials) {
    console.warn(
      'Admin seed is using default credentials. Configure SEED_ADMIN_* env vars in production.'
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
    await ensureUserIsAdmin(existingUser.id, adminRole.id);
    await activateUser(existingUser.id);
    console.log(
      `Admin seed: existing user promoted to ADMIN_ROLE (${existingUser.email}).`
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

  await ensureUserIsAdmin(newUser.id, adminRole.id);
  await activateUser(newUser.id);

  console.log(`Admin seed: admin user created (${seedConfig.email}).`);
};
