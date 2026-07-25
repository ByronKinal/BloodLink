import {
  awardDonationPointsInPostgresService,
  awardAppointmentConfirmationPointsInPostgresService,
  fetchWalletFromPostgresService,
} from './postgres-service-client.js';

export const awardPointsForDonation = async (payload) => {
  return awardDonationPointsInPostgresService(payload);
};

export const awardPointsForAppointmentConfirmation = async (payload) => {
  return awardAppointmentConfirmationPointsInPostgresService(payload);
};

export const getWalletByUserId = async (userId) => {
  return fetchWalletFromPostgresService(userId);
};
