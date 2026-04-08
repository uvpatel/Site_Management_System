/**
 * Global error handler middleware
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for '${field}'. This ${field} already exists.`;
    statusCode = 409;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(". ");
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};
