import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    requestor: String,
    title: String,
    description: String,
    order: Number,
    stage: String,
    isOneList: Boolean,
    capacity: { type: Number, default: 10 },
    index: Number,
    attachment: [{ type: String, url: String }]
  },
  { timestamps: true } // Each task has its own timestamps
);

export default mongoose.model('Task', TaskSchema);
