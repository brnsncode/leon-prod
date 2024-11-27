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

// Set up CORS with detailed handling
const allowCors = (req, res, next) => {
    const allowedOrigins = ['https://leon-prod-ui.vercel.app', 'https://another-origin-if-needed.com']; // Add other allowed origins if needed
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Preflight request response
    }
    next(); // Proceed to the next middleware
};

app.use(allowCors); // Apply custom CORS middleware

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your routes
app.use(projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Export the app for Vercel
export default app;
