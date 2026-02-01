import { TaskRepositoryPort } from "../../domain/ports/task.repository.port";
import { CreateTaskDto, Task, UpdateTaskDto } from "../../domain/models/task.model";

export class TaskService {
    constructor(private readonly taskRepository: TaskRepositoryPort) {}

    async getTasks(userId: string): Promise<Task[]> {
        if (!userId) {
            throw new Error("User ID is required");
        }

        return await this.taskRepository.getTasks(userId);
    }

    async getTaskById(taskId: string): Promise<Task> {
        const task = await this.taskRepository.getTaskById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        return task;
    }

    async createTask(dto: CreateTaskDto): Promise<Task> {
        if (!dto.title || dto.title.trim().length === 0) {
            throw new Error("Task title is required");
        }

        if (!dto.description || dto.description.trim().length === 0) {
            throw new Error("Task description is required");
        }

        if (!dto.userId) {
            throw new Error("User ID is required");
        }

        if (dto.title.length > 100) {
            throw new Error("Title must not exceed 100 characters");
        }

        if (dto.description.length > 500) {
            throw new Error("Description must not exceed 500 characters");
        }

        return await this.taskRepository.createTask(dto);
    }

    async updateTask(dto: UpdateTaskDto): Promise<Task> {
        if (!dto.id) {
            throw new Error("Task ID is required");
        }

        const existingTask = await this.taskRepository.getTaskById(dto.id);
        if (!existingTask) {
            throw new Error("Task not found");
        }

        if (dto.title !== undefined && dto.title.length > 100) {
            throw new Error("Title must not exceed 100 characters");
        }

        if (dto.description !== undefined && dto.description.length > 500) {
            throw new Error("Description must not exceed 500 characters");
        }

        return await this.taskRepository.updateTask(dto);
    }

    async deleteTask(taskId: string): Promise<void> {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        const existingTask = await this.taskRepository.getTaskById(taskId);
        if (!existingTask) {
            throw new Error("Task not found");
        }

        await this.taskRepository.deleteTask(taskId);
    }
}
