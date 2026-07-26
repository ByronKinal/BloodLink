# BloodLink - Plataforma de Gestión de Donaciones de Sangre

**BloodLink** es una plataforma de gestión de donaciones de sangre con arquitectura de microservicios.

## Arquitectura

| Servicio | Puerto | Responsabilidad |
|----------|--------|-----------------|
| **MongoDB Service** | 3006 | Citas, triajes, sangre, auditoría, reportes, IA |
| **PostgreSQL Service** | 3007 | Autenticación, usuarios, incentivos, recompensas |

---

## Requisitos

- Node.js 18+
- MongoDB (localhost:27017)
- PostgreSQL (localhost:5432)
- pnpm 10.29.2+

---

## Instalación

```bash
git clone https://github.com/tuusuario/BloodLink.git
cd BloodLink

# MongoDB service
cd mongo
pnpm install

# PostgreSQL service
cd ../potgre
pnpm install
```

## Ejecución

**MongoDB Service (Terminal 1):**
```bash
cd mongo
pnpm dev
```

**PostgreSQL Service (Terminal 2):**
```bash
cd potgre
pnpm dev
```

**Acceso:**
- Web Frontend: http://localhost:5173
- MongoDB Service: http://localhost:3006
- PostgreSQL Service: http://localhost:3007
- Swagger Docs: http://localhost:3007/api/docs

---

## Ejecución con Docker

El proyecto cuenta con un archivo `docker-compose.yml` en la raíz que orquesta todo el ecosistema (bases de datos PostgreSQL y MongoDB, microservicios backend y aplicación web frontend). Cada microservicio contiene su propio `Dockerfile` independiente para la construcción de imágenes.

```bash
# Levantar todos los servicios y bases de datos
docker compose up --build -d

# Detener los servicios
docker compose down
```

---

## Configuración de Bases de Datos

### MongoDB
Se crea automáticamente al conectar. Configurar en `mongo/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/bloodlink
POSTGRES_SERVICE_URL=http://localhost:3007
```

### PostgreSQL
Crear manualmente en `potgre/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bloodlink_db
DB_USERNAME=bloodlink_user
DB_PASSWORD=bloodlink_password
```

---

## Endpoints Principales

**Autenticación:**
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token

**Usuarios:**
- `GET /api/users` - Listar
- `GET /api/users/:id` - Obtener
- `PUT /api/users` - Actualizar

**Incentivos & Recompensas:**
- `GET /api/incentives` - Listar incentivos
- `GET /api/rewards` - Listar recompensas
- `POST /api/rewards/redeem` - Canjear

**MongoDB Service:**
- `GET/POST /api/appointments` - Citas
- `GET/POST /api/triage` - Triajes
- `GET/POST /api/blood-bags` - Sangre
- `GET /api/reports` - Reportes
- `POST /api/ai/donation-assistant` - Asistente IA

---

## Autenticación

```bash
# Login
curl -X POST http://localhost:3007/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@bloodlink.com", "password": "Password123!"}'

# Usar token en requests
curl -X GET http://localhost:3007/api/users \
  -H "Authorization: Bearer <accessToken>"
```

---

## Estructura del Proyecto

```
BloodLink/
├── mongo/              # MongoDB Microservice
│   ├── src/
│   ├── configs/
│   ├── helpers/
│   ├── middlewares/
│   ├── utils/
│   ├── package.json
│   ├── .env
│   ├── pnpm-workspace.yaml
│   └── index.js
├── potgre/             # PostgreSQL Microservice
│   ├── src/
│   ├── configs/
│   ├── helpers/
│   ├── middlewares/
│   ├── utils/
│   ├── package.json
│   ├── .env
│   ├── pnpm-workspace.yaml
│   └── index.js
└── README.md
```

---

## Variables de Entorno

Ver archivos `.env` en cada microservicio:
- `mongo/.env` - Configuración MongoDB Service
- `potgre/.env` - Configuración PostgreSQL Service

---

## Documentación Adicional

- Ver `mongo/README.md` para detalles del MongoDB Service
- Ver `potgre/README.md` para detalles del PostgreSQL Service

---

**Versión:** 1.0.0 | **Última actualización:** 28 de abril de 2026
