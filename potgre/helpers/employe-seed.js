import { Op } from 'sequelize';
import { STAFF_ROLE } from './role-constants.js';
import { createNewUser } from './user-db.js';
import { User, UserEmail } from '../src/users/user.model.js';
import { Role, UserRole } from '../src/Auth/role.model.js';

const parseBoolean = (value) => String(value).toLowerCase() === 'true';

const DEFAULT_EMPLOYEE = {
  name: 'Employee',
  surname: 'Staff',
  username: 'employee',
  email: 'employee@bloodlink.local',
  password: 'Employee1234',
  phone: '55556666',
};

const shouldSeedEmployee = () => {
  if (typeof process.env.SEED_EMPLOYEE_ON_STARTUP === 'undefined') {
    return true;
  }
  return parseBoolean(process.env.SEED_EMPLOYEE_ON_STARTUP);
};

const getEmployeeSeedConfig = () => ({
  name: process.env.SEED_EMPLOYEE_NAME || DEFAULT_EMPLOYEE.name,
  surname: process.env.SEED_EMPLOYEE_SURNAME || DEFAULT_EMPLOYEE.surname,
  username: process.env.SEED_EMPLOYEE_USERNAME || DEFAULT_EMPLOYEE.username,
  email: process.env.SEED_EMPLOYEE_EMAIL || DEFAULT_EMPLOYEE.email,
  password: process.env.SEED_EMPLOYEE_PASSWORD || DEFAULT_EMPLOYEE.password,
  phone: process.env.SEED_EMPLOYEE_PHONE || DEFAULT_EMPLOYEE.phone,
});

const validateConfig = (seedConfig) => {
  const required = ['name', 'surname', 'username', 'email', 'password', 'phone'];
  const missing = required.filter((key) => !seedConfig[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required employee seed env vars: ${missing
        .map((key) => `SEED_EMPLOYEE_${key.toUpperCase()}`)
        .join(', ')}`
    );
  }
};

const ensureUserIsEmployee = async (userId, staffRoleId) => {
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

export const seedEmployeeUser = async () => {
  if (!shouldSeedEmployee()) {
    console.log('Employee seed skipped: SEED_EMPLOYEE_ON_STARTUP=false');
    return;
  }

  const seedConfig = getEmployeeSeedConfig();

  validateConfig(seedConfig);

  const staffRole = await Role.findOne({ where: { name: STAFF_ROLE } });
  if (!staffRole) {
    throw new Error('STAFF_ROLE not found. Ensure roles are seeded first.');
  }

  const usingDefaultCredentials =
    seedConfig.email === DEFAULT_EMPLOYEE.email &&
    seedConfig.username === DEFAULT_EMPLOYEE.username &&
    seedConfig.password === DEFAULT_EMPLOYEE.password;

  if (usingDefaultCredentials) {
    console.warn(
      'Employee seed is using default credentials. Configure SEED_EMPLOYEE_* env vars in production.'
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
    await ensureUserIsEmployee(existingUser.id, staffRole.id);
    await activateUser(existingUser.id);
    console.log(
      `Employee seed: existing user promoted to STAFF_ROLE (${existingUser.email}).`
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
    bloodType: 'B+',
    zone: 'Zona 1',
    municipality: 'Guatemala',
  });

  await ensureUserIsEmployee(newUser.id, staffRole.id);
  await activateUser(newUser.id);

  console.log(`Employee seed: employee user created (${seedConfig.email}).`);
};
