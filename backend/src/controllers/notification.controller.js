import Notification from "../models/notification.model.js";
import Item from "../models/item.model.js";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import Finance from "../models/finance.model.js";

export const getAll = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(100);

    // Generate system notifications
    const systemNotifs = [];

    // Low stock alerts
    const lowStockItems = await Item.find({ $expr: { $lt: ["$currentStock", "$minStockQty"] } });
    lowStockItems.forEach(item => {
      systemNotifs.push({
        _id: `sys-low-stock-${item._id}`,
        type: "low_stock",
        severity: "high",
        title: `Low stock: ${item.itemName}`,
        message: `${item.currentStock} ${item.uom} left (min ${item.minStockQty}).`,
        createdAt: new Date(),
        read: false,
      });
    });

    // Overdue tasks
    const overdueTasks = await Task.find({ status: { $ne: "Completed" }, deadline: { $lt: new Date() } });
    overdueTasks.forEach(task => {
      systemNotifs.push({
        _id: `sys-overdue-${task._id}`,
        type: "overdue_tasks",
        severity: "high",
        title: `Overdue task: ${task.taskName}`,
        message: `Task deadline has passed.`,
        createdAt: new Date(),
        read: false,
      });
    });

    // Budget exceeded
    const projects = await Project.find();
    for (const project of projects) {
      const financeAgg = await Finance.aggregate([
        { $match: { projectId: project._id } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const spent = financeAgg[0]?.total || 0;
      if (spent > project.budget) {
        systemNotifs.push({
          _id: `sys-budget-${project._id}`,
          type: "budget_exceed",
          severity: "high",
          title: `Budget exceeded: ${project.projectName}`,
          message: `Project spending has exceeded planned budget.`,
          createdAt: new Date(),
          read: false,
        });
      }
    }

    // Merge and deduplicate
    const allNotifs = [...notifications.map(n => n.toObject()), ...systemNotifs];
    const map = new Map();
    allNotifs.forEach(n => { if (!map.has(String(n._id))) map.set(String(n._id), n); });
    const merged = Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: merged });
  } catch (error) { next(error); }
};

export const markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.json({ success: true, data: notification });
  } catch (error) { next(error); }
};

export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) { next(error); }
};
