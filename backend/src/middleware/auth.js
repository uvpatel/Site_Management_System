import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Protect routes — verify JWT token and attach user to request
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid or expired",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Authorize specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

/**
 * Generate JWT token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
