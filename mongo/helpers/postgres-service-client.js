const isMongoService = () => process.env.SERVICE_ROLE === 'mongo';

const getBaseUrl = () => {
  const baseUrl = process.env.POSTGRES_SERVICE_URL;

  if (!baseUrl) {
    throw new Error('POSTGRES_SERVICE_URL no definido para comunicacion entre servicios');
  }

  return baseUrl.replace(/\/$/, '');
};

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || 'Error en el servicio PostgreSQL');
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  return payload.data ?? payload;
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  return parseResponse(response);
};

export const shouldUsePostgresService = () => isMongoService();

export const fetchUserByIdFromPostgresService = async (userId) => {
  return requestJson(`/internal/users/${encodeURIComponent(userId)}`);
};

export const fetchUsersByIdsFromPostgresService = async (userIds = []) => {
  const ids = Array.from(
    new Set((userIds || []).map((value) => String(value || '').trim()).filter(Boolean))
  );

  if (ids.length === 0) {
    return [];
  }

  const query = new URLSearchParams({ ids: ids.join(',') });
  return requestJson(`/internal/users/batch?${query.toString()}`);
};

export const fetchUserRoleNamesFromPostgresService = async (userId) => {
  return requestJson(`/internal/users/${encodeURIComponent(userId)}/roles`);
};

export const fetchWalletFromPostgresService = async (userId) => {
  return requestJson(`/internal/wallets/${encodeURIComponent(userId)}`);
};

export const awardDonationPointsInPostgresService = async (payload) => {
  return requestJson('/internal/incentives/award-donation', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};