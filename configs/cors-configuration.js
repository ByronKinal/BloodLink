import { config } from './config.js';

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      ...(config.cors.allowedOrigins || []),
      ...(config.cors.adminAllowedOrigins || []),
    ];

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
