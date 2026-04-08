import mongoose from "mongoose";

const workerAssignmentSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: [true, "Worker ID is required"],
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task ID is required"],
    },
    fromDate: {
      type: Date,
      required: [true, "From date is required"],
    },
    toDate: {
      type: Date,
      required: [true, "To date is required"],
    },
  },
  { timestamps: true }
);

workerAssignmentSchema.index({ workerId: 1 });
workerAssignmentSchema.index({ taskId: 1 });

const WorkerAssignment = mongoose.model("WorkerAssignment", workerAssignmentSchema);
export default WorkerAssignment;
