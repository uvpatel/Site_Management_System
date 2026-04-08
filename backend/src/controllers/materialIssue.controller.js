import MaterialIssue from "../models/materialIssue.model.js";
import Item from "../models/item.model.js";
import Task from "../models/task.model.js";
import Finance from "../models/finance.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;
    const issues = await MaterialIssue.find(filter)
      .populate("projectId", "projectName")
      .populate("taskId", "taskName")
      .populate("itemId", "itemName uom unitCost")
      .populate("issuedBy", "name")
      .sort({ issuedAt: -1 });
    res.json({ success: true, data: issues });
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const { itemId, quantity, projectId, taskId } = req.body;
    const qty = Number(quantity);

    // Deduct stock
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    if (item.currentStock < qty) {
      return res.status(400).json({ success: false, message: `Insufficient stock. Available: ${item.currentStock}` });
    }
    item.currentStock = Math.max(0, item.currentStock - qty);
    await item.save();

    const issue = await MaterialIssue.create({
      ...req.body,
      quantity: qty,
      issuedBy: req.user._id,
      issuedAt: new Date(),
    });

    // Create finance record
    await Finance.create({
      projectId,
      costCategory: "Material",
      amount: qty * item.unitCost,
      description: `Material issue: ${item.itemName} (${qty} ${item.uom})`,
      source: "material_issue",
      itemId,
      taskId: taskId || null,
    });

    // Update task materials_used
    if (taskId) {
      await Task.findByIdAndUpdate(taskId, {
        $push: { materialsUsed: { itemId, quantity: qty } },
      });
    }

    const populated = await MaterialIssue.findById(issue._id)
      .populate("projectId", "projectName")
      .populate("itemId", "itemName uom")
      .populate("issuedBy", "name");
    res.status(201).json({ success: true, data: populated });
  } catch (error) { next(error); }
};
