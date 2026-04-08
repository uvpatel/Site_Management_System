import mongoose from "mongoose";

const leaveApplicationSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: [true, "Worker ID is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
    },
    leaveType: {
      type: String,
      enum: ["Personal", "Medical", "Emergency", "Other"],
      default: "Personal",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

leaveApplicationSchema.index({ workerId: 1 });
leaveApplicationSchema.index({ status: 1 });

const LeaveApplication = mongoose.model("LeaveApplication", leaveApplicationSchema);
export default LeaveApplication;
