import { CreateTaskDto, Task, UpdateTaskDto } from "../models/task.model";

export interface TaskRepositoryPort {
    getTasks(userId: string): Promise<Task[]>;
    getTaskById(taskId: string): Promise<Task | null>;
    createTask(dto: CreateTaskDto): Promise<Task>;
    updateTask(dto: UpdateTaskDto): Promise<Task>;
    deleteTask(taskId: string): Promise<void>;
}
