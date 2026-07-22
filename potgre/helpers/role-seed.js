import { Role } from '../src/Auth/role.model.js';
import { ALLOWED_ROLES } from './role-constants.js';

export const seedRoles = async () => {
  for (const name of ALLOWED_ROLES) {
    await Role.findOrCreate({
      where: { name },
      defaults: { name },
    });
  }
};

