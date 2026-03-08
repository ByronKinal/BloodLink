'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { dbConnection } from './db.js';
// Ensure models are registered before DB sync
import '../src/users/user.model.js';
import '../src/Auth/role.model.js';
import '../src/appointments/appointment.model.js';
import '../src/triage/triage.model.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/server-genericError-handler.js';
import authRoutes from '../src/Auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import profileRoutes from '../src/profiles/profile.routes.js';
import aiRoutes from '../src/ai/ai.routes.js';
import appointmentRoutes from '../src/appointments/appointment.routes.js';
import triageRoutes from '../src/triage/triage.routes.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(requestLimit);
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  app.use('/ai', aiRoutes);
  app.use('/appointments', appointmentRoutes);
  app.use('/triage', triageRoutes);
  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/users`, userRoutes);
  app.use(`${BASE_PATH}/profiles`, profileRoutes);
  app.use(`${BASE_PATH}/ai`, aiRoutes);
  app.use(`${BASE_PATH}/appointments`, appointmentRoutes);
  app.use(`${BASE_PATH}/triage`, triageRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'BloodLink Authentication Service',
      mongo: mongoStatus,
    });
  });

  // 404 handler (standardized)
  app.use(notFound);
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3006;
  app.set('trust proxy', 1);

  try {
    await dbConnection();

    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB | Connected to MongoDB');
    } else {
      console.warn('MongoDB | MONGODB_URI no definido, perfiles Mongo deshabilitados');
    }

    // Seed essential data (roles)
    const { seedRoles } = await import('../helpers/role-seed.js');
    const { seedAdminUser } = await import('../helpers/admin-seed.js');
    await seedRoles();
    await seedAdminUser();
    middlewares(app);
    routes(app);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`BloodLink Auth Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
    });
  } catch (err) {
    console.error(`Error starting Auth Server: ${err.message}`);
    process.exit(1);
  }
};
