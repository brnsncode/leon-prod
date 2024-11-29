import { request } from "express";
import mongoose from "mongoose";

// Define the TaskSchema with timestamps enabled
const TaskSchema = new mongoose.Schema(
  {
    id: Number,
    requestor: String,
    title: String,
    description: String,
    order: Number,
    stage: String,
    isOneList: Boolean,
    capacity: { type: Number, default: 20 },
    updatedAt: { type: Date, default: Date.now }, // Manual handling
    index: Number,
    attachment: [
      { type: String, url: String }
    ],
  },
  
  // { timestamps: true } // Adds `createdAt` and `updatedAt` automatically to each task
);

// Define the ProjectSchema, embedding TaskSchema as a subdocument
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    description: String,
    task: [TaskSchema], // Embed TaskSchema as an array
  },
  // { timestamps: true } // Adds `createdAt` and `updatedAt` to the project
);

export default mongoose.model('Project', ProjectSchema);
