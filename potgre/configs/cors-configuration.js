import { config } from './config.js';

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const defaultOrigins = [
      config.app.frontendUrl,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
    ].filter(Boolean);

    const allowedOrigins = new Set([
      ...defaultOrigins,
      ...(config.cors.allowedOrigins || []),
      ...(config.cors.adminAllowedOrigins || []),
    ]);

    // In development, also accept any localhost dev ports commonly used.
    if (process.env.NODE_ENV === 'development') {
      ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174']
        .forEach((o) => allowedOrigins.add(o));
    }

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
