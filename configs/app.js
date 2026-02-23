import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import { Pool } from 'pg';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';  

const BASE_PATH = '/api';
const mongoUri = process.env.MONGODB_URI;

const buildPostgresConfig = () => {
  if (process.env.DB_POSTGRES) {
    return { connectionString: process.env.DB_POSTGRES };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
  };
};

const pool = new Pool(buildPostgresConfig());

const checkPostgres = async () => {
  await pool.query('SELECT 1');
  return true;
};

const checkMongo = async () => {
  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI');
  }

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  await mongoose.connection.db.admin().ping();
  return true;
};

const middlewares = (app) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(cors());
  app.use(helmet());
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  app.get(`${BASE_PATH}/health`, async (req, res) => {
    const results = await Promise.allSettled([checkPostgres(), checkMongo()]);
    const postgresOk = results[0].status === 'fulfilled';
    const mongoOk = results[1].status === 'fulfilled';
    const status = postgresOk && mongoOk ? 'OK' : 'DEGRADED';

    res.status(status === 'OK' ? 200 : 503).json({
      status,
      service: 'BloodLink',
      timestamp: new Date().toISOString(),
      checks: {
        postgres: postgresOk ? 'Online' : 'Offline',
        mongo: mongoOk ? 'Online' : 'Offline',
      },
    });
  });

  app.use(userRoutes); 
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3006;
  const httpServer = http.createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
    },
  });

  try {
    middlewares(app);
    routes(app);

    app.use((err, req, res, next) => {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    httpServer.listen(PORT, () => {
      console.log(`BloodLink running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error(`Error starting server: ${err.message}`);
    process.exit(1);
  }
};