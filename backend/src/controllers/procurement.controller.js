import PurchaseOrder from "../models/purchaseOrder.model.js";
import Item from "../models/item.model.js";
import Finance from "../models/finance.model.js";
import Notification from "../models/notification.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { projectId, deliveryStatus } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (deliveryStatus) filter.deliveryStatus = deliveryStatus;
    const orders = await PurchaseOrder.find(filter)
      .populate("projectId", "projectName")
      .populate("vendorId", "vendorName")
      .populate("itemId", "itemName uom")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const po = await PurchaseOrder.create({ ...req.body, createdBy: req.user._id });

    // Create finance record
    await Finance.create({
      projectId: po.projectId,
      costCategory: "Material",
      amount: po.quantity * po.unitPrice,
      description: `PO ${po._id} created`,
      source: "procurement",
      procurementId: po._id,
      vendorId: po.vendorId,
      itemId: po.itemId,
    });

    // Notification
    await Notification.create({
      type: "procurement_delivery",
      severity: "medium",
      title: `PO created`,
      message: `New purchase order created for project.`,
    });

    // If delivered immediately, update stock
    if (po.deliveryStatus === "delivered") {
      await Item.findByIdAndUpdate(po.itemId, { $inc: { currentStock: po.quantity } });
    }

    const populated = await PurchaseOrder.findById(po._id)
      .populate("projectId", "projectName")
      .populate("vendorId", "vendorName")
      .populate("itemId", "itemName uom");
    res.status(201).json({ success: true, data: populated });
  } catch (error) { next(error); }
};

export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { deliveryStatus } = req.body;
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ success: false, message: "Purchase order not found" });

    const wasDelivered = po.deliveryStatus === "delivered";
    const nowDelivered = deliveryStatus === "delivered";

    po.deliveryStatus = deliveryStatus;
    if (nowDelivered) po.deliveredAt = new Date();
    await po.save();

    // Update inventory on delivery
    if (!wasDelivered && nowDelivered) {
      await Item.findByIdAndUpdate(po.itemId, { $inc: { currentStock: po.quantity } });
      await Notification.create({
        type: "procurement_delivery",
        severity: "low",
        title: `PO delivered`,
        message: `Purchase order ${po._id} has been delivered.`,
      });
    }

    res.json({ success: true, data: po });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const po = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!po) return res.status(404).json({ success: false, message: "Purchase order not found" });
    res.json({ success: true, message: "Purchase order deleted" });
  } catch (error) { next(error); }
};
