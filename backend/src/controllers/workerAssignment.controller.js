import WorkerAssignment from "../models/workerAssignment.model.js";
import Task from "../models/task.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { taskId, workerId } = req.query;
    const filter = {};
    if (taskId) filter.taskId = taskId;
    if (workerId) filter.workerId = workerId;
    const assignments = await WorkerAssignment.find(filter)
      .populate("workerId", "name skillType")
      .populate("taskId", "taskName projectId")
      .sort({ fromDate: -1 });
    res.json({ success: true, data: assignments });
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const assignment = await WorkerAssignment.create(req.body);

    // Also add worker to task.workersAssigned
    await Task.findByIdAndUpdate(req.body.taskId, {
      $addToSet: { workersAssigned: req.body.workerId },
    });

    const populated = await WorkerAssignment.findById(assignment._id)
      .populate("workerId", "name skillType")
      .populate("taskId", "taskName");
    res.status(201).json({ success: true, data: populated });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const assignment = await WorkerAssignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.json({ success: true, message: "Assignment removed" });
  } catch (error) { next(error); }
};
