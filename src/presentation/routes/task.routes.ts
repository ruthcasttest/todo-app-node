import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskService } from "../../application/services/task.service";
import { TaskFirestoreRepository } from "../../infrastructure/adapters/task.firestore.repository";

const router = Router();
const taskRepository = new TaskFirestoreRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
