export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt?: Date;
    userId: string;
}

export interface CreateTaskDto {
    title: string;
    description: string;
    userId: string;
}

export interface UpdateTaskDto {
    id: string;
    title?: string;
    description?: string;
    completed?: boolean;
}
