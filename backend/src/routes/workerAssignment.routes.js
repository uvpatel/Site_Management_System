import express from "express";
import { getAll, create, remove } from "../controllers/workerAssignment.controller.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getAll).post(create);
router.delete("/:id", remove);
export default router;
