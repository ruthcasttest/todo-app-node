import express, { Application } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import userRoutes from "./presentation/routes/user.routes";
import taskRoutes from "./presentation/routes/task.routes";
import { errorHandler } from "./infrastructure/middleware/error.middleware";

// Load .env for local development
dotenv.config();

export const createApp = (): Application => {
    const app = express();

    // Middlewares
    const allowedOrigins = [
        "http://localhost:4200",
        "https://todo-tasks-4f8c7.web.app",
        "https://todo-tasks-4f8c7.firebaseapp.com"
    ];

    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use("/api/users", userRoutes);
    app.use("/api/tasks", taskRoutes);

    // Health check
    app.get("/api/health", (_req, res) => {
        res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // Error handling
    app.use(errorHandler);

    return app;
};
