import { config } from './config.js';

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    // Combine configured allowed origins. In development, also accept local dev ports.
    const allowedOrigins = [
      ...(config.cors.allowedOrigins || []),
      ...(config.cors.adminAllowedOrigins || []),
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (process.env.NODE_ENV === 'development') {
      const devOrigins = ['http://localhost:5173', 'http://localhost:5174'];
      devOrigins.forEach((o) => {
        if (!allowedOrigins.includes(o)) allowedOrigins.push(o);
      });
    }

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
