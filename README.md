# BloodLink - Sistema de Gestión de Donación de Sangre

Proyecto Node.js con Express, MongoDB y PostgreSQL para gestionar donaciones de sangre.

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
   SMTP_PORT=587
   SMTP_ENABLE_SSL=true
   SMTP_USERNAME=kinalsports@gmail.com
   SMTP_PASSWORD=yrsd prvf kwat toee
   EMAIL_FROM=kinalsports@gmail.com
   EMAIL_FROM_NAME=AuthDotnet App

   VERIFICATION_EMAIL_EXPIRY_HOURS=24
   PASSWORD_RESET_EXPIRY_HOURS=1

   CLOUDINARY_CLOUD_NAME=dut08rmaz
   CLOUDINARY_API_KEY=279612751725163
   CLOUDINARY_API_SECRET=UxGMRqU1iB580Kxb2AlDR4n4hu0
   CLOUDINARY_BASE_URL=https://res.cloudinary.com/dut08rmaz/image/upload/
   CLOUDINARY_FOLDER=gastroflow/profiles
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

## APIs

### Health Check
```
GET /api/health
```

### Usuarios
```
GET /api/auth/register      # Registrar usuario
POST /api/auth/login        # Iniciar sesión
GET /api/users              # Obtener usuarios
GET /api/users/:id          # Obtener usuario por ID
```

## Bases de Datos

- **MongoDB**: Para donaciones e historial
- **PostgreSQL**: Para usuarios y autenticación

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
