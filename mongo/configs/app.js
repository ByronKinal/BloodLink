'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectMongoDatabase } from './db.js';
import '../src/appointments/appointment.model.js';
import '../src/triage/triage.model.js';
import '../src/iot/donation.model.js';
import '../src/blood-bags/blood-bag.model.js';
import '../src/audit/audit-log.model.js';
import '../src/donation-centers/donation-center.model.js';
import '../src/notifications/notification.model.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/errorHandler.js';
import { setupSwagger } from './swagger.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import profileRoutes from '../src/profiles/profile.routes.js';
import aiRoutes from '../src/ai/ai.routes.js';
import appointmentRoutes from '../src/appointments/appointment.routes.js';
import triageRoutes from '../src/triage/triage.routes.js';
import iotRoutes from '../src/iot/iot.routes.js';
import bloodBagRoutes from '../src/blood-bags/blood-bag.routes.js';
import auditRoutes from '../src/audit/audit.routes.js';
import reportRoutes from '../src/reports/report.routes.js';
import internalRoutes from '../src/internal/InternalRoutes.js';
import donationCenterRoutes from '../src/donation-centers/donation-center.routes.js';
import notificationRoutes from '../src/notifications/notification.routes.js';

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

  app.use(`${BASE_PATH}/profiles`, profileRoutes);
  app.use(`${BASE_PATH}/ai`, aiRoutes);
  app.use(`${BASE_PATH}/appointments`, appointmentRoutes);
  app.use(`${BASE_PATH}/triage`, triageRoutes);
  app.use(`${BASE_PATH}/iot`, iotRoutes);
  app.use(`${BASE_PATH}/blood-bags`, bloodBagRoutes);
  app.use(`${BASE_PATH}/audit`, auditRoutes);
  app.use(`${BASE_PATH}/reports`, reportRoutes);
  app.use(`${BASE_PATH}/donation-centers`, donationCenterRoutes);
  app.use(`${BASE_PATH}/notifications`, notificationRoutes);

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
    await connectMongoDatabase();

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
