import express from "express";
import { getAll, create, updateDeliveryStatus, remove } from "../controllers/procurement.controller.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getAll).post(create);
router.patch("/:id/delivery-status", updateDeliveryStatus);
router.delete("/:id", remove);
export default router;
