import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  memberRole: { type: String, default: "Site_Engineer" },
  fromDate: { type: Date },
  toDate: { type: Date },
});

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    siteLocation: {
      type: String,
      required: [true, "Site location is required"],
      trim: true,
    },
    projectType: {
      type: String,
      enum: ["Commercial", "Residential", "Infrastructure", "Industrial", "Other"],
      default: "Commercial",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Planning", "Active", "On Hold", "Completed", "Cancelled"],
      default: "Planning",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [projectMemberSchema],
  },
  { timestamps: true }
);

projectSchema.index({ status: 1 });
projectSchema.index({ createdBy: 1 });

const Project = mongoose.model("Project", projectSchema);
export default Project;
