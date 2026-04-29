# BloodLink PostgreSQL Microservice

Microservicio independiente responsable de:
- Autenticación y autorización (Auth)
- Gestión de usuarios (Users)
- Gestión de roles (Roles)
- Sistema de incentivos (Incentives)
- Sistema de recompensas (Rewards)
- API interna para consultas desde MongoDB Service

## Configuración

### Requisitos previos
- Node.js 18+
- PostgreSQL en `localhost:5432`
- pnpm 10.29.2+

### Instalación

1. Verifica y actualiza el archivo `.env` del microservicio PostgreSQL.

2. Configura PostgreSQL con las credenciales en `.env`:
```sql
CREATE DATABASE bloodlink_db;
CREATE USER bloodlink_user WITH PASSWORD 'bloodlink_password';
GRANT ALL PRIVILEGES ON DATABASE bloodlink_db TO bloodlink_user;
```

3. Instala las dependencias:
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

Configurar en `potgre/.env`:

```env
NODE_ENV = development
PORT = 3007

MONGODB_URI=mongodb://localhost:27017/bloodlink

DB_HOST=localhost
DB_PORT=5435
DB_NAME=bloodlink
DB_USERNAME=root
DB_PASSWORD=admin
DB_SQL_LOGGING=false

JWT_SECRET=MyVerySecretKeyForJWTTokenAuthenticationWith256Bits!
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=BloodLinkAuthService
JWT_AUDIENCE=BloodLinkApp

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_ENABLE_SSL=true
SMTP_USERNAME=kinalsports@gmail.com
SMTP_PASSWORD=yrsd prvf kwat toee
EMAIL_FROM=kinalsports@gmail.com
EMAIL_FROM_NAME=AuthDotnet App

VERIFICATION_EMAIL_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1

CLOUDINARY_CLOUD_NAME=dhdpzo5sq
CLOUDINARY_API_KEY=275242198188765
CLOUDINARY_API_SECRET=CQq9UtvqXFesUmr3Ukp0sTuNIqk
CLOUDINARY_BASE_URL=https://res.cloudinary.com/dhdpzo5sq/image/upload/
CLOUDINARY_FOLDER=bloodlink/profiles
CLOUDINARY_DEFAULT_AVATAR_FILENAME=default-avatar_ewzxwx.png

OPENAI_API_KEY=

# Admin Seed (creación automática de admin)
SEED_ADMIN_ON_STARTUP=true
SEED_ADMIN_EMAIL=admin@bloodlink.local
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=Admin1234
SEED_ADMIN_NAME=Admin
SEED_ADMIN_SURNAME=Root
SEED_ADMIN_PHONE=12345678
```

## Rutas Disponibles

### Públicas
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/refresh` - Renovar token

### Protegidas (requieren JWT)
- `GET/PUT /api/users` - Gestión de usuarios
- `GET/POST /api/incentives` - Gestión de incentivos
- `GET/POST /api/rewards` - Gestión de recompensas
- `GET /api/wallet` - Billetera de puntos

### Internas (solo desde MongoDB Service)
- `GET /internal/users/:id` - Datos de usuario
- `GET /internal/wallets/:userId` - Billetera de usuario
- `POST /internal/incentives/award-donation` - Otorgar puntos por donación

## Swagger API Documentation

Accede a la documentación completa en:
```
http://localhost:3007/api/docs
```

La documentación incluye endpoints de ambos servicios (MongoDB y PostgreSQL) con tags diferenciados.

## Comunicación entre Servicios

Este servicio expone API interna en `/internal/*` para que MongoDB Service pueda:
- Obtener datos de usuarios
- Verificar billeteras
- Otorgar incentivos por donaciones

MongoDB Service comunica mediante `POSTGRES_SERVICE_URL` definido en su `.env`.
