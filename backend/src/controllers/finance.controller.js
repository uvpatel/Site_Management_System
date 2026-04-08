import Finance from "../models/finance.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { projectId, costCategory, paymentStatus } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (costCategory) filter.costCategory = costCategory;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    const records = await Finance.find(filter)
      .populate("projectId", "projectName")
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const record = await Finance.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const record = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: "Finance record not found" });
    res.json({ success: true, data: record });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const record = await Finance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Finance record not found" });
    res.json({ success: true, message: "Finance record deleted" });
  } catch (error) { next(error); }
};

export const getProjectSummary = async (req, res, next) => {
  try {
    const summary = await Finance.aggregate([
      { $group: { _id: "$projectId", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
      {
        $lookup: { from: "projects", localField: "_id", foreignField: "_id", as: "project" },
      },
      { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
      {
        $project: { projectName: "$project.projectName", budget: "$project.budget", totalAmount: 1, count: 1 },
      },
      { $sort: { totalAmount: -1 } },
    ]);
    res.json({ success: true, data: summary });
  } catch (error) { next(error); }
};

export const getCategorySummary = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const match = {};
    if (projectId) match.projectId = new (await import("mongoose")).default.Types.ObjectId(projectId);
    const summary = await Finance.aggregate([
      { $match: match },
      { $group: { _id: "$costCategory", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } },
    ]);
    res.json({ success: true, data: summary });
  } catch (error) { next(error); }
};
