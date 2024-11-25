import express from "express";
import projectRoutes from './routes/index.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

dotenv.config()

// const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

mongoose.connect(process.env.MONGODB_PATH, () => {
    console.log('connect');
}, (e) => console.log(e))


const PORT = process.env.SERVER_PORT || 9000
const origin = process.env.CORS_ORIGIN || 'http://192.168.1.181:3000'

const app = express()

app.use(cors({
    origin
}));
app.use(express.json())
app.use(express.urlencoded())

app.use(projectRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users",userRoutes)

// Auth routes
// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Your app is running in http://192.168.1.181:${PORT}`)
})


//Resolve connection issues
//DELETE AFTER DONE:
// set NODE_TLS_REJECT_UNAUTHORIZED=0
