import express from "express";
import projectRoutes from './routes/index.js';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, () => {
    console.log('Connected to MongoDB');
}, (e) => console.log(e));

const app = express();

const origin = [
    "https://leon-prod-ui.vercel.app",  // Your frontend URL
    "https://leon-prod.vercel.app"     // Your backend URL
  ];
  
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origin.includes("vercel.app")) {
          callback(null, true); // Allow only Vercel origins
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // Allow credentials if needed
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
      ],
    })
  );

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your routes
app.use(projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Export the app for Vercel
export default app;
