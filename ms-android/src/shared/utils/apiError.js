export function getErrorMessage(error, fallback = 'Ocurrió un error inesperado. Intenta de nuevo.') {
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado en responder. Intenta de nuevo.';
    }
    return 'Sin conexión con el servidor. Verifica tu internet e intenta de nuevo.';
  }

  const { status, data } = error.response;

  if (data?.message) {
    return data.message;
  }

  if (status === 401) {
    return 'Tu sesión expiró. Inicia sesión de nuevo.';
  }

  if (status === 403) {
    return 'No tienes permiso para realizar esta acción.';
  }

  if (status >= 500) {
    return 'El servidor no está disponible en este momento. Intenta más tarde.';
  }

  return fallback;
}