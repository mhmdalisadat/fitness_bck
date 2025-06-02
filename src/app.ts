import express, { Express } from "express";
import { programRoutes } from "./routes";
import { workoutRoutes, userRoutes } from "./routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

app.use(
  cors({
    origin: ["http://31.40.4.92:7074", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", programRoutes);
app.use("/api", workoutRoutes);
app.use("/api", userRoutes);

// 404 handler
app.use((req, res) => {
  console.log("404 Not Found:", req.method, req.url);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
