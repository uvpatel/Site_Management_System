import mongoose from "mongoose";

const materialIssueSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Issued by is required"],
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

materialIssueSchema.index({ projectId: 1 });
materialIssueSchema.index({ itemId: 1 });

const MaterialIssue = mongoose.model("MaterialIssue", materialIssueSchema);
export default MaterialIssue;
