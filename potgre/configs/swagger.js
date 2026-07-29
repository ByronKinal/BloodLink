import swaggerUi from 'swagger-ui-express';

let baseSpec = {
  openapi: '3.0.3',
  info: {
    title: 'BloodLink API',
    version: '1.0.0',
    description: 'Documentación Swagger de BloodLink',
  },
  paths: {},
  tags: [],
};

try {
  const mongoSwagger = await import('../../mongo/configs/swagger.js');
  if (mongoSwagger?.openApiSpec) {
    baseSpec = mongoSwagger.openApiSpec;
  }
} catch (error) {
  console.warn('Swagger | Módulo global de Swagger en mongo no disponible localmente, utilizando fallback');
}

const POSTGRES_PATH_PREFIXES = [
  '/auth',
  '/users',
  '/wallet',
  '/rewards',
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

const filterPaths = (paths = {}, type) => {
  const filtered = {};

  for (const [path, pathSpec] of Object.entries(paths)) {
    const isPostgresPath = POSTGRES_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
    const isMongoPath = MONGO_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));

    if (type === 'postgres' && isPostgresPath) {
      filtered[path] = cloneSpec(pathSpec);
    } else if (type === 'mongo' && isMongoPath) {
      filtered[path] = cloneSpec(pathSpec);
    }
  }

  return filtered;
};

const buildSpec = (type) => {
  const spec = cloneSpec(baseSpec);
  
  if (type === 'postgres') {
    spec.info.title = 'BloodLink API - PostgreSQL Service';
    spec.info.description = 'Endpoints manejados por el microservicio de PostgreSQL (Auth, Users, Recompensas).';
    spec.servers = [
      {
        url: 'http://localhost:{port}/api/v1',
        description: 'Microservicio PostgreSQL',
        variables: { port: { default: '3007' } },
      },
    ];
  } else {
    spec.info.title = 'BloodLink API - MongoDB Service';
    spec.info.description = 'Endpoints manejados por el microservicio de MongoDB (Citas, Triage, Bolsas, AI).';
    spec.servers = [
      {
        url: 'http://localhost:{port}/api/v1',
        description: 'Microservicio MongoDB',
        variables: { port: { default: '3006' } },
      },
    ];
  }

  spec.paths = filterPaths(baseSpec.paths, type);

  // Filter tags to only keep those that are used in the remaining paths
  const usedTags = new Set();
  for (const pathSpec of Object.values(spec.paths)) {
    for (const operation of Object.values(pathSpec)) {
      if (operation.tags) {
        operation.tags.forEach(tag => usedTags.add(tag));
      }
    }
  }
  spec.tags = baseSpec.tags.filter(tag => usedTags.has(tag.name));

  return spec;
};

export const setupSwagger = (app) => {
  const postgresSpec = buildSpec('postgres');
  const mongoSpec = buildSpec('mongo');

  app.get('/docs/postgres.json', (req, res) => res.json(postgresSpec));
  app.get('/docs/mongo.json', (req, res) => res.json(mongoSpec));

  const options = {
    explorer: true,
    swaggerOptions: {
      urls: [
        { url: '/docs/postgres.json', name: 'PostgreSQL Service' },
        { url: '/docs/mongo.json', name: 'MongoDB Service' }
      ]
    },
    customSiteTitle: 'BloodLink API Docs'
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(null, options));
};