import express from "express";
import { getAll, getById, create, update, remove } from "../controllers/worker.controller.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getAll).post(create);
router.route("/:id").get(getById).put(update).delete(remove);
export default router;
