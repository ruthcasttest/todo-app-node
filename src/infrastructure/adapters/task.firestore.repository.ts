import { db } from "../../config/firebase.config";
import { CreateTaskDto, Task, UpdateTaskDto } from "../../domain/models/task.model";
import { TaskRepositoryPort } from "../../domain/ports/task.repository.port";

export class TaskFirestoreRepository implements TaskRepositoryPort {
    private readonly collection = db.collection("tasks");

    async getTasks(userId: string): Promise<Task[]> {
        const snapshot = await this.collection
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                completed: data.completed,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                userId: data.userId
            };
        });
    }

    async getTaskById(taskId: string): Promise<Task | null> {
        const doc = await this.collection.doc(taskId).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();
        if (!data) {
            return null;
        }

        return {
            id: doc.id,
            title: data.title,
            description: data.description,
            completed: data.completed,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            userId: data.userId
        };
    }

    async createTask(dto: CreateTaskDto): Promise<Task> {
        const docRef = await this.collection.add({
            title: dto.title,
            description: dto.description,
            completed: false,
            createdAt: new Date(),
            userId: dto.userId
        });

        const doc = await docRef.get();
        const data = doc.data();

        if (!data) {
            throw new Error("Failed to create task");
        }

        return {
            id: doc.id,
            title: data.title,
            description: data.description,
            completed: data.completed,
            createdAt: data.createdAt.toDate(),
            userId: data.userId
        };
    }

    async updateTask(dto: UpdateTaskDto): Promise<Task> {
        const docRef = this.collection.doc(dto.id);
        const updateData: Record<string, unknown> = {
            updatedAt: new Date()
        };

        if (dto.title !== undefined) {
            updateData.title = dto.title;
        }
        if (dto.description !== undefined) {
            updateData.description = dto.description;
        }
        if (dto.completed !== undefined) {
            updateData.completed = dto.completed;
        }

        await docRef.update(updateData);

        const updatedDoc = await docRef.get();
        const data = updatedDoc.data();

        if (!data) {
            throw new Error("Failed to update task");
        }

        return {
            id: updatedDoc.id,
            title: data.title,
            description: data.description,
            completed: data.completed,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            userId: data.userId
        };
    }

    async deleteTask(taskId: string): Promise<void> {
        await this.collection.doc(taskId).delete();
    }
}
