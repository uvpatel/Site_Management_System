import express from "express";
import { getAll, getById, create, update, remove } from "../controllers/vendor.controller.js";
import { protect, authorize } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getAll).post(authorize("Admin", "Project_Manager"), create);
router.route("/:id").get(getById).put(authorize("Admin", "Project_Manager"), update).delete(authorize("Admin"), remove);
export default router;
