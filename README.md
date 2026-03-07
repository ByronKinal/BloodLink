# BloodLink - Sistema de Gestión de Donación de Sangre

Proyecto Node.js con Express, MongoDB y PostgreSQL para gestionar donaciones de sangre.

## Guía rápida Postman

Para pruebas completas listas para copiar y pegar, revisa:

- [README_POSTMAN.md](README_POSTMAN.md)

La guía usa URLs completas (`http://localhost:3006/...`) sin `{{base_url}}`.

## Requisitos

- Node.js v18 o superior
- pnpm (recomendado) o npm
- Docker y Docker Compose (para ejecutar con Docker)

## Instalación

### Opción 1: Desarrollo Local

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd BloodLink
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno** - Crear `.env` en la raíz con el siguiente contenido:
   ```bash
NODE_ENV = development
PORT = 3006

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
   ```

4. **Iniciar servidor**
   ```bash
   pnpm start         # Producción
   pnpm dev           # Desarrollo con nodemon
   ```

### Opción 2: Con Docker Compose

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd BloodLink
   ```

2. **Crear archivo .env** (usar el contenido anterior)

3. **Iniciar con Docker**
   ```bash
   docker-compose up -d
   ```

4. **Parar contenedores**
   ```bash
   docker-compose down
   ```

## Estructura del Proyecto

```
BloodLink/
├── configs/                 # Configuración del servidor
│   ├── config.js           # Configuración general
│   ├── mongodb.js          # Conexión MongoDB
│   └── postgresql.js       # Conexión PostgreSQL
├── helper/                 # Funciones auxiliares
├── middlewares/            # Middlewares (autenticación, validación)
├── seeders/                # Scripts de base de datos
│   └── schema.sql          # Esquema de PostgreSQL
├── src/
│   ├── User/               # Módulo de usuarios
│   │   ├── User.model.js
│   │   ├── user.controller.js
│   │   ├── user.routes.js
│   │   ├── auth.controller.js
│   │   └── auth.routes.js
│   └── routes/
│       ├── health.js       # Health check
│       └── index.js        # Agregador de rutas
├── utils/                  # Utilidades
├── index.js                # Punto de entrada
├── package.json
├── .env                    # Variables de entorno
├── docker-compose.yml      # Configuración Docker
└── README.md
```

## Variables de Entorno

Todas las variables están configuradas en el archivo `.env`. Las credenciales compartidas en este README son para desarrollo local.

Variables recomendadas para el nuevo flujo de autenticación:

```bash
FRONTEND_URL=http://localhost:3000

