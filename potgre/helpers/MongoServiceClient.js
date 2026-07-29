const getMongoServiceUrl = () => {
  const mongoServiceUrl = process.env.MONGO_SERVICE_URL || 'http://localhost:3006';
  return mongoServiceUrl.replace(/\/$/, '');
};

export const createMongoProfile = async (profileData) => {
  try {
    const mongoUrl = getMongoServiceUrl();
    const response = await fetch(`${mongoUrl}/internal/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Failed to create mongo profile. Status:', response.status, payload);
      return {
        success: false,
        message: payload.message || 'Error en el servicio MongoDB',
      };
    }

    return {
      success: true,
      data: payload.data ?? payload,
    };
  } catch (error) {
    console.error('Network error calling MongoDB service for profile creation:', error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};
