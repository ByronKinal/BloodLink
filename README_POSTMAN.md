# BloodLink - Guía de Pruebas en Postman (Copy/Paste)

Este documento está hecho para usar URL completa sin `{{base_url}}`.

Nota: los endpoints protegidos aceptan JWT en:
- `Authorization: Bearer <token>`
- o `x-token: <token>`

## 1) Levantar API

```bash
pnpm dev
```

El endpoint `POST /api/v1/ai/ask` funciona con un bot local basado en reglas, por lo que no requiere API key de OpenAI.

## 2) JSON con TODAS las URLs (copia y pega)

```json
{
  "health": "http://localhost:3006/api/v1/health",
  "login": "http://localhost:3006/api/v1/auth/login",
  "register": "http://localhost:3006/api/v1/auth/register",
  "refreshToken": "http://localhost:3006/api/v1/auth/refresh-token",
  "logout": "http://localhost:3006/api/v1/auth/logout",
  "verifyEmail": "http://localhost:3006/api/v1/auth/verify-email",
  "resendVerification": "http://localhost:3006/api/v1/auth/resend-verification",
  "forgotPassword": "http://localhost:3006/api/v1/auth/forgot-password",
  "resetPassword": "http://localhost:3006/api/v1/auth/reset-password",
  "usersAllowedRoles": "http://localhost:3006/api/v1/users/allowed-roles",
  "changeUserRole": "http://localhost:3006/api/v1/users/{userId}/role",
  "getUserRoles": "http://localhost:3006/api/v1/users/{userId}/roles",
  "getUsersByRole": "http://localhost:3006/api/v1/users/by-role/{roleName}",
  "profilesCreate": "http://localhost:3006/api/v1/profiles",
  "profilesMe": "http://localhost:3006/api/v1/profiles/me",
  "profilesByUserId": "http://localhost:3006/api/v1/profiles/user/{userId}",
  "appointmentsCreate": "http://localhost:3006/api/v1/appointments",
  "appointmentsStaffAgenda": "http://localhost:3006/api/v1/appointments/staff?date=2026-03-20",
  "appointmentsConfirm": "http://localhost:3006/api/v1/appointments/{appointmentId}/confirm",
  "appointmentsCreateLegacyAlias": "http://localhost:3006/appointments",
  "appointmentsStaffAgendaLegacyAlias": "http://localhost:3006/appointments/staff?date=2026-03-20",
  "appointmentsConfirmLegacyAlias": "http://localhost:3006/appointments/{appointmentId}/confirm",
  "triageCreate": "http://localhost:3006/api/v1/triage",
  "triageList": "http://localhost:3006/api/v1/triage",
  "triageCreateLegacyAlias": "http://localhost:3006/triage",
  "triageListLegacyAlias": "http://localhost:3006/triage",
  "iotWeight": "http://localhost:3006/api/v1/iot/weight",
  "iotWeightLegacyAlias": "http://localhost:3006/iot/weight",
  "aiAsk": "http://localhost:3006/api/v1/ai/ask",
  "aiAskLegacyAlias": "http://localhost:3006/ai/ask"
}
```

## 2.1) Inventario completo por modulo (metodo + URL)

### Health
- `GET http://localhost:3006/api/v1/health`

### Auth
- `POST http://localhost:3006/api/v1/auth/register`
- `POST http://localhost:3006/api/v1/auth/login`
- `POST http://localhost:3006/api/v1/auth/refresh-token`
- `POST http://localhost:3006/api/v1/auth/logout`
- `POST http://localhost:3006/api/v1/auth/verify-email`
- `POST http://localhost:3006/api/v1/auth/resend-verification`
- `POST http://localhost:3006/api/v1/auth/forgot-password`
- `POST http://localhost:3006/api/v1/auth/reset-password`

### Users / Roles
- `GET http://localhost:3006/api/v1/users/allowed-roles`
- `PUT http://localhost:3006/api/v1/users/{userId}/role`
- `GET http://localhost:3006/api/v1/users/{userId}/roles`
- `GET http://localhost:3006/api/v1/users/by-role/{roleName}`

### Profiles
- `POST http://localhost:3006/api/v1/profiles`
- `GET http://localhost:3006/api/v1/profiles/me`
- `GET http://localhost:3006/api/v1/profiles/user/{userId}`

### AI
- `POST http://localhost:3006/api/v1/ai/ask`
- `POST http://localhost:3006/ai/ask` (alias legacy)

### Appointments
- `POST http://localhost:3006/api/v1/appointments`
- `GET http://localhost:3006/api/v1/appointments/staff?date=2026-03-20`
- `PATCH http://localhost:3006/api/v1/appointments/{appointmentId}/confirm`

Alias legacy habilitado en backend (tambien funciona):
- `POST http://localhost:3006/appointments`
- `GET http://localhost:3006/appointments/staff?date=2026-03-20`
- `PATCH http://localhost:3006/appointments/{appointmentId}/confirm`

### Triage
- `POST http://localhost:3006/api/v1/triage`
- `GET http://localhost:3006/api/v1/triage`
- `POST http://localhost:3006/triage` (alias legacy)
- `GET http://localhost:3006/triage` (alias legacy)

### IoT
- `POST http://localhost:3006/api/v1/iot/weight`
- `POST http://localhost:3006/iot/weight` (alias legacy)

## 3) Variables recomendadas en Postman (solo tokens/ids)

No uses `base_url`, solo estas variables:

- `admin_token`
- `donor_token`
- `staff_token`
- `refresh_token`
- `donor_user_id`
- `staff_user_id`
- `appointment_id`
- `triage_form_id`

