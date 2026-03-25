# API Documentation – SAESPRO Backend

Base URL: `http://localhost:5000/api`

All protected routes require the `Authorization: Bearer <token>` header.

---

## Authentication

### POST /auth/register
Register a new user.

**Body:**
```json
{ "email": "user@example.com", "password": "secret123", "name": "Juan García" }
```

**Response 201:**
```json
{ "message": "Usuario registrado exitosamente", "user": { "id": 1, "email": "user@example.com", "name": "Juan García" } }
```

---

### POST /auth/login
Authenticate and obtain a JWT token.

**Body:**
```json
{ "email": "user@example.com", "password": "secret123" }
```

**Response 200:**
```json
{ "message": "Login exitoso", "token": "<jwt>", "user": { "id": 1, "email": "user@example.com", "name": "Juan García" } }
```

---

### GET /auth/profile 🔒
Get the authenticated user's profile.

**Response 200:**
```json
{ "id": 1, "email": "user@example.com", "name": "Juan García" }
```

---

## Subjects (Materias)

All subject routes require authentication (`🔒`). Write operations require `teacher` or `admin` role, deletion requires `admin`.

| Method | Path | Description |
|--------|------|-------------|
| GET | /subjects | List all subjects |
| GET | /subjects/:id | Get subject by id |
| POST | /subjects | Create a subject (`teacher`, `admin`) |
| PUT | /subjects/:id | Update a subject (`teacher`, `admin`) |
| DELETE | /subjects/:id | Delete a subject (`admin`) |

**POST/PUT body:**
```json
{ "name": "Matemáticas", "code": "MAT101", "description": "Curso de álgebra", "credits": 4, "teacher_id": 2 }
```

---

## Students (Estudiantes)

All routes require authentication. List/detail requires `teacher` or `admin`; write operations require `admin`.

| Method | Path | Description |
|--------|------|-------------|
| GET | /students | List all students (`teacher`, `admin`) |
| GET | /students/:id | Get student by id |
| POST | /students | Create student profile (`admin`) |
| PUT | /students/:id | Update student (`admin`) |
| DELETE | /students/:id | Delete student (`admin`) |

**POST body:**
```json
{ "user_id": 3, "student_code": "A2024001", "career": "Ingeniería en Sistemas", "semester": 4 }
```

---

## Enrollments (Inscripciones)

All routes require authentication. Creation requires `teacher` or `admin`; deletion requires `admin`.

| Method | Path | Description |
|--------|------|-------------|
| GET | /enrollments | List all enrollments |
| GET | /enrollments/:id | Get enrollment by id |
| GET | /enrollments/student/:student_id | Get enrollments by student |
| POST | /enrollments | Create enrollment (`teacher`, `admin`) |
| DELETE | /enrollments/:id | Delete enrollment (`admin`) |

**POST body:**
```json
{ "student_id": 1, "subject_id": 2, "period": "2024-A" }
```

---

## Grades (Calificaciones)

All routes require authentication. Write operations require `teacher` or `admin`.

| Method | Path | Description |
|--------|------|-------------|
| GET | /grades | List all grades |
| GET | /grades/:id | Get grade by id |
| GET | /grades/enrollment/:enrollment_id | Get grades by enrollment |
| POST | /grades | Create grade (`teacher`, `admin`) |
| PUT | /grades/:id | Update grade (`teacher`, `admin`) |
| DELETE | /grades/:id | Delete grade (`teacher`, `admin`) |

**POST body:**
```json
{ "enrollment_id": 5, "grade": 9.5, "comments": "Excelente desempeño" }
```

**PUT body:**
```json
{ "grade": 8.0, "comments": "Buena participación" }
```

---

## Roles

| Role | Description |
|------|-------------|
| `student` | Default role. Can view own data. |
| `teacher` | Can create/update subjects, enrollments, grades. |
| `admin` | Full access to all resources. |

---

## Validation Errors

When a request fails validation, the API returns:

```json
{
  "errors": [
    { "field": "email", "msg": "Debe ser un email válido", "location": "body" }
  ]
}
```