SEED_ADMIN_ON_STARTUP=true
SEED_ADMIN_NAME=Admin
SEED_ADMIN_SURNAME=Root
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_EMAIL=admin@bloodlink.local
SEED_ADMIN_PASSWORD=Admin1234
SEED_ADMIN_PHONE=12345678
```

Si no defines `SEED_ADMIN_*`, en la primera ejecución se crea automáticamente un admin por defecto (solo si no existe otro admin):

- Email: `admin@bloodlink.local`
- Username: `admin`
- Password: `Admin1234`

Puedes desactivar este comportamiento con `SEED_ADMIN_ON_STARTUP=false`.

## APIs

### Health Check
```
GET /api/v1/health
```

### Autenticación (PostgreSQL)
```
POST /api/v1/auth/register             # Registro (bcryptjs + envío de código/token)
POST /api/v1/auth/login                # Login (Access Token + Refresh Token)
POST /api/v1/auth/refresh-token        # Renovar Access Token con Refresh Token
POST /api/v1/auth/logout               # Revocar Refresh Token actual
POST /api/v1/auth/verify-email         # Activar cuenta con token o email + activationCode
POST /api/v1/auth/resend-verification  # Reenviar código/token de activación
POST /api/v1/auth/forgot-password      # Solicitar recuperación de contraseña
POST /api/v1/auth/reset-password       # Restablecer contraseña con token
```

### Usuarios y roles
```
GET /api/v1/users/allowed-roles        # Lista de roles válidos
PUT /api/v1/users/:userId/role         # Cambiar rol (solo ADMIN_ROLE)
GET /api/v1/users/:userId/roles        # Consultar roles de usuario
GET /api/v1/users/by-role/:roleName    # Listar usuarios por rol (solo ADMIN_ROLE)
```

### Chatbot donaciones (bot local gratis)
```
POST /api/v1/ai/ask                    # Consultar dudas médicas orientativas sobre donación
```

Body JSON:
```json
{
   "question": "Si estuve enfermo hace dos días, ¿puedo donar sangre?"
}
```

Notas:
- Solo responde temas relacionados con donación de sangre.
- Si la pregunta no es de donación, responde que no es apto para contestar fuera de ese contexto.
- No requiere API key de OpenAI ni servicios de pago.

### Gestión de citas
```
POST /appointments                      # Crear cita (requiere token de donante)
GET /appointments/staff                # Ver agenda del día (STAFF_ROLE o ADMIN_ROLE)
PATCH /appointments/:appointmentId/confirm # Confirmar cita (STAFF_ROLE o ADMIN_ROLE)
```

`appointmentId` es un ObjectId de MongoDB.

Body para crear cita:
```json
{
   "date": "2026-03-10",
   "time": "09:30"
}
```

Body para confirmar cita:
```json
{
   "staffUserId": "ID_DEL_USUARIO_STAFF"
}
```

Notas de lógica:
- Al crear cita, valida que sea fecha/hora futura y que el horario esté disponible.
- Las citas se almacenan en MongoDB (colección `appointments`).
- Confirmar cita pone `status = true` y asigna usuario con `STAFF_ROLE`.
- Si el staff enviado ya está ocupado en esa misma hora, se reasigna automáticamente a otro `STAFF_ROLE` disponible.

## Bases de Datos

- **PostgreSQL**: Usuarios, autenticación, roles y tokens

## Tecnologías

- Express.js 5.2.1
- Mongoose 9.2.1
- PostgreSQL (pg)
- JWT para autenticación
- Bcryptjs para encriptación de contraseñas
- Multer para subida de archivos
- Cloudinary para almacenamiento de imágenes
- Morgan para logging
- Helmet para seguridad

## Desarrollo

El proyecto usa `pnpm` como package manager y `nodemon` para desarrollo automático.

```bash
pnpm dev    # Inicia servidor en modo desarrollo con hot reload
```

## Licencia

ISC

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # El archivo ya tiene la configuración para Docker
   ```

3. **Iniciar con Docker**
   ```bash
   docker-compose up -d      # En background
   docker-compose up         # En foreground (ver logs)
   ```

4. **Ver logs**
   ```bash
   docker-compose logs -f
   ```

5. **Detener servicios**
   ```bash
   docker-compose down
   ```

6. **Eliminar volúmenes** (limpiar base de datos)
   ```bash
   docker-compose down -v
   ```

## Estructura del Proyecto

```
src/
├── server.js              # Punto de entrada
├── config/
│   ├── mongodb.js        # Conexión a MongoDB
│   └── postgresql.js     # Conexión a PostgreSQL
├── models/
│   └── User.js          # Modelo de usuario (MongoDB)
├── routes/
│   ├── users.js         # Rutas de usuarios
│   └── health.js        # Health check
├── controllers/          # Controladores (a llenar)
├── middleware/          # Middlewares (a llenar)
└── database/
    └── schema.sql       # Esquema de PostgreSQL
```

## Endpoints Disponibles

- `GET /api/health` - Health check
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear nuevo usuario

## Variables de Entorno

Ver `.env.example` para la lista completa de variables necesarias.

## Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Crear controladores para donaciones
- [ ] Implementar validaciones
- [ ] Agregar tests
- [ ] Documentar con Swagger
