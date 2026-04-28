# BloodLink MongoDB Microservice

Microservicio independiente responsable de:
- Citas médicas (Appointments)
- Triajes (Triage)
- Bolsas de sangre (Blood Bags)
- Donaciones IoT (IoT)
- Auditoría (Audit)
- Reportes (Reports)
- Asistente de IA (AI)

## Configuración

### Requisitos previos
- Node.js 18+
- MongoDB local en `mongodb://localhost:27017/bloodlink`
- PostgreSQL Service ejecutándose en `http://localhost:3007`
- pnpm 10.29.2+

### Instalación

1. Verifica y actualiza el archivo `.env` del microservicio MongoDB.

2. Instala las dependencias:
```bash
pnpm install
```

## Ejecución

### Modo desarrollo (con hot-reload):
```bash
pnpm dev
```

### Modo producción:
```bash
pnpm start
```

## Variables de Entorno

Configurar en `mongo/.env`:

```env
NODE_ENV=development
PORT=3006

# Base de datos PostgreSQL
MONGODB_URI=mongodb://localhost:27017/bloodlink
DB_HOST=localhost
DB_PORT=5435
DB_NAME=bloodlink
DB_USERNAME=root
DB_PASSWORD=admin
DB_SQL_LOGGING=false

# JWT
JWT_SECRET=MyVerySecretKeyForJWTTokenAuthenticationWith256Bits!
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=BloodLinkAuthService
JWT_AUDIENCE=BloodLinkApp

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_ENABLE_SSL=true
SMTP_USERNAME=tu-email@gmail.com
SMTP_PASSWORD=tu-contraseña-app
EMAIL_FROM=noreply@bloodlink.com
EMAIL_FROM_NAME=BloodLink

# Cloudinary (almacenamiento de imágenes)
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
CLOUDINARY_FOLDER=bloodlink/profiles

# OpenAI (para asistente de IA)
OPENAI_API_KEY=sk-proj-...

# Admin Seed (creación automática de admin)
SEED_ADMIN_ON_STARTUP=true
SEED_ADMIN_EMAIL=admin@bloodlink.local
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=Admin1234
SEED_ADMIN_NAME=Admin
SEED_ADMIN_SURNAME=Root
SEED_ADMIN_PHONE=12345678

# Comunicación entre microservicios
POSTGRES_SERVICE_URL=http://localhost:3007
```

## Comunicación con PostgreSQL Service

Este servicio se comunica con PostgreSQL Service mediante:
- `helpers/user-db.js` - Para obtener datos de usuarios
- `helpers/role-db.js` - Para obtener roles de usuarios
- `helpers/incentive-operations.js` - Para operaciones de incentivos/puntos

Todas las llamadas van a `POSTGRES_SERVICE_URL/internal/*`

## Rutas Disponibles

- `GET/POST /api/appointments` - Gestión de citas
- `GET/POST /api/triage` - Formularios de triaje
- `GET/POST /api/blood-bags` - Inventario de sangre
- `GET/POST /api/audit` - Logs de auditoría
- `GET/POST /api/reports` - Reportes
- `GET/POST /api/ai/donation-assistant` - Asistente de IA

Para ver todas las rutas: [Swagger API Documentation en PostgreSQL Service]
