import { config } from './config.js';

export const corsOptions = {
  origin: (origin, callback) => {
    // Si no hay origin (solicitudes desde mismo servidor/curl)
    if (!origin) return callback(null, true);

    // Separar orígenes permitidos
    const allowedOrigins = [
      ...(config.cors.allowedOrigins || []),
      ...(config.cors.adminAllowedOrigins || []),
    ];

    // Si está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
