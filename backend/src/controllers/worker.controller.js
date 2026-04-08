import Worker from "../models/worker.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { skillType, search } = req.query;
    const filter = {};
    if (skillType) filter.skillType = skillType;
    if (search) filter.name = { $regex: search, $options: "i" };
    const workers = await Worker.find(filter).populate("userId", "name email").sort({ name: 1 });
    res.json({ success: true, data: workers });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id).populate("userId", "name email");
    if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
    res.json({ success: true, data: worker });
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const worker = await Worker.create(req.body);
    res.status(201).json({ success: true, data: worker });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
    res.json({ success: true, data: worker });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
    res.json({ success: true, message: "Worker deleted" });
  } catch (error) { next(error); }
};
