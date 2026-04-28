import {
  fetchUserByIdFromPostgresService,
  fetchUsersByIdsFromPostgresService,
} from './postgres-service-client.js';

export const findUserById = async (userId) => {
  return fetchUserByIdFromPostgresService(userId);
};

export const findUsersByIds = async (userIds = []) => {
  return fetchUsersByIdsFromPostgresService(userIds);
};
