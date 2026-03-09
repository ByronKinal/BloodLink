# BloodLink - Manual de Usuario

## Descripción General

**BloodLink** es una plataforma integral de gestión de donaciones de sangre que conecta donantes, personal médico y administradores en un sistema centralizado. Permite registrar donaciones, gestionar inventarios de sangre, evaluar a donantes y consultar información médica de manera segura.

---

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Autenticación](#autenticación)
4. [Guía de Uso por Rol](#guía-de-uso-por-rol)
5. [Endpoints Principales](#endpoints-principales)
6. [Documentación API](#documentación-api)
7. [Asistente de IA para Donaciones](#asistente-de-ia-para-donaciones)
8. [Solución de Problemas](#solución-de-problemas)

---

## Requisitos Previos

- **Node.js** v18 o superior
- **PostgreSQL** 16+
- **MongoDB** (opcional, para perfiles avanzados)
- **Docker** y **Docker Compose** (recomendado)
- **PNPM** como gestor de paquetes

---

## Instalación y Configuración

### 1. Clonar Repositorio

```bash
git clone https://github.com/tuusuario/BloodLink.git
cd BloodLink
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Copia el archivo `.env.example` (si existe) o crea un `.env` en la raíz:

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
```

### 4. Iniciar Servicios de Base de Datos

```bash
docker-compose up -d
```

Esto inicia:
- **PostgreSQL** en puerto `5435`
- **Volumen persistente** para datos

### 5. Iniciar el Servidor

```bash
# Modo desarrollo (con reinicio automático)
pnpm run dev

# Modo producción
pnpm start

# Modo con watch
pnpm run watch
```

El servidor estará disponible en `http://localhost:3006`

---

## Autenticación

### 1. Login (Obtener Token)

**Endpoint:** `POST /api/v1/auth/login`

**Body:**
```json
{
  "emailOrUsername": "admin",
  "password": "Admin1234"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresAt": "2026-03-09T01:29:56.606Z",
    "userDetails": {
      "id": "Xxts9Y7M6anM",
      "username": "admin",
      "role": "ADMIN_ROLE"
    }
  },
  "message": "Login exitoso"
}
```

### 2. Usar Token en Requests

**Header obligatorio:**
```http
Authorization: Bearer <accessToken>
```

**Ejemplo con cURL:**
```bash
curl -X GET http://localhost:3006/api/v1/profiles/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Renovar Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Body:**
```json
{
  "refreshToken": "<refreshToken>"
}
```

---

## Guía de Uso por Rol

### ADMIN_ROLE (Administrador)

**Permisos:**
- Crear, leer, actualizar y eliminar usuarios
- Cambiar roles de usuarios
- Acceder a auditoría de sistema
- Ver reportes globales
- Gestionar inventarios
- Ver todas las donaciones

**Endpoints Principales:**
```
GET    /api/v1/users
GET    /api/v1/users/:userId
POST   /api/v1/users
PUT    /api/v1/users/:userId/role
GET    /api/v1/users/by-role/DONOR_ROLE
GET    /api/v1/audit/logs
GET    /api/v1/blood-bags
GET    /api/v1/reports
```

### DONOR_ROLE (Donante)

**Permisos:**
- Ver su propio perfil
- Consultar elegibilidad para donar
- Agendar citas de donación
- Ver un historial de donaciones
- Recibir recomendaciones de salud

**Endpoints Principales:**
```
GET    /api/v1/profiles/me
POST   /api/v1/appointments
GET    /api/v1/appointments
POST   /api/v1/ai/ask (chatbot de donaciones)
```

### STAFF_ROLE (Personal Médico)

**Permisos:**
- Registrar nuevas donaciones
- Evaluar triaje de donantes
- Actualizar estado de bolsas de sangre
- Ver citas programadas
- Consultar perfiles de donantes

**Endpoints Principales:**
```
POST   /api/v1/iot (registrar donación)
POST   /api/v1/triage
GET    /api/v1/appointments
GET    /api/v1/blood-bags
```

---

## Endpoints Principales

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login con email/username |
| POST | `/api/v1/auth/register` | Registro de nuevo usuario |
| POST | `/api/v1/auth/refresh` | Renovar token |
| POST | `/api/v1/auth/logout` | Cerrar sesión |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/users` | Listar todos los usuarios |
| GET | `/api/v1/users/:userId` | Obtener usuario por ID |
| POST | `/api/v1/users` | Crear usuario (Admin) |
| PUT | `/api/v1/users/:userId/role` | Cambiar rol de usuario |
| GET | `/api/v1/users/by-role/:roleName` | Listar usuarios por rol |

### Perfiles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/profiles/me` | Mi perfil personales |
| POST | `/api/v1/profiles` | Crear perfil complementario |
| GET | `/api/v1/profiles/user/:userId` | Obtener perfil de usuario |

### Citas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/appointments` | Listar citas |
| POST | `/api/v1/appointments` | Agendar cita |
| GET | `/api/v1/appointments/:id` | Obtener cita |
| PUT | `/api/v1/appointments/:id` | Actualizar cita |

### Donaciones (IoT/Registro)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/iot` | Registrar nueva donación |
| GET | `/api/v1/iot` | Historial de donaciones |

### Bolsas de Sangre

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/blood-bags` | Listar bolsas |
| POST | `/api/v1/blood-bags` | Crear bolsa |
| GET | `/api/v1/blood-bags/:id` | Obtener bolsa |

### Auditoría

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/audit/logs` | Ver logs de auditoría |

---

## Documentación API

### Acceder a Swagger UI

La documentación interactiva está disponible en:

```
http://localhost:3006/swagger
http://localhost:3006/api-docs
```

También puedes descargar la especificación OpenAPI en JSON:

```
http://localhost:3006/swagger.json
http://localhost:3006/api-docs.json
```

---

## Asistente de IA para Donaciones

### Consultar Chatbot

**Endpoint:** `POST /api/v1/ai/ask`

**Body:**
```json
{
  "question": "¿Puedo donar si tengo cáncer?"
}
```

**Response:**
```json
{
  "success": true,
  "inScope": true,
  "answer": "Depende del tipo de cáncer, etapa y tratamiento. Si estás en tratamiento activo (quimio, radioterapia), generalmente NO puedes donar. En remisión o post-tratamiento, requiere evaluación médica..."
}
```

### Temas Soportados

El asistente puede responder sobre:
- ✅ Requisitos de donación
- ✅ Enfermedades infecciosas (ETS, hepatitis, VIH, tuberculosis)
- ✅ Condiciones de salud (diabetes, hipertensión, asma, cancer)
- ✅ Medicamentos y antibióticos
- ✅ Cirugías y procedimientos dentales
- ✅ Embarazo y lactancia
- ✅ Tatuajes y perforaciones
- ✅ Proceso de donación

---

## Solución de Problemas

### "Perfil no encontrado" en `/profiles/me`

**Causa:** El usuario existe en PostgreSQL pero no tiene perfil en MongoDB.

**Solución:**
```bash
POST /api/v1/profiles
Body: {
  "userId": "tu-id",
  "email": "tu-email@example.com",
  "password": "password123",
  "roleName": "DONOR_ROLE"
}
```

### "No hay token en la petición"

**Causa:** Falta el header `Authorization`.

**Solución:** Incluye el header en tu request:
```http
Authorization: Bearer <accessToken>
```

### "Token expirado"

**Causa:** El access token tiene validez limitada (30 minutos por defecto).

**Solución:** Usa el refresh token para obtener uno nuevo:
```bash
POST /api/v1/auth/refresh
Body: {
  "refreshToken": "<refreshToken>"
}
```

### "Cuenta desactivada"

**Causa:** El administrador marcó la cuenta como inactiva.

**Solución:** Contacta al administrador para reactivar tu cuenta.

### Error de conexión a PostgreSQL

**Causa:** El contenedor no está corriendo o las credenciales son incorrectas.

**Solución:**
```bash
# Inicia los servicios
docker-compose up -d

# Verifica el estado
docker-compose ps

# Revisa logs
docker-compose logs postgres
```

### Error de conexión a MongoDB

**Causa:** La variable `MONGODB_URI` no está configurada correctamente.

**Solución:** Verifica en tu `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/bloodlink
```

---

## Ejemplo de Flujo Completo

### 1. Login
```bash
curl -X POST http://localhost:3006/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "admin",
    "password": "Admin1234"
  }'
```

### 2. Crear Perfil
```bash
curl -X POST http://localhost:3006/api/v1/profiles \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<userId>",
    "email": "user@example.com",
    "password": "SecurePass123",
    "roleName": "DONOR_ROLE",
    "donorData": {
      "bloodType": "O+"
    }
  }'
```

### 3. Consultar Perfil
```bash
curl -X GET http://localhost:3006/api/v1/profiles/me \
  -H "Authorization: Bearer <accessToken>"
```

### 4. Preguntar al Asistente
```bash
curl -X POST http://localhost:3006/api/v1/ai/ask \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "¿Puedo donar si tomo metformina?"
  }'
```

---

## Soporte

Para reportar problemas o sugerencias:
- Abre un **issue** en GitHub
- Contacta al equipo de desarrollo

---

**Última actualización:** 8 de marzo de 2026  
**Versión:** 1.0.0
