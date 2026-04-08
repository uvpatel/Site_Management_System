import express from "express";
import { getAll, create } from "../controllers/materialIssue.controller.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getAll).post(create);
export default router;
