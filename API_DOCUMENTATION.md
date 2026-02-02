# 📚 API Documentation - Task Manager Backend

## 🌐 Base URLs

| Environment | URL |
|------------|-----|
| **Production** | `https://api-cuhnzjomva-uc.a.run.app` |
| **Local Development** | `http://localhost:3000` |

## 🔐 Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## 📋 Table of Contents

- [Data Models](#data-models)
- [Health Check](#health-check)
- [Users API](#users-api)
  - [Check User](#check-user)
  - [Create User](#create-user)
- [Tasks API](#tasks-api)
  - [Get Tasks](#get-tasks)
  - [Create Task](#create-task)
  - [Update Task](#update-task)
  - [Delete Task](#delete-task)
- [Error Handling](#error-handling)
- [Angular Integration Examples](#angular-integration-examples)
- [CORS Configuration](#cors-configuration)

---

## Data Models

### User Model

```typescript
interface User {
  id: string;              // Unique user identifier
  email: string;           // User's email address
  createdAt: string;       // ISO 8601 date string
}
```

**Example:**
```json
{
  "id": "nbWXTJ2nPwiGmtCiBbTe",
  "email": "user@example.com",
  "createdAt": "2026-02-01T00:58:46.206Z"
}
```

### Task Model

```typescript
interface Task {
  id: string;              // Unique task identifier
  title: string;           // Task title
  description: string;     // Task description
  completed: boolean;      // Task completion status
  createdAt: string;       // ISO 8601 date string
  updatedAt?: string;      // ISO 8601 date string (optional)
  userId: string;          // User's email address
}
```

**Example:**
```json
{
  "id": "FpJispvGKuFBtipHMtER",
  "title": "Mi primera tarea",
  "description": "Esta es una tarea de prueba",
  "completed": false,
  "createdAt": "2026-02-01T00:58:56.191Z",
  "updatedAt": "2026-02-01T00:59:40.262Z",
  "userId": "user@example.com"
}
```

### Error Response Model

```typescript
interface ErrorResponse {
  message: string;         // Error description
}
```

**Example:**
```json
{
  "message": "User ID is required"
}
```

---

## Health Check

### GET `/api/health`

Check if the API is running.

**Response Model:**
```typescript
interface HealthCheckResponse {
  status: string;          // Always "ok"
  timestamp: string;       // ISO 8601 date string
}
```

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-02-01T00:08:34.134Z"
}
```

**Example:**
```bash
curl https://api-cuhnzjomva-uc.a.run.app/api/health
```

---

## Users API

### Check User

#### GET `/api/users/check`

Check if a user exists by email.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | User's email address |

**Response Models:**

**When User Exists:**
```typescript
interface CheckUserExistsResponse {
  exists: true;
  user: User;
}
```

**When User Does Not Exist:**
```typescript
interface CheckUserNotFoundResponse {
  exists: false;
}
```

**Success Response - User Exists (200):**
```json
{
  "exists": true,
  "user": {
    "id": "nbWXTJ2nPwiGmtCiBbTe",
    "email": "user@example.com",
    "createdAt": "2026-02-01T00:58:46.206Z"
  }
}
```

**Success Response - User Not Found (404):**
```json
{
  "exists": false
}
```

**Error Response (400):**
```json
{
  "message": "Email is required"
}
```

**Example:**
```bash
curl "https://api-cuhnzjomva-uc.a.run.app/api/users/check?email=user@example.com"
```

**Angular/TypeScript Example:**
```typescript
checkUser(email: string): Observable<CheckUserResponse> {
  return this.http.get<CheckUserResponse>(
    `${this.apiUrl}/api/users/check?email=${encodeURIComponent(email)}`
  );
}

type CheckUserResponse = CheckUserExistsResponse | CheckUserNotFoundResponse;
```

---

### Create User

#### POST `/api/users`

Create a new user.

**Request Model:**
```typescript
interface CreateUserRequest {
  email: string;
}
```

**Response Model:**
```typescript
interface CreateUserResponse {
  id: string;
  email: string;
  createdAt: string;
}
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (201):**
```json
{
  "id": "nbWXTJ2nPwiGmtCiBbTe",
  "email": "user@example.com",
  "createdAt": "2026-02-01T00:58:46.206Z"
}
```

**Error Response (400):**
```json
{
  "message": "Email is required"
}
```

**Example:**
```bash
curl -X POST https://api-cuhnzjomva-uc.a.run.app/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Angular/TypeScript Example:**
```typescript
createUser(email: string): Observable<CreateUserResponse> {
  return this.http.post<CreateUserResponse>(
    `${this.apiUrl}/api/users`,
    { email }
  );
}
```

---

## Tasks API

### Get Tasks

#### GET `/api/tasks`

Get all tasks for a specific user, ordered by creation date (most recent first).

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User's email address |

**Response Model:**
```typescript
interface GetTasksResponse extends Array<Task> {}
```

**Success Response (200):**
```json
[
  {
    "id": "6nBHObIW8QeBmIQpoTZx",
    "title": "Segunda tarea",
    "description": "Otra tarea de prueba",
    "completed": false,
    "createdAt": "2026-02-01T00:59:25.373Z",
    "userId": "test@example.com"
  },
  {
    "id": "FpJispvGKuFBtipHMtER",
    "title": "Mi primera tarea",
    "description": "Esta es una tarea de prueba",
    "completed": true,
    "createdAt": "2026-02-01T00:58:56.191Z",
    "updatedAt": "2026-02-01T00:59:40.262Z",
    "userId": "test@example.com"
  }
]
```

**Empty Response (200):**
```json
[]
```

**Error Response (400):**
```json
{
  "message": "User ID is required"
}
```

**Example:**
```bash
curl "https://api-cuhnzjomva-uc.a.run.app/api/tasks?userId=user@example.com"
```

**Angular/TypeScript Example:**
```typescript
getTasks(userId: string): Observable<Task[]> {
  return this.http.get<Task[]>(
    `${this.apiUrl}/api/tasks?userId=${encodeURIComponent(userId)}`
  );
}
```

---

### Create Task

#### POST `/api/tasks`

Create a new task.

**Request Model:**
```typescript
interface CreateTaskRequest {
  title: string;
  description: string;
  userId: string;
}
```

**Response Model:**
```typescript
interface CreateTaskResponse {
  id: string;
  title: string;
  description: string;
  completed: boolean;        // Always false for new tasks
  createdAt: string;
  userId: string;
}
```

**Request Body:**
```json
{
  "title": "Mi primera tarea",
  "description": "Esta es una tarea de prueba",
  "userId": "user@example.com"
}
```

**Field Validation:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Task title |
| `description` | string | Yes | Task description |
| `userId` | string | Yes | User's email address |

**Success Response (201):**
```json
{
  "id": "FpJispvGKuFBtipHMtER",
  "title": "Mi primera tarea",
  "description": "Esta es una tarea de prueba",
  "completed": false,
  "createdAt": "2026-02-01T00:58:56.191Z",
  "userId": "user@example.com"
}
```

**Error Response (400):**
```json
{
  "message": "Title, description, and userId are required"
}
```

**Example:**
```bash
curl -X POST https://api-cuhnzjomva-uc.a.run.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera tarea",
    "description": "Esta es una tarea de prueba",
    "userId": "user@example.com"
  }'
```

**Angular/TypeScript Example:**
```typescript
createTask(request: CreateTaskRequest): Observable<CreateTaskResponse> {
  return this.http.post<CreateTaskResponse>(
    `${this.apiUrl}/api/tasks`,
    request
  );
}
```

---

### Update Task

#### PUT `/api/tasks/:id`

Update an existing task. You can update `title`, `description`, and/or `completed` status.

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Task ID |

**Request Model:**
```typescript
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

**Response Model:**
```typescript
interface UpdateTaskResponse {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;         // Always present after update
  userId: string;
}
```

**Request Body:**
```json
{
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "completed": true
}
```

**Partial Update Example:**
```json
{
  "completed": true
}
```

**Field Validation:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Task title |
| `description` | string | No | Task description |
| `completed` | boolean | No | Task completion status |

**Success Response (200):**
```json
{
  "id": "FpJispvGKuFBtipHMtER",
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "completed": true,
  "createdAt": "2026-02-01T00:58:56.191Z",
  "updatedAt": "2026-02-01T01:30:00.000Z",
  "userId": "user@example.com"
}
```

**Error Response (400):**
```json
{
  "message": "Task ID is required and must be a string"
}
```

**Error Response (404):**
```json
{
  "message": "Task not found"
}
```

**Example:**
```bash
curl -X PUT https://api-cuhnzjomva-uc.a.run.app/api/tasks/FpJispvGKuFBtipHMtER \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Angular/TypeScript Example:**
```typescript
updateTask(
  taskId: string,
  updates: UpdateTaskRequest
): Observable<UpdateTaskResponse> {
  return this.http.put<UpdateTaskResponse>(
    `${this.apiUrl}/api/tasks/${taskId}`,
    updates
  );
}
```

---

### Delete Task

#### DELETE `/api/tasks/:id`

Delete a task permanently.

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Task ID |

**Response Model:**
```typescript
// No response body (204 status)
void
```

**Success Response (204):**
No content returned.

**Error Response (400):**
```json
{
  "message": "Task ID is required and must be a string"
}
```

**Error Response (404):**
```json
{
  "message": "Task not found"
}
```

**Example:**
```bash
curl -X DELETE https://api-cuhnzjomva-uc.a.run.app/api/tasks/FpJispvGKuFBtipHMtER
```

**Angular/TypeScript Example:**
```typescript
deleteTask(taskId: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/api/tasks/${taskId}`);
}
```

---

## Error Handling

All errors follow this format:

```typescript
interface ErrorResponse {
  message: string;
}
```

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `201` | Created |
| `204` | No Content (successful deletion) |
| `400` | Bad Request (validation error) |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## Angular Integration Examples

### Complete TypeScript Models

```typescript
// models/user.model.ts
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
}

export interface CreateUserResponse extends User {}

export interface CheckUserExistsResponse {
  exists: true;
  user: User;
}

export interface CheckUserNotFoundResponse {
  exists: false;
}

export type CheckUserResponse = CheckUserExistsResponse | CheckUserNotFoundResponse;
```

```typescript
// models/task.model.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  userId: string;
}

export interface CreateTaskResponse {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTaskResponse extends Task {
  updatedAt: string;  // Always present after update
}

export type GetTasksResponse = Task[];
```

```typescript
// models/common.model.ts
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
}

export interface ErrorResponse {
  message: string;
}
```

### Complete Angular Service

```typescript
// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  User,
  CreateUserRequest,
  CreateUserResponse,
  CheckUserResponse
} from '../models/user.model';
import {
  Task,
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  GetTasksResponse
} from '../models/task.model';
import { HealthCheckResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==================== HEALTH CHECK ====================

  healthCheck(): Observable<HealthCheckResponse> {
    return this.http.get<HealthCheckResponse>(`${this.apiUrl}/api/health`);
  }

  // ==================== USERS ====================

  checkUser(email: string): Observable<CheckUserResponse> {
    return this.http.get<CheckUserResponse>(
      `${this.apiUrl}/api/users/check?email=${encodeURIComponent(email)}`
    );
  }

  createUser(email: string): Observable<CreateUserResponse> {
    const request: CreateUserRequest = { email };
    return this.http.post<CreateUserResponse>(
      `${this.apiUrl}/api/users`,
      request
    );
  }

  // ==================== TASKS ====================

  getTasks(userId: string): Observable<GetTasksResponse> {
    return this.http.get<GetTasksResponse>(
      `${this.apiUrl}/api/tasks?userId=${encodeURIComponent(userId)}`
    );
  }

  createTask(request: CreateTaskRequest): Observable<CreateTaskResponse> {
    return this.http.post<CreateTaskResponse>(
      `${this.apiUrl}/api/tasks`,
      request
    );
  }

  updateTask(
    taskId: string,
    updates: UpdateTaskRequest
  ): Observable<UpdateTaskResponse> {
    return this.http.put<UpdateTaskResponse>(
      `${this.apiUrl}/api/tasks/${taskId}`,
      updates
    );
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/tasks/${taskId}`);
  }
}
```

### Environment Configuration

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api-cuhnzjomva-uc.a.run.app'
};
```

---

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:4200` (Development)
- Other origins can be configured via environment variables

**Headers included:**
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials: true`

---

## Testing with cURL

### Complete Workflow Example

```bash
# 1. Check API health
curl https://api-cuhnzjomva-uc.a.run.app/api/health

# 2. Create a user
curl -X POST https://api-cuhnzjomva-uc.a.run.app/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com"}'

# 3. Check if user exists
curl "https://api-cuhnzjomva-uc.a.run.app/api/users/check?email=demo@example.com"

# 4. Create a task
curl -X POST https://api-cuhnzjomva-uc.a.run.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "userId": "demo@example.com"
  }'

# 5. Get all tasks for user
curl "https://api-cuhnzjomva-uc.a.run.app/api/tasks?userId=demo@example.com"

# 6. Mark task as completed (replace TASK_ID with actual ID)
curl -X PUT https://api-cuhnzjomva-uc.a.run.app/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 7. Delete task (replace TASK_ID with actual ID)
curl -X DELETE https://api-cuhnzjomva-uc.a.run.app/api/tasks/TASK_ID
```

---

## Notes for Frontend Team

1. **Authentication**: Currently no authentication is required. This may change in future versions.

2. **Date Handling**: All dates are returned as ISO 8601 strings. Convert them to Date objects in your frontend:
   ```typescript
   const date = new Date(task.createdAt);
   ```

3. **User ID**: The `userId` field uses the user's email address as the identifier.

4. **Task Ordering**: Tasks are automatically ordered by `createdAt` in descending order (newest first) when fetched from the API.

5. **Error Messages**: Always check the `message` field in error responses for user-friendly error descriptions.

6. **CORS**: Make sure your Angular app runs on `http://localhost:4200` during development to avoid CORS issues.

7. **TypeScript Types**: Use the provided TypeScript interfaces for type safety in your Angular application.

8. **Partial Updates**: The `PUT /api/tasks/:id` endpoint supports partial updates. You only need to send the fields you want to update.

9. **Empty Arrays**: When a user has no tasks, the API returns an empty array `[]`, not null or undefined.

10. **updatedAt Field**: This field is only present after a task has been updated at least once. Check for its existence before using it.

---

## Support

For questions or issues, please contact the backend team or check the project repository.

**API Base URL (Production):** https://api-cuhnzjomva-uc.a.run.app
**Last Updated:** 2026-02-01
