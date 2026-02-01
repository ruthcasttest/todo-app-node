import { createApp } from "./app";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.DEV_PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
    console.log("Environment: " + (process.env.NODE_ENV || "development"));
});
