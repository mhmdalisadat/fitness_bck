import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// اتصال به MongoDB و سپس راه‌اندازی سرور
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
