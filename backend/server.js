import express from "express";
import projectRoutes from './routes/index.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import statusRoutes from "./routes/status.js";

import authMiddleware from "./middleware/authMiddleware.js";


dotenv.config()

// const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

mongoose.connect(process.env.MONGODB_URI, () => {
    console.log('connect');
}, (e) => console.log(e))


const PORT = process.env.SERVER_PORT || 9000
const origin = process.env.CORS_ORIGIN 

const app = express()

app.use(cors({
    origin
}));

app.use(express.json())
app.use(express.urlencoded())

// Have status endpoint available first
// Status endpoint to keep the app awake, with try-catch for error handling
app.get("/api/status", async (req, res) => {
    try {
        // Simulate success response for status check
        res.status(200).send("App is running.");
    } catch (error) {
        console.error('Error occurred in /status route:', error);
        res.status(500).send("Internal server error.");
    }
});

//First api auth
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);

//Then lock auth routes
app.use(authMiddleware, projectRoutes);


// Auth routes
// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Your app is running in http://192.168.1.181:9000`)
})
