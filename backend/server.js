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

const origin = 'https://leon-prod-ui.vercel.app'
app.use(cors({
    origin
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Export the app for Vercel
export default app;
