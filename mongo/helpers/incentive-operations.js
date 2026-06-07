import {
  awardDonationPointsInPostgresService,
  fetchWalletFromPostgresService,
} from './postgres-service-client.js';

export const awardPointsForDonation = async (payload) => {
  return awardDonationPointsInPostgresService(payload);
};

export const getWalletByUserId = async (userId) => {
  return fetchWalletFromPostgresService(userId);
};
