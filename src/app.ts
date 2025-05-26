import express, { Express } from "express";
import { programRoutes } from "./routes";

const app: Express = express();

// Middleware برای پارس JSON
app.use(express.json());

// روت‌ها
app.use("/api", programRoutes);

export default app;
