import Attendance from "../models/attendance.model.js";
import Worker from "../models/worker.model.js";
import Finance from "../models/finance.model.js";
import Notification from "../models/notification.model.js";

const calculateLaborCost = (worker, status, hoursWorked) => {
  if (!worker || status === "Absent") return 0;
  if (worker.rateType === "Hourly") return worker.baseRate * Number(hoursWorked || 0);
  if (status === "Half Day") return worker.baseRate * 0.5;
  return worker.baseRate;
};

export const getAll = async (req, res, next) => {
  try {
    const { projectId, workerId, date } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (workerId) filter.workerId = workerId;
    if (date) filter.date = new Date(date);
    const records = await Attendance.find(filter)
      .populate("workerId", "name skillType rateType baseRate")
      .populate("projectId", "projectName")
      .populate("recordedBy", "name")
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (error) { next(error); }
};

export const record = async (req, res, next) => {
  try {
    const { workerId, projectId, date, status, hoursWorked } = req.body;
    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });

    const laborCost = calculateLaborCost(worker, status, hoursWorked);
    const dateObj = new Date(date);
    // Zero out time portion for unique index
    dateObj.setHours(0, 0, 0, 0);

    // Upsert attendance
    const attendance = await Attendance.findOneAndUpdate(
      { workerId, date: dateObj },
      {
        workerId,
        projectId,
        date: dateObj,
        status,
        hoursWorked: Number(hoursWorked || 0),
        laborCost,
        recordedBy: req.user._id,
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Create finance record for labor cost
    if (laborCost > 0) {
      await Finance.create({
        projectId,
        costCategory: "Labor",
        amount: laborCost,
        description: `Attendance labor: ${worker.name}`,
        source: "attendance",
        workerId: worker._id,
        attendanceId: attendance._id,
      });
    }

    // Notify on absence
    if (status === "Absent") {
      await Notification.create({
        type: "worker_absence",
        severity: "high",
        title: "Worker absence logged",
        message: `${worker.name} marked absent on ${date}.`,
      });
    }

    const populated = await Attendance.findById(attendance._id)
      .populate("workerId", "name skillType rateType baseRate")
      .populate("projectId", "projectName");
    res.json({ success: true, data: populated });
  } catch (error) { next(error); }
};

export const getSalary = async (req, res, next) => {
  try {
    const { workerId, fromDate, toDate } = req.query;
    const filter = { workerId };
    if (fromDate) filter.date = { ...filter.date, $gte: new Date(fromDate) };
    if (toDate) filter.date = { ...filter.date, $lte: new Date(toDate) };

    const records = await Attendance.find(filter);
    const worker = await Worker.findById(workerId);

    const totalDaysWorked = records.filter(r => r.status === "Present").length;
    const halfDays = records.filter(r => r.status === "Half Day").length;
    const absentDays = records.filter(r => r.status === "Absent").length;
    const totalHours = records.reduce((sum, r) => sum + Number(r.hoursWorked || 0), 0);
    const totalSalary = records.reduce((sum, r) => sum + Number(r.laborCost || 0), 0);

    res.json({
      success: true,
      data: {
        totalDaysWorked,
        halfDays,
        absentDays,
        totalHours,
        totalSalary,
        netSalary: totalSalary,
        worker: worker ? { name: worker.name, rateType: worker.rateType, baseRate: worker.baseRate } : null,
      },
    });
  } catch (error) { next(error); }
};
