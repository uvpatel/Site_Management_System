import express from "express";
import { getAll, markRead, markAllRead } from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.get("/", getAll);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);
export default router;