## 4) Requests listas para copiar y pegar

---

## 4.1 Health Check

**GET** `http://localhost:3006/api/v1/health`

---

## 4.2 Login Admin (usuario seed)

**POST** `http://localhost:3006/api/v1/auth/login`


Body (raw JSON):
```json
{
  "emailOrUsername": "admin@bloodlink.local",
  "password": "Admin1234"
}
```


## 4.3 Registrar usuario DONOR

**POST** `http://localhost:3006/api/v1/auth/register`


Body (raw JSON):
```json
{
  "name": "Donor",
  "surname": "One",
  "username": "donor1",
  "email": "donor1@bloodlink.local",
  "password": "Donor1234",
  "phone": "12345678",
  "bloodType": "O+",
  "zone": "Zona 1",
  "municipality": "Guatemala"
}
```

---

## 4.4 Verificar email DONOR

Puedes verificar con `token` o con `email + activationCode`.

**POST** `http://localhost:3006/api/v1/auth/verify-email`


Body (raw JSON):
```json
{
  "email": "donor1@bloodlink.local",
  "activationCode": "123456"
}
```

## 4.5 Login DONOR

**POST** `http://localhost:3006/api/v1/auth/login`


Body (raw JSON):
```json
{
  "emailOrUsername": "donor1@bloodlink.local",
  "password": "Donor1234"
}
```


## 4.6 Registrar usuario STAFF

**POST** `http://localhost:3006/api/v1/auth/register`


Body (raw JSON):
```json
{
  "name": "Staff",
  "surname": "One",
  "username": "staff1",
  "email": "staff1@bloodlink.local",
  "password": "Staff1234",
  "phone": "87654321",
  "bloodType": "A+",
  "zone": "Zona 10",
  "municipality": "Guatemala"
}
```

---

## 4.7 Verificar email STAFF

**POST** `http://localhost:3006/api/v1/auth/verify-email`


Body (raw JSON):
```json
{
  "email": "staff1@bloodlink.local",
  "activationCode": "123456"
}
```

---

## 4.8 Login STAFF

**POST** `http://localhost:3006/api/v1/auth/login`

Body (raw JSON):
```json
{
  "emailOrUsername": "staff1@bloodlink.local",
  "password": "Staff1234"
}
```


## 4.9 Cambiar rol del STAFF a STAFF_ROLE (admin)

**PUT** `http://localhost:3006/api/v1/users/{{staff_user_id}}/role`

```json
{
  "roleName": "STAFF_ROLE"
}
```

---

## 4.10 Crear cita (DONOR)

**POST** `http://localhost:3006/api/v1/appointments`

Headers:
- `Authorization: Bearer {{donor_token}}`

Body (raw JSON):
```json
{
  "date": "2026-03-20",
  "time": "09:30"
}
```


## 4.11 Ver agenda del día (STAFF_ROLE o ADMIN_ROLE)

**GET** `http://localhost:3006/api/v1/appointments/staff?date=2026-03-20`

Headers:
- `Authorization: Bearer {{staff_token}}`

---

## 4.12 Confirmar cita (STAFF_ROLE o ADMIN_ROLE)

**PATCH** `http://localhost:3006/api/v1/appointments/{{appointment_id}}/confirm`

Body (raw JSON):
```json
{
  "staffUserId": "{{staff_user_id}}"
}
```

---

## 4.13 Crear triaje (DONOR)

**POST** `http://localhost:3006/api/v1/triage`


Body (raw JSON):
```json
{
  "ageYears": 25,
  "weightKg": 68,
  "pulseBpm": 76,
  "systolicMmHg": 118,
  "diastolicMmHg": 78,
  "temperatureC": 36.7,
  "hemoglobinGdl": 13.8,
  "hasFever": false,
  "hasInfectionSymptoms": false,
  "hasChronicDisease": false,
  "chronicDiseaseControlled": true,
  "consumedAlcoholLast24h": false,
  "tookAntibioticsLast7d": false,
  "pregnantOrBreastfeeding": false,
  "hadTattooOrPiercing": true,
  "lastTattooOrPiercingDate": "2025-10-01",
  "hadRecentSurgery": false,
  "lastDonationDate": "2025-12-01"
}
```

Notas:
- Si envías otro formulario antes de 24h, responde `429`.
- El resultado viene en `data.evaluation.result` con valor `APTO` o `NO APTO`.

---

## 4.14 Listar formularios de triaje

**GET** `http://localhost:3006/api/v1/triage`


Opcional por cuenta:
- `GET http://localhost:3006/api/v1/triage?accountId={{donor_user_id}}`

---

## 4.15 Registrar donación (IoT simulado)

**POST** `http://localhost:3006/api/v1/iot/weight`


Body (raw JSON):
```json
{
  "appointmentId": "{{appointment_id}}",
  "weightGrams": 470,
  "deviceId": "SCALE-01",
  "notes": "Extraccion sin incidencias"
}
```

Reglas importantes:
- Solo `ADMIN_ROLE` y `STAFF_ROLE` pueden usar este endpoint.
- Si el donador está `NO APTO` en su último triaje, no permite registrar donación.
- La cita debe existir y estar confirmada.
- El máximo permitido por extracción es `600 ml`.
- `donationDate` se asigna automáticamente por backend.

---

## 4.16 Chatbot (donaciones, gratis)

**POST** `http://localhost:3006/api/v1/ai/ask`


Body (raw JSON):
```json
{
  "question": "Si estuve enfermo hace dos días, ¿puedo donar sangre?"
}
```