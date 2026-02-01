import { Request, Response } from "express";
import { TaskService } from "../../application/services/task.service";

export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    getTasks = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.query;

            if (!userId || typeof userId !== "string") {
                res.status(400).json({ message: "User ID is required" });
                return;
            }

            const tasks = await this.taskService.getTasks(userId);
            res.status(200).json(tasks);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(400).json({ message });
        }
    };

    createTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, description, userId } = req.body;

            if (!title || !description || !userId) {
                res.status(400).json({ message: "Title, description, and userId are required" });
                return;
            }

            const task = await this.taskService.createTask({ title, description, userId });
            res.status(201).json(task);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(400).json({ message });
        }
    };

    updateTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { title, description, completed } = req.body;

            if (!id || typeof id !== "string") {
                res.status(400).json({ message: "Task ID is required and must be a string" });
                return;
            }

            const task = await this.taskService.updateTask({
                id,
                title,
                description,
                completed
            });

            res.status(200).json(task);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            const status = message === "Task not found" ? 404 : 400;
            res.status(status).json({ message });
        }
    };

    deleteTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                res.status(400).json({ message: "Task ID is required and must be a string" });
                return;
            }

            await this.taskService.deleteTask(id);
            res.status(204).send();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            const status = message === "Task not found" ? 404 : 400;
            res.status(status).json({ message });
        }
    };
}
