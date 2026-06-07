import { randomUUID } from 'crypto';
import { ApiResponse } from '../utils/ApiResponse.js';

const buildErrorData = (err, traceId) => ({
  errorCode: err?.errorCode || null,
  traceId,
  timestamp: new Date().toISOString(),
});

export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err);

  const traceId = err?.traceId || randomUUID();
  const data = buildErrorData(err, traceId);

  if (err?.name === 'ValidationError') {
    return res
      .status(400)
      .json(ApiResponse.error('Error de validación', data));
  }

  if (err?.name === 'CastError') {
    return res.status(400).json(ApiResponse.error('ID inválido', data));
  }

  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    const value = err.keyValue?.[field] || '';
    const duplicateData = {
      ...data,
      field,
      value,
    };

    return res
      .status(400)
      .json(ApiResponse.error(`El ${field} '${value}' ya está en uso`, duplicateData));
  }

  if (err?.name === 'JsonWebTokenError') {
    return res.status(401).json(ApiResponse.error('Token inválido', data));
  }

  if (err?.name === 'TokenExpiredError') {
    return res.status(401).json(ApiResponse.error('Token expirado', data));
  }

  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(400)
      .json(ApiResponse.error('El archivo es demasiado grande', data));
  }

  if (err?.name === 'MongoNetworkError') {
    return res
      .status(503)
      .json(ApiResponse.error('Error de conexión a la base de datos', data));
  }

  if (err?.status) {
    return res
      .status(err.status)
      .json(ApiResponse.error(err.message || 'Error del servidor', data));
  }

  return res.status(500).json(ApiResponse.error('Error interno del servidor', data));
};

export const notFound = (req, res) => {
  const traceId = randomUUID();
  return res
    .status(404)
    .json(
      ApiResponse.error(`Ruta ${req.originalUrl} no encontrada`, {
        errorCode: null,
        traceId,
        timestamp: new Date().toISOString(),
      })
    );
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
