import Task from "../models/task.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { projectId, status, assignedTo, search } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (status && status !== "all") filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) filter.taskName = { $regex: search, $options: "i" };

    const tasks = await Task.find(filter)
      .populate("projectId", "projectName")
      .populate("assignedTo", "name email")
      .populate("workersAssigned", "name skillType")
      .populate("dependencies", "taskName status")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("projectId", "projectName")
      .populate("assignedTo", "name email")
      .populate("workersAssigned", "name skillType")
      .populate("dependencies", "taskName status");
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (error) { next(error); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id).populate("dependencies", "status");
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // Check dependencies if moving to In Progress
    if (status === "In Progress" && task.dependencies.length > 0) {
      const allDone = task.dependencies.every(dep => dep.status === "Completed");
      if (!allDone) {
        return res.status(400).json({ success: false, message: "Cannot start: incomplete dependencies" });
      }
    }

    task.status = status;
    if (status === "Completed") task.progress = 100;
    await task.save();
    res.json({ success: true, data: task });
  } catch (error) { next(error); }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;
    const p = Math.max(0, Math.min(100, Math.round(progress)));
    const task = await Task.findByIdAndUpdate(req.params.id, { progress: p }, { new: true });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted" });
  } catch (error) { next(error); }
};
