import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import Worker from "../models/worker.model.js";
import Item from "../models/item.model.js";
import Finance from "../models/finance.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import Attendance from "../models/attendance.model.js";
import Notification from "../models/notification.model.js";

export const getStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      activeWorkers,
      lowStockItems,
      activeTasks,
      openProcurement,
      unreadNotifications,
      projects,
      financeRecords,
      purchaseOrders,
      attendanceRecords,
    ] = await Promise.all([
      Project.countDocuments(),
      Worker.countDocuments(),
      Item.countDocuments({ $expr: { $lt: ["$currentStock", "$minStockQty"] } }),
      Task.countDocuments({ status: "In Progress" }),
      PurchaseOrder.countDocuments({ deliveryStatus: "ordered" }),
      Notification.countDocuments({ read: false }),
      Project.find().lean(),
      Finance.find().lean(),
      PurchaseOrder.find().lean(),
      Attendance.find().lean(),
    ]);

    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalVendorSpend = purchaseOrders.reduce((sum, po) => sum + (po.quantity * po.unitPrice), 0);
    const attendanceLaborCost = attendanceRecords.reduce((sum, a) => sum + (a.laborCost || 0), 0);

    // Budget chart data
    const budgetChartData = projects.map(project => {
      const spent = financeRecords
        .filter(f => String(f.projectId) === String(project._id))
        .reduce((sum, f) => sum + f.amount, 0);
      return {
        name: project.projectName?.substring(0, 15) || "Unknown",
        budget: project.budget || 0,
        actual: spent,
      };
    });

    // Cost distribution
    const laborCosts = financeRecords.filter(f => f.costCategory === "Labor").reduce((sum, f) => sum + f.amount, 0);
    const materialCosts = financeRecords.filter(f => f.costCategory === "Material").reduce((sum, f) => sum + f.amount, 0);

    res.json({
      success: true,
      data: {
        totalProjects,
        activeWorkers,
        lowStockItems,
        activeTasks,
        openProcurement,
        unreadNotifications,
        totalBudget,
        totalVendorSpend,
        attendanceLaborCost,
        budgetChartData,
        costDistribution: [
          { name: "Labor Costs", value: laborCosts },
          { name: "Material Costs", value: materialCosts },
        ],
      },
    });
  } catch (error) { next(error); }
};
