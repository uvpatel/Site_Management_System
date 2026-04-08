import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed", "Blocked"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    workersAssigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],
    materialsUsed: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        quantity: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

taskSchema.index({ projectId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ assignedTo: 1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;
