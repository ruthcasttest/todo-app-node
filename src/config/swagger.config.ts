import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'Backend API para la aplicación de gestión de tareas con Express, TypeScript y Firebase',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api-cuhnzjomva-uc.a.run.app',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'Endpoints para gestión de usuarios',
      },
      {
        name: 'Tasks',
        description: 'Endpoints para gestión de tareas',
      },
      {
        name: 'Health',
        description: 'Endpoint de health check',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del usuario',
              example: 'abc123',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'user@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2024-01-30T12:00:00.000Z',
            },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único de la tarea',
              example: 'task123',
            },
            title: {
              type: 'string',
              description: 'Título de la tarea (max 100 caracteres)',
              example: 'Completar el proyecto',
              maxLength: 100,
            },
            description: {
              type: 'string',
              description: 'Descripción de la tarea (max 500 caracteres)',
              example: 'Finalizar la aplicación de gestión de tareas',
              maxLength: 500,
            },
            completed: {
              type: 'boolean',
              description: 'Estado de completado',
              example: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2024-01-30T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-30T12:00:00.000Z',
            },
            userId: {
              type: 'string',
              description: 'ID del usuario propietario',
              example: 'abc123',
            },
          },
        },
        CheckUserResponse: {
          type: 'object',
          properties: {
            exists: {
              type: 'boolean',
              description: 'Indica si el usuario existe',
              example: true,
            },
            user: {
              $ref: '#/components/schemas/User',
              description: 'Datos del usuario si existe',
            },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'user@example.com',
            },
          },
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['title', 'description', 'userId'],
          properties: {
            title: {
              type: 'string',
              description: 'Título de la tarea (max 100 caracteres)',
              example: 'Nueva tarea',
              maxLength: 100,
            },
            description: {
              type: 'string',
              description: 'Descripción de la tarea (max 500 caracteres)',
              example: 'Descripción de la tarea',
              maxLength: 500,
            },
            userId: {
              type: 'string',
              description: 'ID del usuario propietario',
              example: 'abc123',
            },
          },
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Título de la tarea (max 100 caracteres)',
              example: 'Título actualizado',
              maxLength: 100,
            },
            description: {
              type: 'string',
              description: 'Descripción de la tarea (max 500 caracteres)',
              example: 'Descripción actualizada',
              maxLength: 500,
            },
            completed: {
              type: 'boolean',
              description: 'Estado de completado',
              example: true,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Error message',
            },
          },
        },
      },
    },
    paths: {
      '/api/users/check': {
        get: {
          tags: ['Users'],
          summary: 'Verificar si un usuario existe',
          description: 'Verifica si un usuario existe en el sistema por email',
          parameters: [
            {
              name: 'email',
              in: 'query',
              required: true,
              description: 'Email del usuario a verificar',
              schema: {
                type: 'string',
                format: 'email',
                example: 'user@example.com',
              },
            },
          ],
          responses: {
            200: {
              description: 'Respuesta exitosa',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CheckUserResponse',
                  },
                },
              },
            },
            400: {
              description: 'Email inválido o faltante',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/users': {
        post: {
          tags: ['Users'],
          summary: 'Crear un nuevo usuario',
          description: 'Crea un nuevo usuario en el sistema',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateUserRequest',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Usuario creado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
            400: {
              description: 'Email inválido o usuario ya existe',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Obtener todas las tareas de un usuario',
          description: 'Obtiene todas las tareas de un usuario ordenadas por fecha de creación',
          parameters: [
            {
              name: 'userId',
              in: 'query',
              required: true,
              description: 'ID del usuario',
              schema: {
                type: 'string',
                example: 'abc123',
              },
            },
          ],
          responses: {
            200: {
              description: 'Lista de tareas',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Task',
                    },
                  },
                },
              },
            },
            400: {
              description: 'User ID faltante',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Crear una nueva tarea',
          description: 'Crea una nueva tarea para un usuario',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateTaskRequest',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Tarea creada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task',
                  },
                },
              },
            },
            400: {
              description: 'Datos inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/tasks/{id}': {
        put: {
          tags: ['Tasks'],
          summary: 'Actualizar una tarea',
          description: 'Actualiza los datos de una tarea existente',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID de la tarea',
              schema: {
                type: 'string',
                example: 'task123',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateTaskRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Tarea actualizada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task',
                  },
                },
              },
            },
            400: {
              description: 'Datos inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Tarea no encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Eliminar una tarea',
          description: 'Elimina una tarea existente',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID de la tarea',
              schema: {
                type: 'string',
                example: 'task123',
              },
            },
          ],
          responses: {
            204: {
              description: 'Tarea eliminada exitosamente',
            },
            400: {
              description: 'ID inválido',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Tarea no encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          description: 'Verifica el estado de la API',
          responses: {
            200: {
              description: 'API funcionando correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'ok',
                      },
                      timestamp: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-01-30T12:00:00.000Z',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // No necesitamos especificar archivos porque toda la documentación está inline
};

export const swaggerSpec = swaggerJsdoc(options);
