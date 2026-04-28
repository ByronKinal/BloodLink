import swaggerUi from 'swagger-ui-express';

const bearerAuth = [{ bearerAuth: [] }];

const jsonResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: { nullable: true },
    message: { type: 'string', example: 'Operacion exitosa' },
  },
};

const validationErrorResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: 'Errores de validacion' },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string', example: 'email' },
          message: { type: 'string', example: 'Debe proporcionar un email valido' },
          value: { example: 'invalid-email' },
        },
      },
    },
  },
};

const dualVersionServers = [
  {
    url: 'http://localhost:{port}/api/v1',
    description: 'Servidor local - API versionada',
    variables: {
      port: {
        default: '3006',
      },
    },
  },
  {
    url: 'http://localhost:{port}',
    description: 'Servidor local - rutas legacy sin /api/v1',
    variables: {
      port: {
        default: '3006',
      },
    },
  },
];

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'BloodLink API',
    version: '1.0.0',
    description:
      'Documentacion Swagger de todos los modulos del proyecto BloodLink. Incluye endpoints versionados (/api/v1) y aliases legacy sin version para algunos recursos.',
  },
  servers: [
    {
      url: 'http://localhost:{port}/api/v1',
      description: 'Servidor local - API versionada',
      variables: {
        port: {
          default: '3006',
        },
      },
    },
  ],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Profiles' },
    { name: 'AI' },
    { name: 'Appointments' },
    { name: 'Triage' },
    { name: 'IoT' },
    { name: 'Blood Bags' },
    { name: 'Audit' },
    { name: 'Reports' },
    { name: 'Wallet' },
    { name: 'Rewards' },
    { name: 'System' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiResponse: jsonResponse,
      ValidationErrorResponse: validationErrorResponse,
      RegisterRequest: {
        type: 'object',
        required: ['name', 'surname', 'username', 'email', 'password', 'phone', 'bloodType'],
        properties: {
          name: { type: 'string', maxLength: 25 },
          surname: { type: 'string', maxLength: 25 },
          username: { type: 'string', maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, maxLength: 255 },
          phone: { type: 'string', pattern: '^\\d{8}$' },
          bloodType: { $ref: '#/components/schemas/BloodType' },
          zone: { type: 'string', minLength: 2, maxLength: 100 },
          municipality: { type: 'string', minLength: 2, maxLength: 100 },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['emailOrUsername', 'password'],
        properties: {
          emailOrUsername: { type: 'string' },
          password: { type: 'string' },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
      VerifyEmailRequest: {
        type: 'object',
        description: 'Enviar token o email + activationCode',
        properties: {
          token: { type: 'string' },
          email: { type: 'string', format: 'email' },
          activationCode: { type: 'string', pattern: '^\\d{6}$' },
        },
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['token', 'newPassword'],
        properties: {
          token: { type: 'string' },
          newPassword: { type: 'string', minLength: 8 },
        },
      },
      UpdateUserRoleRequest: {
        type: 'object',
        required: ['roleName'],
        properties: {
          roleName: { $ref: '#/components/schemas/RoleName' },
        },
      },
      AdminUserPatchRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 25 },
          surname: { type: 'string', minLength: 1, maxLength: 25 },
          phone: { type: 'string', pattern: '^\\d{8}$' },
          zone: { type: 'string', minLength: 2, maxLength: 100 },
          municipality: { type: 'string', minLength: 2, maxLength: 100 },
          status: { type: 'boolean' },
        },
      },
      CreateProfileRequest: {
        type: 'object',
        required: ['userId', 'email', 'password', 'roleName'],
        properties: {
          userId: { type: 'string', minLength: 12, maxLength: 12 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, maxLength: 255 },
          roleName: {
            type: 'string',
            enum: ['DONOR_ROLE', 'STAFF_ROLE'],
          },
          donorData: {
            type: 'object',
            properties: {
              bloodType: { $ref: '#/components/schemas/BloodType' },
            },
          },
          staffData: {
            type: 'object',
            properties: {
              position: { type: 'string' },
              department: { type: 'string' },
            },
          },
        },
      },
      AiAskRequest: {
        type: 'object',
        required: ['question'],
        properties: {
          question: { type: 'string', minLength: 5, maxLength: 800 },
        },
      },
      CreateAppointmentRequest: {
        type: 'object',
        required: ['date', 'time'],
        properties: {
          date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', example: '2026-03-08' },
          time: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$', example: '14:30' },
        },
      },
      ConfirmAppointmentRequest: {
        type: 'object',
        properties: {
          staffUserId: { type: 'string', minLength: 12, maxLength: 12 },
        },
      },
      CreateTriageRequest: {
        type: 'object',
        required: [
          'ageYears',
          'weightKg',
          'pulseBpm',
          'systolicMmHg',
          'diastolicMmHg',
          'temperatureC',
          'hemoglobinGdl',
          'hasFever',
          'hasInfectionSymptoms',
          'hasChronicDisease',
          'chronicDiseaseControlled',
          'consumedAlcoholLast24h',
          'tookAntibioticsLast7d',
          'pregnantOrBreastfeeding',
          'hadTattooOrPiercing',
          'hadRecentSurgery'
        ],
        properties: {
          ageYears: { type: 'integer', minimum: 0, maximum: 120 },
          weightKg: { type: 'number', minimum: 0.1, maximum: 400 },
          pulseBpm: { type: 'integer', minimum: 20, maximum: 220 },
          systolicMmHg: { type: 'integer', minimum: 60, maximum: 260 },
          diastolicMmHg: { type: 'integer', minimum: 30, maximum: 180 },
          temperatureC: { type: 'number', minimum: 32, maximum: 43 },
          hemoglobinGdl: { type: 'number', minimum: 3, maximum: 25 },
          hasFever: { type: 'boolean' },
          hasInfectionSymptoms: { type: 'boolean' },
          hasChronicDisease: { type: 'boolean' },
          chronicDiseaseControlled: { type: 'boolean' },
          consumedAlcoholLast24h: { type: 'boolean' },
          tookAntibioticsLast7d: { type: 'boolean' },
          pregnantOrBreastfeeding: { type: 'boolean' },
          hadTattooOrPiercing: { type: 'boolean' },
          hadRecentSurgery: { type: 'boolean' },
          lastTattooOrPiercingDate: { type: 'string', format: 'date-time' },
          lastSurgeryDate: { type: 'string', format: 'date-time' },
          lastDonationDate: { type: 'string', format: 'date-time' },
        },
      },
      IotWeightRequest: {
        type: 'object',
        required: ['appointmentId', 'weightGrams'],
        properties: {
          appointmentId: { type: 'string', description: 'Mongo ObjectId' },
          weightGrams: { type: 'number', minimum: 0.1, maximum: 600 },
          notes: { type: 'string', maxLength: 300 },
          deviceId: { type: 'string', maxLength: 80 },
        },
      },
      CreateRewardRequest: {
        type: 'object',
        required: ['name', 'requiredPoints', 'stock'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 120 },
          requiredPoints: { type: 'integer', minimum: 1, maximum: 100000 },
          stock: { type: 'integer', minimum: 0, maximum: 100000 },
        },
      },
      UpdateRewardRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 120 },
          requiredPoints: { type: 'integer', minimum: 1, maximum: 100000 },
          stock: { type: 'integer', minimum: 0, maximum: 100000 },
          status: { type: 'boolean' },
        },
      },
      RedeemRewardRequest: {
        type: 'object',
        required: ['rewardId'],
        properties: {
          rewardId: { type: 'string', minLength: 12, maxLength: 12 },
          quantity: { type: 'integer', minimum: 1, maximum: 100, default: 1 },
        },
      },
      RoleName: {
        type: 'string',
        enum: ['ADMIN_ROLE', 'DONOR_ROLE', 'STAFF_ROLE'],
      },
      BloodType: {
        type: 'string',
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar nuevo usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } },
          },
        },
        responses: {
          201: { description: 'Usuario registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          400: { description: 'Error de validacion', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesion',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } },
          },
        },
        responses: { 200: { description: 'Login exitoso', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refrescar access token',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenRequest' } },
          },
        },
        responses: { 200: { description: 'Token refrescado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Cerrar sesion',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenRequest' } },
          },
        },
        responses: { 200: { description: 'Sesion cerrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verificar correo',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/VerifyEmailRequest' } },
          },
        },
        responses: { 200: { description: 'Correo verificado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/auth/resend-verification': {
      post: {
        tags: ['Auth'],
        summary: 'Reenviar codigo de verificacion',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } },
          },
        },
        responses: { 200: { description: 'Codigo reenviado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Solicitar recuperacion de password',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } },
          },
        },
        responses: { 200: { description: 'Solicitud procesada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Restablecer password',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } },
          },
        },
        responses: { 200: { description: 'Password actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/users/allowed-roles': {
      get: {
        tags: ['Users'],
        summary: 'Obtener roles permitidos',
        security: bearerAuth,
        responses: { 200: { description: 'Roles permitidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/users/{userId}/role': {
      put: {
        tags: ['Users'],
        summary: 'Actualizar rol de usuario',
        security: bearerAuth,
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', minLength: 12, maxLength: 12 } }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRoleRequest' } },
          },
        },
        responses: { 200: { description: 'Rol actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/users/{userId}': {
      patch: {
        tags: ['Users'],
        summary: 'Actualizar usuario por admin',
        security: bearerAuth,
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', minLength: 12, maxLength: 12 } }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AdminUserPatchRequest' } },
          },
        },
        responses: { 200: { description: 'Usuario actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/users/{userId}/roles': {
      get: {
        tags: ['Users'],
        summary: 'Obtener roles de usuario',
        security: bearerAuth,
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', minLength: 12, maxLength: 12 } }],
        responses: { 200: { description: 'Roles del usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/users/by-role/{roleName}': {
      get: {
        tags: ['Users'],
        summary: 'Listar usuarios por rol',
        security: bearerAuth,
        parameters: [{ name: 'roleName', in: 'path', required: true, schema: { $ref: '#/components/schemas/RoleName' } }],
        responses: { 200: { description: 'Usuarios filtrados', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/profiles': {
      post: {
        tags: ['Profiles'],
        summary: 'Crear perfil',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateProfileRequest' } },
          },
        },
        responses: { 201: { description: 'Perfil creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/profiles/me': {
      get: {
        tags: ['Profiles'],
        summary: 'Obtener mi perfil',
        security: bearerAuth,
        responses: { 200: { description: 'Perfil encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/profiles/user/{userId}': {
      get: {
        tags: ['Profiles'],
        summary: 'Obtener perfil por userId',
        security: bearerAuth,
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', minLength: 12, maxLength: 12 } }],
        responses: { 200: { description: 'Perfil encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/ai/ask': {
      post: {
        tags: ['AI'],
        servers: dualVersionServers,
        summary: 'Preguntar al asistente AI',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AiAskRequest' } },
          },
        },
        responses: { 200: { description: 'Respuesta generada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/appointments': {
      post: {
        tags: ['Appointments'],
        servers: dualVersionServers,
        summary: 'Crear cita de donacion',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateAppointmentRequest' } },
          },
        },
        responses: { 201: { description: 'Cita creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/appointments/staff': {
      get: {
        tags: ['Appointments'],
        servers: dualVersionServers,
        summary: 'Agenda de staff',
        security: bearerAuth,
        parameters: [{ name: 'date', in: 'query', required: false, schema: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' } }],
        responses: { 200: { description: 'Agenda recuperada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/appointments/{appointmentId}/confirm': {
      patch: {
        tags: ['Appointments'],
        servers: dualVersionServers,
        summary: 'Confirmar cita',
        security: bearerAuth,
        parameters: [{ name: 'appointmentId', in: 'path', required: true, schema: { type: 'string' }, description: 'Mongo ObjectId' }],
        requestBody: {
          required: false,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ConfirmAppointmentRequest' } },
          },
        },
        responses: { 200: { description: 'Cita confirmada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/triage': {
      post: {
        tags: ['Triage'],
        servers: dualVersionServers,
        summary: 'Crear formulario de triage',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateTriageRequest' } },
          },
        },
        responses: { 201: { description: 'Triage creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
      get: {
        tags: ['Triage'],
        servers: dualVersionServers,
        summary: 'Listar formularios de triage',
        security: bearerAuth,
        responses: { 200: { description: 'Listado recuperado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/iot/weight': {
      post: {
        tags: ['IoT'],
        summary: 'Registrar peso de donacion desde dispositivo',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/IotWeightRequest' } },
          },
        },
        responses: { 201: { description: 'Peso registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/blood-bags/stats': {
      get: {
        tags: ['Blood Bags'],
        servers: dualVersionServers,
        summary: 'Estadisticas de bolsas',
        security: bearerAuth,
        responses: { 200: { description: 'Estadisticas recuperadas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/blood-bags/match/{requiredBloodType}': {
      get: {
        tags: ['Blood Bags'],
        servers: dualVersionServers,
        summary: 'Buscar bolsas compatibles',
        security: bearerAuth,
        parameters: [
          { name: 'requiredBloodType', in: 'path', required: true, schema: { $ref: '#/components/schemas/BloodType' } },
          { name: 'minVolumeMl', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 600 } },
        ],
        responses: { 200: { description: 'Coincidencias encontradas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/blood-bags/type/{bloodType}': {
      get: {
        tags: ['Blood Bags'],
        servers: dualVersionServers,
        summary: 'Listar bolsas por tipo de sangre',
        security: bearerAuth,
        parameters: [{ name: 'bloodType', in: 'path', required: true, schema: { $ref: '#/components/schemas/BloodType' } }],
        responses: { 200: { description: 'Bolsas filtradas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/blood-bags/{id}': {
      get: {
        tags: ['Blood Bags'],
        servers: dualVersionServers,
        summary: 'Obtener bolsa por id',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Mongo ObjectId' }],
        responses: { 200: { description: 'Bolsa encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/blood-bags': {
      get: {
        tags: ['Blood Bags'],
        servers: dualVersionServers,
        summary: 'Listar todas las bolsas',
        security: bearerAuth,
        responses: { 200: { description: 'Bolsas recuperadas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/audit': {
      get: {
        tags: ['Audit'],
        servers: dualVersionServers,
        summary: 'Listar logs de auditoria (admin)',
        security: bearerAuth,
        parameters: [
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'action', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'bloodType', in: 'query', required: false, schema: { $ref: '#/components/schemas/BloodType' } },
          { name: 'performedByUserId', in: 'query', required: false, schema: { type: 'string', minLength: 12, maxLength: 12 } },
          { name: 'from', in: 'query', required: false, schema: { type: 'string', format: 'date-time' } },
          { name: 'to', in: 'query', required: false, schema: { type: 'string', format: 'date-time' } },
        ],
        responses: { 200: { description: 'Logs recuperados', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/reports/stock-summary': {
      get: {
        tags: ['Reports'],
        servers: dualVersionServers,
        summary: 'Reporte de stock de sangre',
        security: bearerAuth,
        parameters: [
          { name: 'bloodType', in: 'query', required: false, schema: { $ref: '#/components/schemas/BloodType' } },
          { name: 'includeBags', in: 'query', required: false, schema: { type: 'boolean' } },
        ],
        responses: { 200: { description: 'Reporte generado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/reports/my-stats': {
      get: {
        tags: ['Reports'],
        servers: dualVersionServers,
        summary: 'Reporte personal del usuario autenticado',
        security: bearerAuth,
        responses: { 200: { description: 'Estadisticas personales', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/wallet/{userId}': {
      get: {
        tags: ['Wallet'],
        servers: dualVersionServers,
        summary: 'Consultar wallet de incentivos por usuario',
        security: bearerAuth,
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', minLength: 12, maxLength: 12 } }],
        responses: { 200: { description: 'Wallet recuperada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/rewards': {
      get: {
        tags: ['Rewards'],
        servers: dualVersionServers,
        summary: 'Listar recompensas',
        security: bearerAuth,
        responses: { 200: { description: 'Recompensas recuperadas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
      post: {
        tags: ['Rewards'],
        servers: dualVersionServers,
        summary: 'Crear recompensa',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateRewardRequest' } },
          },
        },
        responses: { 201: { description: 'Recompensa creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/rewards/{rewardId}': {
      get: {
        tags: ['Rewards'],
        servers: dualVersionServers,
        summary: 'Obtener recompensa por id',
        security: bearerAuth,
        parameters: [{ name: 'rewardId', in: 'path', required: true, schema: { type: 'string', minLength: 12, maxLength: 12 } }],
        responses: { 200: { description: 'Recompensa encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
      patch: {
        tags: ['Rewards'],
        servers: dualVersionServers,
        summary: 'Actualizar recompensa',
        security: bearerAuth,
        parameters: [{ name: 'rewardId', in: 'path', required: true, schema: { type: 'string', minLength: 12, maxLength: 12 } }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateRewardRequest' } },
          },
        },
        responses: { 200: { description: 'Recompensa actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
      delete: {
        tags: ['Rewards'],
        servers: dualVersionServers,
        summary: 'Eliminar recompensa',
        security: bearerAuth,
        parameters: [{ name: 'rewardId', in: 'path', required: true, schema: { type: 'string', minLength: 12, maxLength: 12 } }],
        responses: { 200: { description: 'Recompensa eliminada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/rewards/redeem': {
      post: {
        tags: ['Rewards'],
        servers: dualVersionServers,
        summary: 'Canjear recompensa',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RedeemRewardRequest' } },
          },
        },
        responses: { 200: { description: 'Canje realizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check del servicio',
        responses: { 200: { description: 'Servicio disponible', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
      },
    },
  },
};

export const setupSwagger = (app) => {
  app.get('/api-docs.json', (req, res) => {
    res.status(200).json(openApiSpec);
  });

  app.get('/swagger.json', (req, res) => {
    res.status(200).json(openApiSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    explorer: true,
    customSiteTitle: 'BloodLink API Docs',
  }));

  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    explorer: true,
    customSiteTitle: 'BloodLink API Docs',
  }));
};
