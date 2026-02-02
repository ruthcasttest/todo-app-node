import { TaskService } from './task.service';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
import { Task, CreateTaskDto, UpdateTaskDto } from '../../domain/models/task.model';

describe('TaskService', () => {
    let taskService: TaskService;
    let mockTaskRepository: jest.Mocked<TaskRepositoryPort>;

    beforeEach(() => {
        mockTaskRepository = {
            getTasks: jest.fn(),
            getTaskById: jest.fn(),
            createTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
        };
        taskService = new TaskService(mockTaskRepository);
    });

    describe('getTasks', () => {
        it('should return all tasks for a user', async () => {
            const userId = 'user123';
            const mockTasks: Task[] = [
                {
                    id: 'task1',
                    title: 'Task 1',
                    description: 'Description 1',
                    completed: false,
                    createdAt: new Date(),
                    userId,
                },
                {
                    id: 'task2',
                    title: 'Task 2',
                    description: 'Description 2',
                    completed: true,
                    createdAt: new Date(),
                    userId,
                },
            ];

            mockTaskRepository.getTasks.mockResolvedValue(mockTasks);

            const result = await taskService.getTasks(userId);

            expect(result).toEqual(mockTasks);
            expect(result).toHaveLength(2);
            expect(mockTaskRepository.getTasks).toHaveBeenCalledWith(userId);
            expect(mockTaskRepository.getTasks).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when user has no tasks', async () => {
            const userId = 'user456';
            mockTaskRepository.getTasks.mockResolvedValue([]);

            const result = await taskService.getTasks(userId);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should throw error when userId is not provided', async () => {
            await expect(taskService.getTasks('')).rejects.toThrow('User ID is required');
            expect(mockTaskRepository.getTasks).not.toHaveBeenCalled();
        });
    });

    describe('getTaskById', () => {
        it('should return task when it exists', async () => {
            const taskId = 'task123';
            const mockTask: Task = {
                id: taskId,
                title: 'Test Task',
                description: 'Test Description',
                completed: false,
                createdAt: new Date(),
                userId: 'user123',
            };

            mockTaskRepository.getTaskById.mockResolvedValue(mockTask);

            const result = await taskService.getTaskById(taskId);

            expect(result).toEqual(mockTask);
            expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(taskId);
        });

        it('should throw error when task does not exist', async () => {
            const taskId = 'nonexistent';
            mockTaskRepository.getTaskById.mockResolvedValue(null);

            await expect(taskService.getTaskById(taskId)).rejects.toThrow('Task not found');
            expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(taskId);
        });
    });

    describe('createTask', () => {
        it('should create a new task successfully', async () => {
            const createDto: CreateTaskDto = {
                title: 'New Task',
                description: 'New Description',
                userId: 'user123',
            };
            const mockCreatedTask: Task = {
                id: 'task789',
                ...createDto,
                completed: false,
                createdAt: new Date(),
            };

            mockTaskRepository.createTask.mockResolvedValue(mockCreatedTask);

            const result = await taskService.createTask(createDto);

            expect(result).toEqual(mockCreatedTask);
            expect(mockTaskRepository.createTask).toHaveBeenCalledWith(createDto);
            expect(mockTaskRepository.createTask).toHaveBeenCalledTimes(1);
        });

        it('should throw error when title is missing', async () => {
            const createDto: CreateTaskDto = {
                title: '',
                description: 'Description',
                userId: 'user123',
            };

            await expect(taskService.createTask(createDto)).rejects.toThrow('Task title is required');
            expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
        });

        it('should throw error when title is only whitespace', async () => {
            const createDto: CreateTaskDto = {
                title: '   ',
                description: 'Description',
                userId: 'user123',
            };

            await expect(taskService.createTask(createDto)).rejects.toThrow('Task title is required');
            expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
        });

        it('should throw error when description is missing', async () => {
            const createDto: CreateTaskDto = {
                title: 'Title',
                description: '',
                userId: 'user123',
            };

            await expect(taskService.createTask(createDto)).rejects.toThrow('Task description is required');
            expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
        });

        it('should throw error when userId is missing', async () => {
            const createDto: CreateTaskDto = {
                title: 'Title',
                description: 'Description',
                userId: '',
            };

            await expect(taskService.createTask(createDto)).rejects.toThrow('User ID is required');
            expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
        });

        it('should throw error when title exceeds 100 characters', async () => {
            const createDto: CreateTaskDto = {
                title: 'a'.repeat(101),
                description: 'Description',
                userId: 'user123',
            };

            await expect(taskService.createTask(createDto)).rejects.toThrow('Title must not exceed 100 characters');
            expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
        });

        it('should throw error when description exceeds 500 characters', async () => {
            const createDto: CreateTaskDto = {
                title: 'Title',
                description: 'a'.repeat(501),
                userId: 'user123',
            };

            await expect(taskService.createTask(createDto)).rejects.toThrow('Description must not exceed 500 characters');
            expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
        });

        it('should accept title with exactly 100 characters', async () => {
            const createDto: CreateTaskDto = {
                title: 'a'.repeat(100),
                description: 'Description',
                userId: 'user123',
            };
            const mockCreatedTask: Task = {
                id: 'task789',
                ...createDto,
                completed: false,
                createdAt: new Date(),
            };

            mockTaskRepository.createTask.mockResolvedValue(mockCreatedTask);

            const result = await taskService.createTask(createDto);

            expect(result).toBeDefined();
            expect(mockTaskRepository.createTask).toHaveBeenCalledWith(createDto);
        });

        it('should accept description with exactly 500 characters', async () => {
            const createDto: CreateTaskDto = {
                title: 'Title',
                description: 'a'.repeat(500),
                userId: 'user123',
            };
            const mockCreatedTask: Task = {
                id: 'task789',
                ...createDto,
                completed: false,
                createdAt: new Date(),
            };

            mockTaskRepository.createTask.mockResolvedValue(mockCreatedTask);

            const result = await taskService.createTask(createDto);

            expect(result).toBeDefined();
            expect(mockTaskRepository.createTask).toHaveBeenCalledWith(createDto);
        });
    });

    describe('updateTask', () => {
        const existingTask: Task = {
            id: 'task123',
            title: 'Old Title',
            description: 'Old Description',
            completed: false,
            createdAt: new Date(),
            userId: 'user123',
        };

        it('should update task successfully', async () => {
            const updateDto: UpdateTaskDto = {
                id: 'task123',
                title: 'Updated Title',
                description: 'Updated Description',
                completed: true,
            };
            const mockUpdatedTask: Task = {
                ...existingTask,
                ...updateDto,
                updatedAt: new Date(),
            };

            mockTaskRepository.getTaskById.mockResolvedValue(existingTask);
            mockTaskRepository.updateTask.mockResolvedValue(mockUpdatedTask);

            const result = await taskService.updateTask(updateDto);

            expect(result).toEqual(mockUpdatedTask);
            expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(updateDto.id);
            expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(updateDto);
        });

        it('should update only completed status', async () => {
            const updateDto: UpdateTaskDto = {
                id: 'task123',
                completed: true,
            };
            const mockUpdatedTask: Task = {
                ...existingTask,
                completed: true,
                updatedAt: new Date(),
            };

            mockTaskRepository.getTaskById.mockResolvedValue(existingTask);
            mockTaskRepository.updateTask.mockResolvedValue(mockUpdatedTask);

            const result = await taskService.updateTask(updateDto);

            expect(result).toEqual(mockUpdatedTask);
            expect(result.completed).toBe(true);
        });

        it('should throw error when task id is missing', async () => {
            const updateDto: UpdateTaskDto = {
                id: '',
                title: 'Updated Title',
            };

            await expect(taskService.updateTask(updateDto)).rejects.toThrow('Task ID is required');
            expect(mockTaskRepository.getTaskById).not.toHaveBeenCalled();
        });

        it('should throw error when task does not exist', async () => {
            const updateDto: UpdateTaskDto = {
                id: 'nonexistent',
                title: 'Updated Title',
            };

            mockTaskRepository.getTaskById.mockResolvedValue(null);

            await expect(taskService.updateTask(updateDto)).rejects.toThrow('Task not found');
            expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(updateDto.id);
            expect(mockTaskRepository.updateTask).not.toHaveBeenCalled();
        });

        it('should throw error when updated title exceeds 100 characters', async () => {
            const updateDto: UpdateTaskDto = {
                id: 'task123',
                title: 'a'.repeat(101),
            };

            mockTaskRepository.getTaskById.mockResolvedValue(existingTask);

            await expect(taskService.updateTask(updateDto)).rejects.toThrow('Title must not exceed 100 characters');
            expect(mockTaskRepository.updateTask).not.toHaveBeenCalled();
        });

        it('should throw error when updated description exceeds 500 characters', async () => {
            const updateDto: UpdateTaskDto = {
                id: 'task123',
                description: 'a'.repeat(501),
            };

            mockTaskRepository.getTaskById.mockResolvedValue(existingTask);

            await expect(taskService.updateTask(updateDto)).rejects.toThrow('Description must not exceed 500 characters');
            expect(mockTaskRepository.updateTask).not.toHaveBeenCalled();
        });
    });

    describe('deleteTask', () => {
        it('should delete task successfully', async () => {
            const taskId = 'task123';
            const existingTask: Task = {
                id: taskId,
                title: 'Task to delete',
                description: 'Description',
                completed: false,
                createdAt: new Date(),
                userId: 'user123',
            };

            mockTaskRepository.getTaskById.mockResolvedValue(existingTask);
            mockTaskRepository.deleteTask.mockResolvedValue(undefined);

            await taskService.deleteTask(taskId);

            expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(taskId);
            expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(taskId);
            expect(mockTaskRepository.deleteTask).toHaveBeenCalledTimes(1);
        });

        it('should throw error when taskId is missing', async () => {
            await expect(taskService.deleteTask('')).rejects.toThrow('Task ID is required');
            expect(mockTaskRepository.getTaskById).not.toHaveBeenCalled();
            expect(mockTaskRepository.deleteTask).not.toHaveBeenCalled();
        });

        it('should throw error when task does not exist', async () => {
            const taskId = 'nonexistent';
            mockTaskRepository.getTaskById.mockResolvedValue(null);

            await expect(taskService.deleteTask(taskId)).rejects.toThrow('Task not found');
            expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(taskId);
            expect(mockTaskRepository.deleteTask).not.toHaveBeenCalled();
        });
    });
});
