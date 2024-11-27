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

const allowedOrigins = [
    process.env.CORS_ORIGIN
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some((pattern) => {
            if (typeof pattern === 'string') return pattern === origin;
            return pattern.test(origin); // For regex patterns
        })) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow cookies if required
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Export the app for Vercel
export default app;
