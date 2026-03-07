# BloodLink - Guía de Pruebas en Postman (Copy/Paste)

Este documento está hecho para usar URL completa sin `{{base_url}}`.

## 1) Levantar API

```bash
pnpm dev
```

El endpoint `POST /api/v1/ai/ask` funciona con un bot local basado en reglas, por lo que no requiere API key de OpenAI.

## 2) JSON con URLs correctas (copia y pega)

```json
{
  "health": "http://localhost:3006/api/v1/health",
  "login": "http://localhost:3006/api/v1/auth/login",
  "register": "http://localhost:3006/api/v1/auth/register",
  "verifyEmail": "http://localhost:3006/api/v1/auth/verify-email",
  "changeUserRole": "http://localhost:3006/api/v1/users/{userId}/role",
  "appointmentsCreate": "http://localhost:3006/appointments",
  "appointmentsStaffAgenda": "http://localhost:3006/appointments/staff?date=2026-03-20",
  "appointmentsConfirm": "http://localhost:3006/appointments/{appointmentId}/confirm",
  "aiAsk": "http://localhost:3006/api/v1/ai/ask"
}
```

## 3) Variables recomendadas en Postman (solo tokens/ids)

No uses `base_url`, solo estas variables:

- `admin_token`
- `donor_token`
- `staff_token`
- `refresh_token`
- `donor_user_id`
- `staff_user_id`
- `appointment_id`

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

Headers:
- `Content-Type: application/json`

Body (raw JSON):
```json
{
  "name": "Donor",
  "surname": "One",
  "username": "donor1",
  "email": "donor1@bloodlink.local",
  "password": "Donor1234",
  "phone": "12345678"
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

## 4.5 Login 

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
  "phone": "87654321"
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

Body (raw JSON):
```json
{
  "roleName": "STAFF_ROLE"
}
```

---

## 4.10 Crear cita (DONOR)

**POST** `http://localhost:3006/appointments`


Body (raw JSON):
```json
{
  "date": "2026-03-20",
  "time": "09:30"
}
```


## 4.11 Ver agenda del día (STAFF_ROLE o ADMIN_ROLE)

**GET** `http://localhost:3006/appointments/staff?date=2026-03-20`

Headers:
- `Authorization: Bearer {{staff_token}}`

---

## 4.12 Confirmar cita (STAFF_ROLE o ADMIN_ROLE)

**PATCH** `http://localhost:3006/appointments/{{appointment_id}}/confirm`


Body (raw JSON):
```json
{
  "staffUserId": "{{staff_user_id}}"
}
```

---

## 4.13 Chatbot (donaciones, gratis)

**POST** `http://localhost:3006/api/v1/ai/ask`


Body (raw JSON):
```json
{
  "question": "Si estuve enfermo hace dos días, ¿puedo donar sangre?"
}
```