import express from "express";
import { getAll, getById, create, update, addStock, remove } from "../controllers/inventory.controller.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getAll).post(create);
router.route("/:id").get(getById).put(update).delete(remove);
router.patch("/:id/add-stock", addStock);
export default router;
