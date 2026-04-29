import {
  fetchUserRoleNamesFromPostgresService,
  fetchUsersByRoleFromPostgresService,
} from './postgres-service-client.js';

export const getUserRoleNames = async (userId) => {
  return fetchUserRoleNamesFromPostgresService(userId);
};

export const getUsersByRole = async (roleName) => {
  return fetchUsersByRoleFromPostgresService(roleName);
};
