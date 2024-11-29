import express, { request } from 'express';
import joi from 'joi';
import mongoose from 'mongoose';

const statusRoutes = express.Router()

statusRoutes.get("/api/status", async (req, res) => {
    try {
        // Simulating an action that could potentially throw an error
        // For now, just send a simple response
        res.status(200).send("App is running.");
    } catch (error) {
        console.error('Error occurred in /status route:', error);
        res.status(500).send("Internal server error.");
    }
});

export default statusRoutes;
