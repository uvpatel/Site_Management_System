import LeaveApplication from "../models/leaveApplication.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { workerId, status } = req.query;
    const filter = {};
    if (workerId) filter.workerId = workerId;
    if (status) filter.status = status;
    const leaves = await LeaveApplication.find(filter)
      .populate("workerId", "name skillType")
      .populate("reviewedBy", "name")
      .sort({ appliedAt: -1 });
    res.json({ success: true, data: leaves });
  } catch (error) { next(error); }
};

export const apply = async (req, res, next) => {
  try {
    const leave = await LeaveApplication.create(req.body);
    const populated = await LeaveApplication.findById(leave._id).populate("workerId", "name skillType");
    res.status(201).json({ success: true, data: populated });
  } catch (error) { next(error); }
};

export const approve = async (req, res, next) => {
  try {
    const leave = await LeaveApplication.findByIdAndUpdate(
      req.params.id,
      { status: "Approved", reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    ).populate("workerId", "name skillType").populate("reviewedBy", "name");
    if (!leave) return res.status(404).json({ success: false, message: "Leave application not found" });
    res.json({ success: true, data: leave });
  } catch (error) { next(error); }
};

export const reject = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const leave = await LeaveApplication.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", reviewedBy: req.user._id, reviewedAt: new Date(), rejectionReason: rejectionReason || "" },
      { new: true }
    ).populate("workerId", "name skillType").populate("reviewedBy", "name");
    if (!leave) return res.status(404).json({ success: false, message: "Leave application not found" });
    res.json({ success: true, data: leave });
  } catch (error) { next(error); }
};
