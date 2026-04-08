import express from "express";
import { getAll, getById, create, update, remove, addMember, removeMember } from "../controllers/project.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getAll).post(authorize("Admin", "Project_Manager"), create);
router.route("/:id").get(getById).put(authorize("Admin", "Project_Manager"), update).delete(authorize("Admin"), remove);
router.post("/:id/members", authorize("Admin", "Project_Manager"), addMember);
router.delete("/:id/members/:memberId", authorize("Admin", "Project_Manager"), removeMember);

export default router;
