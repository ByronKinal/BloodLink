# BloodLink — Formato de Trabajo del Equipo

Este documento es la referencia obligatoria de arquitectura, nomenclatura y flujo de trabajo para todo el ecosistema BloodLink (backend `potgre` / `mongo`, frontend `ms-react`, app `ms-android`). Debe seguirse en cada tarea, sin excepciones salvo acuerdo explícito del equipo.

## 1. Arquitecturas oficiales

**Frontend (React / React Native) — Feature-Sliced Design (FSD)**
Organización por módulo de negocio (`features/inventory`, `features/triage`, `features/auth`...). Cada módulo es independiente y autocontenido: sus propios componentes, hooks y estado.
- `shared/` es exclusivo para lo reutilizable entre 2+ módulos: instancias Axios, componentes de UI comunes (modales, alertas, botones), utilidades.

**Backend (Node.js) — Layered Architecture by Domain (MRC)**
División por dominio de negocio (`users`, `blood-bags`, `appointments`...). Cada dominio se fragmenta verticalmente en:
- **Routes.js** — endpoints HTTP.
- **Controller.js** — lógica de negocio y respuestas.
- **Model.js** — persistencia y esquemas (PostgreSQL o MongoDB).
- Soporte global aislado en `/middlewares` y `/configs` en la raíz.

## 2. Estructura de directorios y archivos

- **Carpetas**: inglés, minúsculas, kebab-case. Ej: `features/blood-inventory`, `shared/api`, `middlewares`.
- **Archivos de código** (`.js`, `.jsx`): UpperCamelCase estricto. Ej: `App.jsx`, `LoginForm.jsx`, `UserController.js`, `BloodBagModel.js`, `AppointmentRoutes.js`.
  - Excepción de facto observada en `ms-android`: archivos de `api/` (`auth.api.js`), `hooks/` (`useAuth.js`) y `store/` (`authStore.js`) usan camelCase, no UpperCamelCase. Los hooks deben mantenerse en camelCase con prefijo `use` (requisito de React/eslint-plugin-react-hooks para detectarlos como hooks); confirmar con el equipo si `api/`/`store/` deben migrar a UpperCamelCase o si la excepción queda formalizada.

## 3. Nomenclatura en código (camelCase, inglés)

- **Variables**: camelCase. `const currentUser = {}`, `let isEligible = false`.
- **Funciones/métodos**: camelCase, deben iniciar con verbo infinitivo: `get`, `set`, `fetch`, `handle`, `validate`, `is`, `has`. Ej: `validateDonorBloodType()`, `handleAppointmentSubmit()`.
- **Constantes globales**: UPPER_SNAKE_CASE. Ej: `const POSTGRES_API_URL = 'http://localhost:3007'`.

## 4. Estilos

Tailwind CSS es el framework oficial. Utilidades directamente en `className`; evitar CSS-in-file o inline salvo estricta necesidad.

## 5. Commits (Conventional Commits)

Minúsculas, empiezan con prefijo:
`feat:` nueva funcionalidad · `fix:` corrige bug · `perf:` rendimiento · `build:` compilación/despliegue · `ci:` integración continua · `docs:` documentación · `refactor:` reestructura sin cambiar comportamiento · `style:` formato puro · `test:` pruebas.

Ej: `git commit -m "feat: agregar bloqueo de 24 horas al formulario de triage"`

Convención específica de `ms-android` (más simple, subset): `feat:`, `fix:`, `chore:`, `refactor:` — minúsculas, sin tildes, una sola línea.

## 6. Flujo de trabajo / Pull Requests

- Nunca push directo a `develop` o `main`.
- Toda feature/fix termina en PR hacia `develop` para revisión del equipo.

## 7. Calidad de componentes (regla del equipo)

- Ningún `.jsx` debe superar **300 líneas** — es mala práctica; si un componente crece, se descompone en subcomponentes reutilizables.
- Priorizar componentes reutilizables sobre duplicar lógica/UI entre pantallas.

---

## ms-android — estructura específica (Expo / React Native, FSD)

```
ms-android/
  App.jsx                 → entrada, monta NavigationContainer
  app.json                → config Expo (permisos, plugins, ícono)
  .env                    → URLs de las APIs (EXPO_PUBLIC_*)
  src/
    navigation/
      AppNavigator.jsx     → Auth vs App stack según sesión
      MainTabNavigator.jsx → tabs autenticados (coordina UNA sola persona, evitar choques de merge)
    features/
      auth/ dashboard/ profile/ triage/ appointments/ rewards/ assistant/
        api/      → llamadas HTTP (usan postgresApi/mongoApi de shared/api/api.js)
        hooks/    → conecta api/ + store/, maneja useState/useEffect de carga y error
        screens/  → solo UI, llama al hook, nunca Axios directo
        store/    → solo si el módulo necesita estado compartido (Zustand)
    shared/
      api/api.js           → clientes Axios (Postgres/Mongo) con interceptor JWT
      components/          → UI reutilizada por 2+ features
      utils/                → helpers genéricos
```

**Regla obligatoria por feature**: separar en `api/` / `hooks/` / `screens/` / `store/` (solo las carpetas que aplique) — la pantalla nunca llama Axios directo. Motivo documentado: la carga del saldo de wallet se duplicó entre Dashboard y Billetera por no centralizar en un hook; un cambio de endpoint obligaba a corregir en dos lados. Un solo hook reutilizado evita esto.

**`shared/components/`**: solo si lo usa más de un feature. Si es de una sola pantalla, se queda dentro del feature.
