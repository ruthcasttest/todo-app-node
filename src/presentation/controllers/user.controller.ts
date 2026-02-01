import { Request, Response } from "express";
import { UserService } from "../../application/services/user.service";

export class UserController {
    constructor(private readonly userService: UserService) {}

    checkUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.query;

            if (!email || typeof email !== "string") {
                res.status(400).json({ message: "Email is required" });
                return;
            }

            const result = await this.userService.checkUserExists(email);
            res.status(200).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(400).json({ message });
        }
    };

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;

            if (!email) {
                res.status(400).json({ message: "Email is required" });
                return;
            }

            const user = await this.userService.createUser({ email });
            res.status(201).json(user);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(400).json({ message });
        }
    };
}
