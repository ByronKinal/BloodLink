'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { dbConnection } from './db.js';
import '../src/users/user.model.js';
import '../src/Auth/role.model.js';
import '../src/appointments/appointment.model.js';
import '../src/triage/triage.model.js';
import '../src/iot/donation.model.js';
import '../src/blood-bags/blood-bag.model.js';
import '../src/audit/audit-log.model.js';
import '../src/incentives/incentive.model.js';
import '../src/rewards/reward.model.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/errorHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import authRoutes from '../src/Auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import profileRoutes from '../src/profiles/profile.routes.js';
import aiRoutes from '../src/ai/ai.routes.js';
import appointmentRoutes from '../src/appointments/appointment.routes.js';
import triageRoutes from '../src/triage/triage.routes.js';
import iotRoutes from '../src/iot/iot.routes.js';
import bloodBagRoutes from '../src/blood-bags/blood-bag.routes.js';
import auditRoutes from '../src/audit/audit.routes.js';
import reportRoutes from '../src/reports/report.routes.js';
import incentiveRoutes from '../src/incentives/incentive.routes.js';
import rewardRoutes from '../src/rewards/reward.routes.js';

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
  app.use('/blood-bags', bloodBagRoutes);
  app.use('/audit', auditRoutes);
  app.use('/reports', reportRoutes);
  app.use('/wallet', incentiveRoutes);
  app.use('/rewards', rewardRoutes);
  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/users`, userRoutes);
  app.use(`${BASE_PATH}/profiles`, profileRoutes);
  app.use(`${BASE_PATH}/ai`, aiRoutes);
  app.use(`${BASE_PATH}/appointments`, appointmentRoutes);
  app.use(`${BASE_PATH}/triage`, triageRoutes);
  app.use(`${BASE_PATH}/iot`, iotRoutes);
  app.use(`${BASE_PATH}/blood-bags`, bloodBagRoutes);
  app.use(`${BASE_PATH}/audit`, auditRoutes);
  app.use(`${BASE_PATH}/reports`, reportRoutes);
  app.use(`${BASE_PATH}/wallet`, incentiveRoutes);
  app.use(`${BASE_PATH}/rewards`, rewardRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    const mongoStatus =
      mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

    res.status(200).json(
      ApiResponse.success(
        {
          status: 'Healthy',
          timestamp: new Date().toISOString(),
          service: 'BloodLink Authentication Service',
          mongo: mongoStatus,
        },
        'Servicio disponible'
      )
    );
  });

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
