import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./src/db/connection.js";

// Route imports
import authRoutes from "./src/routes/auth.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import workerRoutes from "./src/routes/worker.routes.js";
import inventoryRoutes from "./src/routes/inventory.routes.js";
import vendorRoutes from "./src/routes/vendor.routes.js";
import procurementRoutes from "./src/routes/procurement.routes.js";
import materialIssueRoutes from "./src/routes/materialIssue.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import workerAssignmentRoutes from "./src/routes/workerAssignment.routes.js";
import financeRoutes from "./src/routes/finance.routes.js";
import leaveRoutes from "./src/routes/leave.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";

// Middleware imports
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts, please try again later." },
});
app.use("/api/v1/auth/", authLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging (dev only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SiteOS API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API healthy", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/workers", workerRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/procurement", procurementRoutes);
app.use("/api/v1/material-issues", materialIssueRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/worker-assignments", workerAssignmentRoutes);
app.use("/api/v1/finance", financeRoutes);
app.use("/api/v1/leaves", leaveRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 SiteOS API server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
