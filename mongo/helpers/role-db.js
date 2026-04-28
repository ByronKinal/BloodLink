import { fetchUserRoleNamesFromPostgresService } from './postgres-service-client.js';

export const getUserRoleNames = async (userId) => {
  return fetchUserRoleNamesFromPostgresService(userId);
};
