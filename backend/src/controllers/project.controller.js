import Project from "../models/project.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) filter.projectName = { $regex: search, $options: "i" };

    const projects = await Project.find(filter)
      .populate("createdBy", "name email")
      .populate("members.userId", "name email role")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members.userId", "name email role");
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: project });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Project deleted" });
  } catch (error) { next(error); }
};

export const addMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    const exists = project.members.some(m => m.userId.toString() === req.body.userId);
    if (exists) return res.status(409).json({ success: false, message: "User already a member" });
    project.members.push(req.body);
    await project.save();
    const populated = await Project.findById(project._id).populate("members.userId", "name email role");
    res.json({ success: true, data: populated });
  } catch (error) { next(error); }
};

export const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    project.members = project.members.filter(m => m._id.toString() !== req.params.memberId);
    await project.save();
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
};
