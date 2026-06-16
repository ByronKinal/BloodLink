'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection, sequelize } from './db.js';
import '../src/users/user.model.js';
import '../src/Auth/role.model.js';
import '../src/incentives/incentive.model.js';
import '../src/rewards/reward.model.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { errorHandler, notFound } from '../middlewares/errorHandler.js';
import { setupSwagger } from './swagger.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import authRoutes from '../src/Auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import incentiveRoutes from '../src/incentives/incentive.routes.js';
import rewardRoutes from '../src/rewards/reward.routes.js';
import internalRoutes from '../src/internal/internal.routes.js';

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
  setupSwagger(app);

  app.use('/internal', internalRoutes);

  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/users`, userRoutes);
  app.use(`${BASE_PATH}/wallet`, incentiveRoutes);
  app.use(`${BASE_PATH}/rewards`, rewardRoutes);

  app.get(`${BASE_PATH}/health`, (_req, res) => {
    res.status(200).json(
      ApiResponse.success(
        {
          status: 'Healthy',
          timestamp: new Date().toISOString(),
          service: 'BloodLink PostgreSQL Service',
          postgres: sequelize ? 'Connected' : 'Disconnected',
        },
        'Servicio disponible'
      )
    );
  });

  app.use(notFound);
};

export const initPostgresServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3007;

  app.set('trust proxy', 1);

  try {
    await dbConnection();

    const { seedRoles } = await import('../helpers/role-seed.js');
    const { seedAdminUser } = await import('../helpers/admin-seed.js');
    const { seedDoctorUser } = await import('../helpers/doctor-seed.js');
    const { seedDonorUser } = await import('../helpers/user-seed.js');

    await seedRoles();
    await seedAdminUser();
    await seedDoctorUser();
    await seedDonorUser();

    middlewares(app);
    routes(app);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`BloodLink PostgreSQL Service running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
    });
  } catch (err) {
    console.error(`Error starting PostgreSQL Service: ${err.message}`);
    process.exit(1);
  }
};