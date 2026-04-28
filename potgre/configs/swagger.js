import swaggerUi from 'swagger-ui-express';
import { openApiSpec as baseSpec } from '../../../configs/swagger.js';

const MONGO_TAG = 'MongoDB Service';
const POSTGRES_TAG = 'PostgreSQL Service';

const POSTGRES_PATH_PREFIXES = [
  '/api/v1/auth',
  '/api/v1/users',
  '/api/v1/wallet',
  '/api/v1/rewards',
];

const MONGO_PATH_PREFIXES = [
  '/ai',
  '/appointments',
  '/triage',
  '/iot',
  '/blood-bags',
  '/audit',
  '/reports',
  '/profiles',
  '/api/v1/ai',
  '/api/v1/appointments',
  '/api/v1/triage',
  '/api/v1/iot',
  '/api/v1/blood-bags',
  '/api/v1/audit',
  '/api/v1/reports',
  '/api/v1/profiles',
];

const cloneSpec = (spec) => JSON.parse(JSON.stringify(spec));

const filterPaths = (paths = {}) => {
  const filtered = {};

  for (const [path, pathSpec] of Object.entries(paths)) {
    const isPostgresPath = POSTGRES_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
    const isMongoPath = MONGO_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));

    if (!isPostgresPath && !isMongoPath) {
      continue;
    }

    filtered[path] = cloneSpec(pathSpec);
    const assignedTag = isPostgresPath ? POSTGRES_TAG : MONGO_TAG;

    for (const operation of Object.values(filtered[path])) {
      if (operation && typeof operation === 'object' && operation.tags) {
        operation.tags = [assignedTag];
      }
    }
  }

  return filtered;
};

const buildSpec = () => {
  const spec = cloneSpec(baseSpec);
  spec.info.title = 'BloodLink API - MongoDB y PostgreSQL';
  spec.info.description = 'Documentacion centralizada de los dos microservicios de BloodLink.';
  spec.tags = [
    { name: MONGO_TAG, description: 'Endpoints del microservicio MongoDB' },
    { name: POSTGRES_TAG, description: 'Endpoints del microservicio PostgreSQL' },
  ];
  spec.servers = [
    {
      url: 'http://localhost:{port}/api/v1',
      description: 'Servidor local - API versionada',
      variables: {
        port: { default: '3007' },
      },
    },
  ];
  spec.paths = filterPaths(baseSpec.paths);

  return spec;
};

export const setupSwagger = (app) => {
  const spec = buildSpec();

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
};