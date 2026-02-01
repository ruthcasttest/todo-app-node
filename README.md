# Task Manager API - Backend

Backend API para la aplicación de gestión de tareas, implementado con Express, TypeScript y Firebase Firestore.

## Arquitectura

### Arquitectura Hexagonal (Ports & Adapters)

```
src/
├── domain/                    # Capa de Dominio
│   ├── models/                # Entidades y DTOs
│   │   ├── user.model.ts
│   │   └── task.model.ts
│   └── ports/                 # Interfaces (Puertos)
│       ├── user.repository.port.ts
│       └── task.repository.port.ts
│
├── application/               # Capa de Aplicación
│   └── services/              # Lógica de negocio
│       ├── user.service.ts
│       └── task.service.ts
│
├── infrastructure/            # Capa de Infraestructura
│   ├── adapters/              # Implementaciones de puertos
│   │   ├── user.firestore.repository.ts
│   │   └── task.firestore.repository.ts
│   └── middleware/            # Middlewares Express
│       └── error.middleware.ts
│
├── presentation/              # Capa de Presentación
│   ├── controllers/           # Controladores HTTP
│   │   ├── user.controller.ts
│   │   └── task.controller.ts
│   └── routes/                # Rutas Express
│       ├── user.routes.ts
│       └── task.routes.ts
│
├── config/                    # Configuración
│   └── firebase.config.ts
│
├── app.ts                     # Configuración Express
├── index.ts                   # Entry point local
└── functions.ts               # Entry point Cloud Functions
```

## Tecnologías

- **Express** - Framework web
- **TypeScript** - Lenguaje tipado
- **Firebase Firestore** - Base de datos NoSQL
- **Firebase Functions** - Serverless hosting
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

## Principios Aplicados

- ✅ **Arquitectura Hexagonal** (Ports & Adapters)
- ✅ **SOLID Principles**
- ✅ **Dependency Injection**
- ✅ **Repository Pattern**
- ✅ **Error Handling**
- ✅ **Input Validation**
- ✅ **TypeScript Strict Mode**

## API Endpoints

### Users

#### Check User
```
GET /api/users/check?email={email}
```
**Response:**
```json
{
  "exists": true,
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "createdAt": "2024-01-30T..."
  }
}
```

#### Create User
```
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "id": "abc123",
  "email": "user@example.com",
  "createdAt": "2024-01-30T..."
}
```

### Tasks

#### Get Tasks
```
GET /api/tasks?userId={userId}
```
**Response:**
```json
[
  {
    "id": "task123",
    "title": "Complete project",
    "description": "Finish the task manager app",
    "completed": false,
    "createdAt": "2024-01-30T...",
    "userId": "abc123"
  }
]
```

#### Create Task
```
POST /api/tasks
Content-Type: application/json

{
  "title": "New task",
  "description": "Task description",
  "userId": "abc123"
}
```

#### Update Task
```
PUT /api/tasks/{id}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

#### Delete Task
```
DELETE /api/tasks/{id}
```

### Health Check
```
GET /api/health
```

## Instalación

### 1. Clonar e instalar dependencias

```bash
cd challenge-ruth-reyes-backend
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Firebase:

```env
PORT=3000
NODE_ENV=development

FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=tu-client-email@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

CORS_ORIGIN=http://localhost:4200
```

### 3. Configurar Firebase

#### Obtener credenciales:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a **Project Settings** > **Service Accounts**
4. Click en **Generate new private key**
5. Guarda el archivo JSON descargado

#### Extraer credenciales del JSON:

```javascript
{
  "project_id": "...",           // -> FIREBASE_PROJECT_ID
  "client_email": "...",         // -> FIREBASE_CLIENT_EMAIL
  "private_key": "..."           // -> FIREBASE_PRIVATE_KEY
}
```

**Nota:** Para `FIREBASE_PRIVATE_KEY`, copia la clave completa incluyendo:
```
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start            # Ejecutar versión compilada
npm run lint         # Verificar código
npm run lint:fix     # Corregir errores de linting
npm run deploy       # Desplegar a Firebase Functions
```

## Desplegar a Firebase Functions

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login a Firebase

```bash
firebase login
```

### 3. Inicializar Firebase Functions

```bash
firebase init functions
```

Selecciona:
- Use an existing project
- TypeScript
- ESLint: Yes
- Install dependencies: Yes

### 4. Configurar firebase.json

```json
{
  "functions": {
    "source": ".",
    "predeploy": ["npm run build"],
    "runtime": "nodejs18"
  }
}
```

### 5. Configurar variables de entorno en Firebase

```bash
firebase functions:config:set \
  firebase.project_id="tu-project-id" \
  firebase.client_email="tu-client-email" \
  firebase.private_key="tu-private-key"
```

### 6. Desplegar

```bash
npm run deploy
```

Tu API estará disponible en:
```
https://REGION-PROJECT_ID.cloudfunctions.net/api
```

## Estructura de Datos (Firestore)

### Collection: users
```typescript
{
  email: string;
  createdAt: Timestamp;
}
```

### Collection: tasks
```typescript
{
  title: string;          // max 100 chars
  description: string;    // max 500 chars
  completed: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  userId: string;         // Foreign key
}
```

### Índices Requeridos

Firestore creará automáticamente los índices, pero si necesitas crearlos manualmente:

**tasks collection:**
- Composite index: `userId` (Ascending) + `createdAt` (Descending)

## Validaciones

### User
- Email: Formato válido, requerido, único

### Task
- Title: Requerido, max 100 caracteres
- Description: Requerido, max 500 caracteres
- UserId: Requerido, debe existir

## Testing con cURL

### Check User
```bash
curl "http://localhost:3000/api/users/check?email=test@example.com"
```

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","description":"Description here","userId":"USER_ID"}'
```

### Get Tasks
```bash
curl "http://localhost:3000/api/tasks?userId=USER_ID"
```

### Update Task
```bash
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### Delete Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID
```

## Troubleshooting

### Error: Firebase credentials not found
Verifica que las variables de entorno estén correctamente configuradas en `.env`

### Error: Collection not found
Firestore creará las colecciones automáticamente al insertar el primer documento

### CORS Error
Verifica que `CORS_ORIGIN` en `.env` coincida con la URL de tu frontend

### Port already in use
Cambia el `PORT` en `.env` o mata el proceso:
```bash
lsof -ti:3000 | xargs kill
```

## Seguridad

- ✅ CORS configurado
- ✅ Validación de entrada
- ✅ Manejo de errores
- ⚠️ **No implementado en este challenge**: Autenticación JWT, rate limiting

## Próximos Pasos

- [ ] Agregar tests unitarios
- [ ] Implementar JWT authentication
- [ ] Rate limiting
- [ ] Logging con Winston
- [ ] Documentación con Swagger/OpenAPI
- [ ] CI/CD pipeline

## Autor

Implementado para el Challenge Técnico Fullstack Developer.
# todo-app-node
