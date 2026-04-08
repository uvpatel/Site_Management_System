import express from "express";
import { getAll, apply, approve, reject } from "../controllers/leave.controller.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getAll).post(apply);
router.patch("/:id/approve", approve);
router.patch("/:id/reject", reject);
export default router;
