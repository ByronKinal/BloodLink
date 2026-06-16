import { config } from './config.js';

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const defaultOrigins = [
      config.app.frontendUrl,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ].filter(Boolean);

    const allowedOrigins = new Set([
      ...defaultOrigins,
      ...(config.cors.allowedOrigins || []),
      ...(config.cors.adminAllowedOrigins || []),
    ]);

    if (allowedOrigins.has(origin)) {
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
