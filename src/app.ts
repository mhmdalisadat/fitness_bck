import express, { Express } from "express";
import { programRoutes } from "./routes";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app: Express = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware برای پارس JSON
app.use(express.json());

// روت‌ها
app.use("/api", programRoutes);

export default app;
