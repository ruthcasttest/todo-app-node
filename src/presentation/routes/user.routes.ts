import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../../application/services/user.service";
import { UserFirestoreRepository } from "../../infrastructure/adapters/user.firestore.repository";

const router = Router();
const userRepository = new UserFirestoreRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/check", userController.checkUser);
router.post("/", userController.createUser);

export default router;
