import express from "express";
import { getAll, getById, create, update, updateStatus, updateProgress, remove } from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getAll).post(create);
router.route("/:id").get(getById).put(update).delete(remove);
router.patch("/:id/status", updateStatus);
router.patch("/:id/progress", updateProgress);

export default router;
