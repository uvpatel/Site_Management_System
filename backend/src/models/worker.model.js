import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Worker name is required"],
      trim: true,
    },
    skillType: {
      type: String,
      required: [true, "Skill type is required"],
      enum: ["Mason", "Carpenter", "Electrician", "Plumber", "Laborer", "Painter", "Welder", "Other"],
    },
    contact: {
      type: String,
      trim: true,
      default: "",
    },
    rateType: {
      type: String,
      enum: ["Daily", "Hourly"],
      default: "Daily",
    },
    baseRate: {
      type: Number,
      required: [true, "Base rate is required"],
      min: [0, "Base rate cannot be negative"],
    },
    salary: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    projectIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true }
);

workerSchema.index({ skillType: 1 });

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
