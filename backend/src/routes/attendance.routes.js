import express from "express";
import { getAll, record, getSalary } from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getAll).post(record);
router.get("/salary", getSalary);
export default router;
